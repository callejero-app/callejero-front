import React, { FormEvent, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import moment from "moment";
import "moment/locale/es";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import Image from "next/image";
import calendar from "@/public/images/calendar.svg";

const ModalCreateEvent: React.FC<{
  open: boolean;
  updateOpen: Function;
  addEvent: Function;
  handleCreateEventError: Function;
  bookingInfo: {
    start: { getHours: Function; getDay: Function; getDate: Function };
    end: { getHours: Function };
  };
}> = ({ open, updateOpen, addEvent, handleCreateEventError, bookingInfo }) => {
  moment.locale("es");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalOpen, setModalOpen] = useState(open);
  const [loading, setLoading] = useState(false);
  const [emptyDescription, setEmptyDescription] = useState(false);

  const [booking, setBooking] = useState({
    //@ts-ignore
    dayName: bookingInfo.dayName,
    //@ts-ignore
    dayNumber: bookingInfo.dayNumber,
    //@ts-ignore
    monthName: bookingInfo.monthName,
    //@ts-ignore
    startHour: bookingInfo.startHour,
    //@ts-ignore
    endHour: bookingInfo.endHour,
    //@ts-ignore
    startsAtDate: bookingInfo.startsAtDate,
    //@ts-ignore
    startsAtTime: bookingInfo.startsAtTime,
    //@ts-ignore
    startsAtTime24: bookingInfo.startsAtTime24,
    //@ts-ignore
    endsAtDate: bookingInfo.endsAtDate,
    //@ts-ignore
    endsAtTime: bookingInfo.endsAtTime,
    //@ts-ignore
    endsAtTime24: bookingInfo.endsAtTime24,
    //@ts-ignore
    totalPrice: localStorage.getItem("totalPrice"),
  });

  useEffect(() => {
    onOpen();
    const closeBtn = document.getElementsByClassName(
      "absolute appearance-none select-none top-1 right-1 p-2 text-foreground-500 rounded-full hover:bg-default-100 active:bg-default-200 tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2"
    )[0];
    closeBtn.classList.add("close-btn");
    closeBtn.addEventListener("click", () => close());
    // deleteHoverGray();
  }, []);

  // const deleteHoverGray = () => {
  //   document
  //     .getElementsByClassName(
  //       "relative px-3 w-full inline-flex shadow-sm tap-highlight-transparent bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-unit-10 rounded-medium flex-col items-start justify-center gap-0 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-14 py-2"
  //     )[0]
  //     .classList.remove("data-[hover=true]:bg-default-200");
  //   document
  //     .getElementsByClassName(
  //       "relative px-3 w-full inline-flex shadow-sm tap-highlight-transparent bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-unit-10 rounded-medium flex-col items-start justify-center gap-0 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-14 py-2"
  //     )[0]
  //     .classList.remove("data-[hover=true]:bg-default-200");
  // };

  const createEventCalendar = (
    description: string,
    error: boolean,
    errorMessage: string
  ) => {
    if (error == false) {
      const newEvent = {
        justCreated: true,
        newStart: booking.startHour,
        newEnd: booking.endHour,
        title: description,
        //@ts-ignore
        start: `${booking.startsAtDate} ${bookingInfo.startsAtTime24}`,
        //@ts-ignore
        end: `${booking.endsAtDate} ${bookingInfo.endsAtTime24}`,
        description: description,
        tag: "web",
        totalPrice: localStorage.getItem("totalPrice"),
      };
      addEvent(newEvent);
    } else {
      handleCreateEventError(errorMessage);
    }
  };

  const createBooking = async () => {
    setLoading(true);
    setEmptyDescription(false);
    let descriptionEl = document.getElementById("description");
    //@ts-ignore
    const description = descriptionEl != null ? descriptionEl.value : "";
    console.log("description", description);

    if (description == "") {
      console.log("la descripcion no puede estar vacia");
      setLoading(false);
      setEmptyDescription(true);
    } else {
      setEmptyDescription(false);
      const gamefieldId = localStorage.getItem("gamefieldId");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      // const url = `${API_URL}/game-fields/${gamefieldId}/booking/create-client`;
      const url = `https://callejero.com.co/test/api/v1/game-fields/${gamefieldId}/booking/create-client`;
      const data = {
        startsAtDate: booking.startsAtDate,
        startsAtTime: booking.startsAtTime24,
        endsAtDate: booking.endsAtDate,
        endsAtTime: booking.endsAtTime24,
        description: description,
      };
      const headers = {
        "x-callejero-web-token": localStorage.getItem("auth"),
        "x-tz": localStorage.getItem("timezone"),
        "accept-language": "es",
      };
      try {
        const res = await axios.post(url, data, { headers }).then((res) => {
          if (res.status == 200) {
            createEventCalendar(description, false, "");
            setLoading(false);
            close();
          }
        });
      } catch (error) {
        console.log(error);
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
            localStorage.clear();
            window.location.href = "/login";
            break;
          default:
            createEventCalendar("", true, codeMessage);
            break;
        }
        createEventCalendar("", true, codeMessage);
        close();
      }
    }
  };

  const close = () => {
    setModalOpen(false);
    updateOpen(false);
  };

  return (
    <>
      <Modal isOpen={modalOpen} onOpenChange={onOpenChange}>
        <ToastContainer />
        {/* {modalInfoVisible && (
          <Modal
            title={modalDetail.title}
            footer={modalDetail.subtitle}
            type={modalDetail.type}
            updateOpen={updateOpen}
          />
        )} */}
        <ModalContent>
          {(onClose) => (
            <div className="modal">
              <ModalHeader className="flex flex-col gap-1 modal__title mt-6">
                Crear una reserva
              </ModalHeader>
              <ModalBody>
                <Select
                  label="Tipo de Juego"
                  placeholder="Reserva Full"
                  className="modal__select modal__select--disabled mb-2"
                  isDisabled
                >
                  <SelectItem key={"1"} value={"a"}>
                    Selecciona una opción
                  </SelectItem>
                </Select>
                <div className="flex mb-3">
                  <Image
                    src={calendar}
                    alt="icon"
                    height={15}
                    priority={true}
                  />

                  <p className=" modal__date ml-2">
                    <span className="capitalize">{booking.dayName}</span>,{" "}
                    {booking.dayNumber} de {booking.monthName} ·{" "}
                    <span className="modal__date--hours font-medium">
                      {booking.startHour} - {booking.endHour}
                    </span>
                  </p>
                </div>
                <Select
                  label="Frecuencia (opcional)"
                  placeholder="Selecciona una opción"
                  className="modal__select modal__select--disabled mb-3 hidden"
                  isDisabled
                >
                  <SelectItem key={"1"} value={"a"}>
                    Selecciona una opcion
                  </SelectItem>
                </Select>
                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Descripcción (Requerido)"
                  className={`modal__input mb-2 text-xs ${
                    emptyDescription ? "modal__input--danger" : ""
                  }`}
                />
                <div className=" mb-2 border-b-small border-slate-200"></div>
                <div className="flex column justify-between mb-2 items-center hidden">
                  <p className="font-medium text-sm text-[#393939]">
                    Responsables
                  </p>
                  <button
                    className="text-xs w-36 h-8 border border-callejero rounded-full px-3 opacity-30"
                    disabled
                  >
                    Añadir responsables
                  </button>
                </div>
                <div className="mb-2 border-b-small border-slate-200 hidden"></div>
                <div className="mb-2">
                  <p className="font-medium text-sm text-[#393939] mb-2">
                    Dinero Abonado
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <p className="text-callejero text-2xl">$0,00</p>
                      <p className="text-[#818181] text-xs">
                        $
                        {booking.totalPrice?.toLocaleString()
                          ? booking.totalPrice?.toLocaleString()
                          : localStorage
                              .getItem("totalPrice")
                              ?.toLocaleString()}{" "}
                        penditente por abonar
                      </p>
                    </div>
                    <button
                      className="text-xs w-36 h-8 border border-callejero rounded-full px-3 opacity-30"
                      disabled
                    >
                      Registrar pago
                    </button>
                  </div>
                </div>
                <div className="mb-2 border-b-small border-slate-200 hidden"></div>
                {/* <div className="flex justify-between mb-2">
                  <p className="text-[#393939] text-sm">
                    Enviar notificaciones a responsables
                  </p>
                  <label className="switch">
                    <input type="checkbox"></input>
                    <span className="slider round"></span>
                  </label>
                </div> */}
                <p className="text-[#818181] text-xs hidden">
                  Enviaremos un correo electrónico a los correos registrados
                  para notificarles de la reserva.
                </p>
              </ModalBody>
              <ModalFooter>
                <div className="flex w-full justify-between">
                  <button
                    className="h-12 w-40 border border-callejero rounded-full text-callejero text-base font-medium hover:scale-105 transition-all"
                    onClick={close}
                  >
                    Cancelar
                  </button>
                  <button
                    className="h-12 w-40 border bg-callejero rounded-full text-white text-base font-medium mb-2 hover:scale-105 transition-all"
                    onClick={createBooking}
                  >
                    {loading ? <Spinner size="sm" color="white" /> : "Guardar"}
                  </button>
                </div>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalCreateEvent;
