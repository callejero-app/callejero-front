"use client";
import React, { useEffect, useState } from "react";
import Calendar from "@/components/Calendar/Calendar";
import Loader from "@/components/loader/Loader";
import Image from "next/image";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dropdownIcon from "@/public/images/chevron-right.svg";
import "./schedule.css";
import { Select, SelectItem } from "@nextui-org/react";

function Schedule() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [gamefieldIdSelected, setGamefieldIdSelected] = useState("");
  const [gamefieldNameSelected, setGamefieldNameSelected] = useState("");
  const [gamefieldsList, setGamefieldsList] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGamefieldIdSelected(localStorage.getItem("gamefieldId")!);
      setGamefieldNameSelected(localStorage.getItem("gamefieldName")!);
      const gamefieldsObject = localStorage.getItem("gamefieldsTuples");
      const gmList = gamefieldsObject && JSON.parse(gamefieldsObject);
      setGamefieldsList(gmList);
      console.log("gamefieldsList", gamefieldsList);
      // fetchBookings(gamefieldIdSelected);
    }
  }, []);

  const fetchBookings = async (gamefieldId: string) => {
    setLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const url = `${API_URL}/game-fields/${gamefieldId}/booking/get-all-bookings`;
    const gameFieldId = localStorage.getItem("gamefieldId");
    try {
      const res = await axios
        .get(url, {
          params: {
            "start-date": "2023-08-01",
            "end-date": "2023-10-30",
          },
          headers: {
            "x-callejero-web-token": localStorage.getItem("auth"),
            "x-tz": localStorage.getItem("timezone"),
            "accept-language": "es",
          },
        })
        .then((res) => {
          const bookingsFound = res.data.data.schedules;
          setBookings(bookingsFound);
          if (res.status == 200) {
            toast.success("Reservas cargadas!", {
              autoClose: 2000,
              icon: "✅",
            });
            setLoading(false);
          }
        });
    } catch (error) {
      toast.error("Something failed!", {
        autoClose: 2000,
        icon: "❌",
      });
      setLoading(false);
    }
  };

  const handleChangeGamefield = (name: string, id: any) => {
    setGamefieldNameSelected(name);
    setGamefieldIdSelected(id);
    localStorage.setItem("gamefieldName", name);
    localStorage.setItem("gamefieldId", id);
    fetchBookings(id);
    console.log(`Se cambio al gamefield: ${name} con id: ${id}`);
  };

  //middleware
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.href;
      console.log("path", path);
      if (!path.includes("/login")) {
        validateToken();
      }
    }
  }, []);
  const validateToken = () => {
    const token = localStorage.getItem("auth");
    if (token) {
      setVisible(true);
    } else {
      window.location.href = "/login";
    }
  };

  if (visible)
    return (
      <div
        className="bg-callejero"
        // className="text-center items-center flex h-screen"
        // style={{ height: "calc(100vh - 80px)" }}
      >
        <ToastContainer />
        <div
          className="w-full"
          style={{ borderRadius: "16px 16px 0 0", background: "white" }}
        >
          {loading ? (
            <>
              <h1 className="text-4xl font-bold">Cargando Reservas</h1>
              <Loader />
            </>
          ) : (
            <>
              <div className="flex pt-4">
                <h1 className="text-2xl pl-6">
                  {localStorage.getItem("organizationName")} /{" "}
                  <b>{localStorage.getItem("gamefieldName")}</b>
                </h1>
                <div>
                  <Image
                    src={dropdownIcon}
                    alt="icon"
                    height={38}
                    priority={true}
                    className="mx-auto dropdown-icon"
                  />
                  <select
                    name="gamefields"
                    placeholder="Select Gamefield"
                    value={gamefieldNameSelected!}
                    className="ml-4 select-gamefields"
                    onChange={(e) =>
                      handleChangeGamefield(
                        e.target.value,
                        e.target.options[e.target.selectedIndex].id
                      )
                    }
                  >
                    {gamefieldsList.map((gm: any) => (
                      <option key={gm.id} value={gm.name} id={gm.id}>
                        {gm.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Calendar data={bookings} />
            </>
          )}
        </div>
      </div>
    );
}

export default Schedule;
