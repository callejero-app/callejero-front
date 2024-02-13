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
  Input,
} from "@nextui-org/react";
import moment from "moment";
import "moment/locale/es";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import Image from "next/image";
import calendar from "@/public/images/calendar.svg";
import { globals } from "@/app/globals";

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
  // const [emptyAbono, setEmptyAbono] = useState(false);
  const [abonoValue, setAbonoValue] = useState("");
  const [abonoPending, setAbonoPending] = useState(() => {
    const localStorageValue = localStorage.getItem("totalPrice");
    return localStorageValue ? parseInt(localStorageValue) * 1000 : 0;
  });
  const [totalPrice, setTotalPrice] = useState(() => {
    const localStorageValue = localStorage.getItem("totalPrice");
    return localStorageValue ? parseInt(localStorageValue) * 1000 : 0;
  });

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
    totalPrice: totalPrice,
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

  const createEventCalendar = (
    description: string,
    error: boolean,
    errorMessage: string,
    bookingId: string = ""
  ) => {
    //@ts-ignore
    if (bookingInfo.endsAtTime24 == "00:00") bookingInfo.endsAtTime24 = "23:59";
    if (error == false) {
      const newEvent = {
        id: "",
        newId: bookingId,
        justCreated: true,
        paymentCompleted: parseInt(abonoValue) == totalPrice,
        newStart: booking.startHour,
        newEnd: booking.endHour,
        title: description,
        //@ts-ignore
        start: `${booking.startsAtDate} ${bookingInfo.startsAtTime24}`,
        //@ts-ignore
        end: `${booking.endsAtDate} ${bookingInfo.endsAtTime24}`,
        description: description,
        tag: "web",
        totalPrice: totalPrice,
        totalPaid: abonoValue,
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
    let abonoEl = document.getElementById("abono");
    //@ts-ignore
    const description = descriptionEl != null ? descriptionEl.value : "";
    //@ts-ignore
    const abono = abonoEl.value != "" ? abonoEl.value : 0;

    if (description == "") {
      setLoading(false);
      setEmptyDescription(true);
    }

    if (booking.endsAtTime24 == "00:00") booking.endsAtTime24 = "23:59";
    if (description !== "") {
      setEmptyDescription(false);
      // setEmptyAbono(false);
      const gamefieldId = localStorage.getItem("gamefieldId");
      const url = `${globals.apiURL}/game-fields/${gamefieldId}/booking/create-client`;
      const data = {
        startsAtDate: booking.startsAtDate,
        startsAtTime: booking.startsAtTime24,
        endsAtDate: booking.endsAtDate,
        endsAtTime: booking.endsAtTime24,
        description: description,
        payment: abono,
      };
      const headers = {
        "x-callejero-web-token": localStorage.getItem("auth"),
        "x-tz": localStorage.getItem("timezone"),
        "accept-language": "es",
      };
      try {
        const res = await axios.post(url, data, { headers }).then((res) => {
          if (res.status == 200) {
            const bookingId = res.data.data.schedule[0]._id;
            // console.log("id de booking recien creada:", bookingId);
            createEventCalendar(description, false, "", bookingId);
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
                <Input
                  id="description"
                  name="description"
                  isRequired
                  variant="bordered"
                  type="text"
                  label="Descripcción (Requerido)"
                  className={`mx-auto w-full mb-2 text-xs ${
                    emptyDescription ? "modal__input--danger" : ""
                  }`}
                  size="lg"
                />
                <div className=" mb-2 border-b-small border-slate-200"></div>
                {/* <div className="flex column justify-between mb-2 items-center">
                  <p className="font-medium text-sm text-[#393939]">
                    Responsables
                  </p>
                  <button
                    className="text-xs w-36 h-8 border border-callejero rounded-full px-3 opacity-30"
                    disabled
                  >
                    Añadir responsables
                  </button>
                </div> */}
                <div className="mb-2 border-b-small border-slate-200 hidden"></div>
                <Input
                  id="abono"
                  name="abono"
                  value={abonoValue}
                  onChange={(e) => {
                    setAbonoValue(e.target.value);
                    if (e.target.value !== "") {
                      const priceStorage = localStorage.getItem("totalPrice");
                      const abono = parseInt(e.target.value);
                      if (priceStorage) {
                        const priceStorageInt = parseInt(priceStorage) * 1000;
                        setAbonoPending(priceStorageInt - abono);
                      }
                    } else {
                      setAbonoPending(abonoPending);
                    }
                  }}
                  variant="bordered"
                  type="number"
                  label="Abono (Opcional)"
                  className="mb-2 text-xs"
                  size="lg"
                />
                <div className="mb-2">
                  <p className="font-medium text-sm text-[#393939] mb-2">
                    Dinero Abonado
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <p className="text-callejero text-2xl">
                        $
                        {abonoValue == ""
                          ? "0.00"
                          : abonoValue
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                      <p className="text-[#818181] text-sm">
                        $
                        {abonoValue == ""
                          ? localStorage.getItem("totalPrice")
                          : abonoPending.toLocaleString()}{" "}
                        pendiente por abonar
                      </p>
                      <p className="text-[#818181] text-sm mt-1">
                        Total: ${localStorage.getItem("totalPrice")}
                      </p>
                    </div>
                    <button
                      className="text-sm w-36 h-8 border border-callejero rounded-full px-3 opacity-30 hidden"
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
