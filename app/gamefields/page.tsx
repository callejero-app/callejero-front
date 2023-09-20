"use client";
import Loader from "@/components/loader/Loader";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Organizations() {
  const [loading, setLoading] = useState(false);
  const [gamefields, setGamefields] = useState<any[]>([]);
  const [gamefieldsCharged, setGamefieldCharged] = useState([
    { id: "", name: "" },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchGamefields();
    }
  }, []);

  const fetchGamefields = async () => {
    setLoading(true);
    const API_URL = "https://callejero.com.co/test/api/v1";
    const organizationId = localStorage.getItem("organizationId");
    try {
      const res = await axios
        .get(`${API_URL}/game-fields/org/${organizationId}`, {
          headers: {
            "x-callejero-web-token": localStorage.getItem("auth"),
            "x-tz": localStorage.getItem("timezone"),
            "accept-language": "es",
          },
        })
        .then((res) => {
          const gamefieldsFound = res.data.data.results;
          const gamefieldsTuples = gamefieldsFound.map((gm: any) => {
            return { id: gm.id, name: gm.name };
          });
          const gamefieldsTuplesJSON = JSON.stringify(gamefieldsTuples);
          localStorage.setItem("gamefieldsTuples", gamefieldsTuplesJSON);
          const storage = localStorage.getItem("gamefieldsTuples");
          console.log("storage", storage);
          if (gamefieldsFound.length == 1) {
            window.location.href = "/gamefields";
          } else {
            setGamefields(gamefieldsFound);
          }
          if (res.status == 200) {
            toast.success("Canchas cargadas!", {
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

  const handleSelectGamefield = (id: string, name: string) => {
    localStorage.setItem("gamefieldId", id);
    localStorage.setItem("gamefieldName", name);
    window.location.href = "/schedule";
  };

  //middleware
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.href;
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
              <h1 className="text-4xl font-bold">Cargando Canchas</h1>
              <Loader />
            </>
          ) : (
            <>
              <h1 className="text-6xl font-bold">
                {localStorage.getItem("organizationName")}
              </h1>
              <h2 className="text-4xl font-bold mt-8">Selecciona una cancha</h2>
              <div className="mx-auto sm:w-3/12 lg:w-2/12 w-5/12">
                {gamefields.map((gamefield) => (
                  <button
                    onClick={() =>
                      handleSelectGamefield(gamefield.id, gamefield.name)
                    }
                    key={gamefield.id}
                    className="mt-8 bg-callejero px-4 py-4 block mx-auto font-semibold 
                    rounded-full text-white hover:scale-105 transition-all w-44"
                  >
                    {gamefield.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
}

export default Organizations;
