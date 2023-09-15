"use client";
import React, { useEffect, useState } from "react";
import Calendar from "@/components/Calendar/Calendar";
import Loader from "@/components/loader/Loader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Schedule() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const API_URL = "https://callejero.com.co/test/api/v1";
    const gameFieldId = localStorage.getItem("gamefieldId");
    try {
      const res = await axios
        .get(
          `${API_URL}/game-fields/${gameFieldId}/booking/get-all-bookings?date=2023-09-15`,
          {
            headers: {
              "x-callejero-web-token": localStorage.getItem("auth"),
              "x-tz": localStorage.getItem("timezone"),
              "accept-language": "es",
            },
          }
        )
        .then((res) => {
          const bookingsFound = res.data.data.schedules;
          setBookings(bookingsFound);
          if (res.status == 200) {
            toast.success("Organizaciones cargadas!", {
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
        className="text-center items-center flex h-screen"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <ToastContainer />
        <div className="w-full">
          {loading ? (
            <>
              <h1 className="text-4xl font-bold">Cargando Reservas</h1>
              <Loader />
            </>
          ) : (
            <Calendar data={bookings} />
          )}
        </div>
      </div>
    );
}

export default Schedule;
