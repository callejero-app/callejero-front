"use client";
import Loader from "@/components/loader/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "@nextui-org/react";
import ModalLoading from "@/components/ModalLoading";
import Modal from "@/components/Modal";
import "./styles.scss";
// import { globals } from "../globals";

function SelectGamefield() {
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [loadingGamefields, setLoadingGamefields] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([
    { id: "", name: "", image: "" },
  ]);
  const [orgSelected, setOrgSelected] = useState({ id: "", name: "" });
  const [gamefields, setGamefields] = useState<any[]>([]);
  const [modalDetail, setModalDetail] = useState({
    title: "",
    subtitle: "",
    type: "",
  });
  const [modalErrorVisible, setModalErrorVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchOrganization();
    }
  }, []);

  useEffect(() => {
    const container = document.getElementById("orgs-container");
    container &&
      container.addEventListener("wheel", function (event) {
        if (event.deltaY !== 0) {
          container.scrollLeft += event.deltaY;
          event.preventDefault();
        }
      });
  }, []);

  const fetchOrganization = async () => {
    setLoadingOrgs(true);
    const clientId = localStorage.getItem("clientId");
    try {
      const res = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${clientId}`, {
          // withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-callejero-web-token": localStorage.getItem("auth"),
            "x-tz": localStorage.getItem("timezone"),
            "accept-language": "es",
          },
        })
        .then((res) => {
          // const orgsFound = res.data.data;
          const orgsFound = res.data.data.results;
          if (orgsFound.length == 1) {
            const orgId = orgsFound[0].id;
            const orgName = orgsFound[0].name;
            const orgImg = orgsFound[0].image;
            localStorage.setItem("organizationId", orgId);
            localStorage.setItem("organizationName", orgName);
            setOrganizations([{ id: orgId, name: orgName, image: orgImg }]);
          } else {
            setOrganizations(orgsFound);
          }
          if (res.status == 200 && orgsFound.length > 0) {
            setModalDetail({
              title: "Organizaciones cargadas!",
              subtitle: "",
              type: "success",
            });
            setModalErrorVisible(true);
            setTimeout(() => {
              setModalErrorVisible(false);
            }, 1200);
            // toast.success("Organizaciones cargadas!", {
            //   autoClose: 2000,
            //   icon: "✅",
            // });
            setLoadingOrgs(false);
          }
        });
    } catch (error) {
      // @ts-ignore
      const codeError = error.response?.data?.error?.code;
      //@ts-ignore
      const codeMessage = error.response?.data?.error?.message;
      // console.log("codeError", codeError);
      // console.log("error", error);
      switch (codeError) {
        case "auth.web.failure.session.1000":
        case "auth.web.failure.session.1001":
        case "auth.web.failure.session.1002":
        case "auth.web.failure.session.1003":
        case "auth.web.failure.session.1004:":
          setModalDetail({ title: codeMessage, subtitle: "", type: "error" });
          setModalErrorVisible(true);
          localStorage.clear();
          window.location.href = "/login";
          break;
        default:
          setModalDetail({ title: codeMessage, subtitle: "", type: "error" });
          setModalErrorVisible(true);
          break;
      }
    }
  };

  const handleSelectOrg = (id: string, name: string) => {
    if (id != orgSelected.id) {
      localStorage.setItem("organizationId", id);
      localStorage.setItem("organizationName", name);
      setOrgSelected({ id: id, name: name });
      fetchGamefields();
    } else {
      setModalDetail({
        title: "Esta cancha ya esta seleccionada",
        subtitle: "Intenta escogiendo otra cancha",
        type: "error",
      });
      setModalErrorVisible(true);
      // setTimeout(() => {
      //   setModalErrorVisible(false);
      // }, 1000);
      // toast.error("Esta cancha ya esta seleccionada!", {
      //   autoClose: 1000,
      //   icon: "⚠️",
      // });
    }
  };

  const fetchGamefields = async () => {
    setLoadingGamefields(true);
    const organizationId = localStorage.getItem("organizationId");
    try {
      const res = await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/game-fields/org/${organizationId}`,
          {
            headers: {
              "x-callejero-web-token": localStorage.getItem("auth"),
              "x-tz": localStorage.getItem("timezone"),
              "accept-language": "es",
            },
          }
        )
        .then((res) => {
          const gamefieldsFound = res.data.data.results;
          let gamefieldsTuples;
          if (gamefieldsFound.length == 1) {
            gamefieldsTuples = {
              id: gamefieldsFound[0].id,
              name: gamefieldsFound[0].name,
            };
            localStorage.setItem("gamefieldId", gamefieldsFound[0].id);
            localStorage.setItem("gamefieldName", gamefieldsFound[0].name);
          }
          if (gamefieldsFound.length > 1) {
            gamefieldsTuples = gamefieldsFound.map((gm: any) => {
              return { id: gm.id, name: gm.name };
            });
          }
          const gamefieldsTuplesJSON = JSON.stringify(gamefieldsTuples);
          localStorage.setItem("gamefieldsTuples", gamefieldsTuplesJSON);
          const storage = localStorage.getItem("gamefieldsTuples");
          // if (gamefieldsFound.length == 1) {
          //   window.location.href = "/schedule";
          // } else {
          //   setGamefields(gamefieldsFound);
          // }
          setGamefields(gamefieldsFound);
          if (res.status == 200) {
            setModalDetail({
              title: "Canchas cargadas!",
              subtitle: "",
              type: "success",
            });
            setModalErrorVisible(true);
            setTimeout(() => {
              setModalErrorVisible(false);
            }, 1200);
            // toast.success("Canchas cargadas!", {
            //   autoClose: 2000,
            //   icon: "✅",
            // });
            setLoadingGamefields(false);
          }
        });
    } catch (error) {
      //@ts-ignore
      const codeError = error.response.data.error.code;
      //@ts-ignore
      const codeMessage = error.response.data.error.message;
      // console.log("codeError", codeError);
      // console.log("error", error);
      switch (codeError) {
        case "auth.web.failure.session.1000":
        case "auth.web.failure.session.1001":
        case "auth.web.failure.session.1002":
        case "auth.web.failure.session.1003":
        case "auth.web.failure.session.1004:":
          setModalDetail({ title: codeMessage, subtitle: "", type: "error" });
          setModalErrorVisible(true);
          localStorage.clear();
          window.location.href = "/login";
          break;
        default:
          setModalDetail({ title: codeMessage, subtitle: "", type: "error" });
          setModalErrorVisible(true);
          break;
      }
      setLoadingGamefields(false);
    }
  };

  const handleSelectGamefield = (id: string, name: string) => {
    localStorage.setItem("gamefieldId", id);
    localStorage.setItem("gamefieldName", name);
    window.location.href = "/schedule";
  };

  const updateOpen = (open: boolean) => {
    setModalErrorVisible(open);
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
      <div className="Orgs Section">
        <h1
          className={`text-2xl font-medium text-callejero mt-6 text-left px-[28px] ${
            loadingOrgs ? "opacity-0" : "opacity-100"
          }`}
        >
          Selecciona una Organizacion
        </h1>
        <div
          id="orgs-container"
          style={{ overflow: "scroll" }}
          className="text-center items-center flex h-[160px] border-b-small border-slate-200 content-center"
        >
          <ToastContainer />
          <div className="">
            {loadingOrgs ? (
              <div className={`${loadingOrgs ? "w-screen h-[172px]" : ""}`}>
                <h1 className="text-2xl font-medium mt-4">
                  Cargando organizaciones
                </h1>
                <Spinner size="lg" color="primary" className="mt-8" />
              </div>
            ) : (
              <div className="">
                <div className="flex px-[28px]">
                  {organizations.map((org) => (
                    <button
                      onClick={() => handleSelectOrg(org.id, org.name)}
                      key={org.id}
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8)), url(${
                          org.image ? org.image : "/images/default-org-img.jpeg"
                        })`,
                        backgroundSize: "cover",
                      }}
                      className="btn-org font-semibold text-white hover:scale-105
                   transition-all w-[224px] h-[104px] mr-[28px] rounded-lg"
                    >
                      {org.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <ToastContainer />
          <div className="w-full">
            {modalErrorVisible && (
              <Modal
                title={modalDetail.title}
                footer={modalDetail.subtitle}
                type={modalDetail.type}
                updateOpenInfo={updateOpen}
              />
            )}
            {loadingGamefields ? (
              <>
                <ModalLoading
                  title={orgSelected.name}
                  footer="Cargando canchas"
                />
              </>
            ) : (
              <>
                {gamefields.length !== 0 && (
                  <div>
                    <h1
                      className={`text-2xl font-medium text-callejero mt-6 text-left px-[28px] ${
                        loadingGamefields ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      Selecciona una Cancha
                    </h1>
                    <p className="text-left px-[28px] text-[#818181] mt-2">
                      {localStorage.getItem("organizationName")} tiene{" "}
                      {gamefields.length} canchas
                    </p>
                  </div>
                )}
                <div className="px-[28px]">
                  {gamefields.map((gamefield) => (
                    <button
                      onClick={() =>
                        handleSelectGamefield(gamefield.id, gamefield.name)
                      }
                      key={gamefield.id}
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6)), url(${
                          gamefield.image
                            ? gamefield.image
                            : "/images/default-org-img.jpeg"
                        })`,
                        backgroundSize: "cover",
                      }}
                      className="btn-gamefield mt-8 bg-callejero px-4 py-4 font-semibold
                      rounded-2xl text-white hover:scale-[0.95] transition-all w-full 
                      text-2xl h-[210px] md:mx-[12px] md:w-[330px] drop-shadow-xl"
                    >
                      {gamefield.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
}

export default SelectGamefield;
