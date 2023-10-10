"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Select, SelectItem } from "@nextui-org/react";
import ModalLoading from "@/components/ModalLoading";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import Calendar from "@/components/Calendar/Calendar";
import "./schedule.scss";

function Schedule() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [gamefieldIdSelected, setGamefieldIdSelected] = useState("");
  const [gamefieldNameSelected, setGamefieldNameSelected] = useState("");
  const [gamefieldsList, setGamefieldsList] = useState<any[]>();
  const [gridModified, setGridModified] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGamefieldIdSelected(localStorage.getItem("gamefieldId")!);
      setGamefieldNameSelected(localStorage.getItem("gamefieldName")!);
      const gamefieldsObject = localStorage.getItem("gamefieldsTuples");
      const gmList = gamefieldsObject && JSON.parse(gamefieldsObject);
      setGamefieldsList(gmList);
      fetchBookings(localStorage.getItem("gamefieldId")!);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!gridModified) insertPrevButtonInCalendar();
      setGridModified(true);
      setVisible(true);
    }
  }, []);

  const insertPrevButtonInCalendar = () => {
    const timer = setTimeout(() => {
      //prev next button
      const prevButton = document.getElementsByClassName("fc-toolbar-chunk")[0];
      prevButton.classList.add("grid", "h-20", "prevNextButtons");
      const firstGrid = document.getElementsByClassName("fc-timegrid-axis")[0];
      if (prevButton && firstGrid) {
        firstGrid.append(prevButton);
      }
      //select gamefield
      const selectGamefield =
        document.getElementsByClassName("selectGamefield")[0];
      const toolbarRightContainer =
        document.getElementsByClassName("fc-toolbar-chunk")[1];
      toolbarRightContainer.insertBefore(
        selectGamefield,
        toolbarRightContainer.firstChild
      );
      toolbarRightContainer.classList.add("flex");
    }, 100);
    return () => clearTimeout(timer);
  };

  const fetchBookings = async (gamefieldId: string) => {
    setLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const url = `${API_URL}/game-fields/${gamefieldId}/booking/get-all-bookings`;
    try {
      const res = await axios
        .get(url, {
          params: {
            "start-date": "2023-08-01",
            "end-date": "2023-12-30",
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

  const handleChangeGamefield = (id: string) => {
    let gamefield = gamefieldsList?.find((e) => e.id == id);
    setGamefieldIdSelected(id);
    setGamefieldNameSelected(gamefield.name);
    localStorage.setItem("gamefieldName", gamefield.name);
    localStorage.setItem("gamefieldId", id);
    fetchBookings(id);
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
      <div className={`${gridModified} ? "bg-callejero" : "opacity-0"`}>
        <ToastContainer />
        <div
          className="w-full own-toolbar"
          style={{ borderRadius: "16px 16px 0 0", background: "white" }}
        >
          {loading && (
            <>
              <ModalLoading txt={gamefieldNameSelected} />
            </>
          )}
          <>
            <div className="flex pt-4 items-center">
              <div className="own-toolbar px-6 flex w-full">
                <div className="w-1/2 h-11 flex items-center">
                  <h1 className="text-2xl own-toolbar__breadcumb">
                    {localStorage.getItem("organizationName")} /{" "}
                    <b className="own-toolbar__breadcumb--gamefield">
                      {localStorage.getItem("gamefieldName")}
                    </b>
                  </h1>
                </div>
                <div className="w-1/2 text-right">
                  <button
                    onClick={() => {
                      prompt("Ingresa fecha de la reserva");
                    }}
                    className="own-toolbar__create-booking own-toolbar__create-booking text-white bg-callejero
                        rounded-full px-6 py-2.5 hover:scale-105 duration-300"
                  >
                    Crear una reserva
                  </button>
                </div>
              </div>
              <div className="selectGamefield w-60">
                <Select
                  aria-labelledby="select-gamefield"
                  labelPlacement="outside"
                  radius="full"
                  placeholder={gamefieldNameSelected}
                  onChange={(e) => {
                    if (
                      e.target.value !== gamefieldIdSelected &&
                      e.target.value !== ""
                    )
                      handleChangeGamefield(e.target.value);
                  }}
                >
                  {gamefieldsList !== undefined ? (
                    gamefieldsList.map((g) => (
                      <SelectItem key={g.id} value={g.name} textValue="">
                        {g.name}
                      </SelectItem>
                    ))
                  ) : (
                    <></>
                  )}
                </Select>
                <div className="selectGamefield__arrow"></div>
              </div>
            </div>
            <Calendar data={bookings} />
          </>
        </div>
      </div>
    );
}

export default Schedule;
