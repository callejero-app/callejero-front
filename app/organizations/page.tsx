"use client";
import Loader from "@/components/loader/Loader";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { globals } from "../globals";

function Organizations() {
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([
    { _id: "", name: "" },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchOrganization();
    }
  }, []);

  const fetchOrganization = async () => {
    setLoading(true);
    const clientId = localStorage.getItem("clientId");
    try {
      const res = await axios
        .get(`${globals.apiURL}/organizations/${clientId}`, {
          headers: {
            "x-callejero-web-token": localStorage.getItem("auth"),
            "x-tz": localStorage.getItem("timezone"),
            "accept-language": "es",
          },
        })
        .then((res) => {
          const orgsFound = res.data.data;
          if (orgsFound.length == 1) {
            const orgId = orgsFound[0]._id;
            const orgName = orgsFound[0].name;
            localStorage.setItem("organizationId", orgId);
            localStorage.setItem("organizationName", orgName);
            setOrganizations([{ _id: orgId, name: orgName }]);
          } else {
            setOrganizations(orgsFound);
          }
          if (res.status == 200 && orgsFound.length > 0) {
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

  const handleSelectOrg = (id: string, name: string) => {
    localStorage.setItem("organizationId", id);
    localStorage.setItem("organizationName", name);
    window.location.href = "/gamefields";
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
              <h1 className="text-4xl font-bold">Cargando Organizaciones</h1>
              <Loader />
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold">
                Selecciona una Organización
              </h1>
              <div className="mx-auto sm:w-3/12 lg:w-2/12 w-5/12">
                {organizations.map((org) => (
                  <button
                    onClick={() => handleSelectOrg(org._id, org.name)}
                    key={org._id}
                    className="mt-8 bg-callejero px-4 py-4 block mx-auto font-semibold 
                    rounded-full text-white hover:scale-105 transition-all w-44"
                  >
                    {org.name}
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
