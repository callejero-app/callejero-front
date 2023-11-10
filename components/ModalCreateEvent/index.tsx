import React, { FormEvent, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
  Input,
} from "@nextui-org/react";
import moment from "moment";
import "moment/locale/es";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalCreateEvent: React.FC<{
  open: boolean;
  updateOpen: Function;
  addEvent: Function;
  bookingInfo: {
    start: { getHours: Function; getDay: Function; getDate: Function };
    end: { getHours: Function };
  };
}> = ({ open, updateOpen, addEvent, bookingInfo }) => {
  useEffect(() => {
    onOpen();
    const closeBtn = document.getElementsByClassName(
      "absolute appearance-none select-none top-1 right-1 p-2 text-foreground-500 rounded-full hover:bg-default-100 active:bg-default-200 tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2"
    )[0];
    closeBtn.addEventListener("click", () => close());
  }, []);

  moment.locale("es");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalOpen, setModalOpen] = useState(open);
  const [loading, setLoading] = useState(false);
  const [emptyDescription, setEmptyDescription] = useState(false);

  const [booking, setBooking] = useState({
    dayName: bookingInfo.dayName,
    dayNumber: bookingInfo.dayNumber,
    monthName: bookingInfo.monthName,
    startHour: bookingInfo.startHour,
    endHour: bookingInfo.endHour,
    startsAtDate: bookingInfo.startsAtDate,
    startsAtTime: bookingInfo.startsAtTime,
    startsAtTime24: bookingInfo.startsAtTime24,
    endsAtDate: bookingInfo.endsAtDate,
    endsAtTime: bookingInfo.endsAtTime,
    endsAtTime24: bookingInfo.endsAtTime24,
  });

  const createEventCalendar = (title: string) => {
    const newEvent = {
      title: title,
      start: `${booking.startsAtDate} ${bookingInfo.startsAtTime24}`,
      end: `${booking.endsAtDate} ${bookingInfo.endsAtTime24}`,
    };
    addEvent(newEvent);
  };

  const createBooking = async () => {
    setLoading(true);
    setEmptyDescription(false);
    let descriptionEl = document.getElementById("description");
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
      console.log(gamefieldId);
      console.log(API_URL);
      console.log("startsAtDate: ", booking.startsAtDate);
      console.log("startsAtTime: ", booking.startsAtTime24);
      console.log("endsAtDate: ", booking.endsAtDate);
      console.log("endsAtTime: ", booking.endsAtTime24);
      const url = `${API_URL}/game-fields/${gamefieldId}/booking/create-client`;
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
            createEventCalendar(description);
            setLoading(false);
            toast.success("Reserva creada!", {
              autoClose: 2000,
              icon: "✅",
            });
            close();
          }
        });
      } catch (error) {
        console.log(error);
        toast.error("No se pudo crear la reserva!", {
          autoClose: 2000,
          icon: "❌",
        });
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
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear una reserva
              </ModalHeader>
              <ModalBody>
                <select name="" id="" placeholder="Tipo de Juego">
                  <option value="Juego 1">Tipo de Juego</option>
                  <option value="Juego 1">Juego 2</option>
                  <option value="Juego 1">Juego 3</option>
                </select>
                <p>
                  <span className="capitalize">{booking.dayName}</span>,{" "}
                  {booking.dayNumber} de {booking.monthName} {booking.startHour}{" "}
                  - {booking.endHour}
                </p>
                <select name="" id="" placeholder="Frecuencia (opcional)">
                  <option value="Juego 1">Frecuencia (opcional)</option>
                  <option value="Juego 1">Juego 2</option>
                  <option value="Juego 1">Juego 3</option>
                </select>
                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Description"
                  className={`${
                    emptyDescription ? "border-2 border-rose-500" : ""
                  }`}
                />
                <h2>Participantes</h2>
                <h3>Dinero Abonado</h3>
                <h3>Enviar notificaciones a participantes</h3>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={close}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={createBooking}>
                  {loading ? <Spinner size="sm" color="white" /> : "Crear"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalCreateEvent;
