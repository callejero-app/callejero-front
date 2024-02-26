"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Select, SelectItem } from "@nextui-org/react";
import ModalLoading from "@/components/ModalLoading";
import axios from "axios";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/Modal";

import Calendar from "@/components/Calendar/Calendar";
import "./schedule.scss";
import { globals } from "../../globals";

function Schedule() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [suscriptions, setSuscriptions] = useState<any[]>([]);
  const [closeTimes, setCloseTimes] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [gamefieldIdSelected, setGamefieldIdSelected] = useState("");
  const [gamefieldNameSelected, setGamefieldNameSelected] = useState("");
  const [gamefieldsList, setGamefieldsList] = useState([
    { id: "", name: "", price: "" },
  ]);
  const [gridModified, setGridModified] = useState(false);
  const [modalDetail, setModalDetail] = useState({
    title: "",
    subtitle: "",
    type: "",
  });
  const [modalInfoVisible, setModalInfoVisible] = useState(false);

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
      // if (!gridModified) insertPrevButtonInCalendar();
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
    const url = `${globals.apiURL}/game-fields/${gamefieldId}/booking/get-all-bookings`;
    try {
      const res = await axios
        .get(url, {
          params: {
            "start-date": "2023-12-01",
            "end-date": "2024-02-28",
            "closed-times": true,
          },
          headers: {
            "x-callejero-web-token": localStorage.getItem("auth"),
            "x-tz": localStorage.getItem("timezone"),
          },
        })
        .then((res) => {
          const bookingsFound = res.data.data.schedules;
          const suscriptionsFound = res.data.data.suscriptions;
          const closeTimesFound = res.data.data.times;
          const historyFound = res.data.data.history;

          setBookings(bookingsFound);
          setSuscriptions(suscriptionsFound);
          setCloseTimes(closeTimesFound);
          setHistory(historyFound);
          if (res.status == 200) {
            setModalDetail({
              title: "Reservas cargadas!",
              subtitle: "",
              type: "success",
            });
            setModalInfoVisible(true);
            setTimeout(() => {
              setModalInfoVisible(false);
            }, 1200);
            // toast.success("Reservas cargadas!", {
            //   autoClose: 2000,
            //   icon: "✅",
            // });
            setLoading(false);
          }
        });
    } catch (error) {
      //@ts-ignore
      const codeError = error.response.data.error.code;
      //@ts-ignore
      const codeMessage = error.response.data.error.message;
      switch (codeError) {
        case "auth.web.failure.session.1000":
        case "auth.web.failure.session.1001":
        case "auth.web.failure.session.1002":
        case "auth.web.failure.session.1003":
        case "auth.web.failure.session.1004:":
          setModalDetail({
            title: "Sesión caducada!",
            subtitle: "",
            type: "error",
          });
          setModalInfoVisible(true);
          localStorage.clear();
          window.location.href = "/login";
          break;
        default:
          setModalDetail({ title: codeMessage, subtitle: "", type: "error" });
          setModalInfoVisible(true);
          break;
      }
      setLoading(false);
    }
  };

  const handleChangeGamefield = (id: string) => {
    let gamefield = gamefieldsList?.find((e) => e.id == id);
    setGamefieldIdSelected(id);
    if (gamefield) setGamefieldNameSelected(gamefield.name);
    if (gamefield) localStorage.setItem("gamefieldName", gamefield.name);
    localStorage.setItem("gamefieldId", id);
    if (gamefield) localStorage.setItem("totalPrice", gamefield.price);
    setSuscriptions([]);
    fetchBookings(id);
  };

  const updateOpen = (open: boolean) => {
    setModalInfoVisible(open);
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
      <div className={gridModified ? "bg-callejero" : "opacity-0"}>
        <ToastContainer />
        <div
          className="w-full own-toolbar"
          style={{ borderRadius: "16px 16px 0 0", background: "white" }}
        >
          {modalInfoVisible && (
            <Modal
              title={modalDetail.title}
              footer={modalDetail.subtitle}
              type={modalDetail.type}
              updateOpenInfo={updateOpen}
            />
          )}
          {loading && (
            <ModalLoading
              title={gamefieldNameSelected}
              footer="Cargando reservas"
            />
          )}
          <>
            <div className="own-toolbar__container items-center md:block md:pt-4 bg-callejero md:bg-white">
              <div className="px-6 w-full flex flex-col md:flex-row">
                <div className="w-full h-11 items-center hidden md:flex">
                  <h1 className="text-2xl own-toolbar__breadcumb">
                    <a
                      className="own-toolbar__breadcumb--back"
                      href="/selectgamefield"
                    >
                      {localStorage.getItem("organizationName")}
                    </a>{" "}
                    /{" "}
                    <b className="own-toolbar__breadcumb--gamefield">
                      {localStorage.getItem("gamefieldName")}
                    </b>
                  </h1>
                </div>
                <div className="mx-auto md:flex md:items-end md:flex-col md:w-full">
                  <div className="selectGamefield w-72 md:w-60">
                    {gamefieldsList && gamefieldsList.length > 1 && (
                      <div>
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
                          {gamefieldsList.map((g) => (
                            <SelectItem key={g.id} value={g.name} textValue="">
                              {g.name}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    )}

                    {gamefieldsList !== undefined &&
                      gamefieldsList.length == undefined && (
                        <div>
                          <Select
                            aria-labelledby="select-gamefield"
                            labelPlacement="outside"
                            radius="full"
                            placeholder={gamefieldNameSelected}
                          >
                            <SelectItem
                              key={gamefieldIdSelected}
                              value={gamefieldNameSelected}
                              textValue=""
                            >
                              {gamefieldNameSelected}
                            </SelectItem>
                          </Select>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <Calendar
              data={bookings}
              suscriptions={suscriptions}
              closeTimes={closeTimes}
              history={history}
            />
          </>
        </div>
      </div>
    );
}

export default Schedule;
