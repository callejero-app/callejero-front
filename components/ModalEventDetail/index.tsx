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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import Image from "next/image";
import calendar from "@/public/images/calendar.svg";
import male from "@/public/images/male.png";
import admin from "@/public/images/verified-callejero.png";
import female from "@/public/images/female.png";
import axios from "axios";
import { globals } from "@/app/globals";

const ModalEventDetail: React.FC<{
  bookingDetail: {
    id: string;
    justCreated: boolean;
    paymentCompleted: boolean;
    tag: string;
    start: string;
    end: string;
    dayName: string;
    dayNumber: string;
    monthName: string;
    description: string;
    responsables: [];
    totalPrice: number;
    totalPaid: number;
  };
  openEventDetail: boolean;
  updateOpenEventDetail: Function;
  handleDeleteEvent: Function;
  handleCompletePayment: Function;
}> = ({
  bookingDetail,
  openEventDetail,
  updateOpenEventDetail,
  handleDeleteEvent,
  handleCompletePayment,
}) => {
  const [modalEventDetailOpen, setModalEventDetailOpen] =
    useState(openEventDetail);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [bookingClosed, setBookingClosed] = useState(
    bookingDetail.totalPaid == bookingDetail.totalPrice ? true : false
  );
  const [paymentCompleted, setPaymentCompleted] = useState(
    bookingClosed ? true : bookingDetail.paymentCompleted
  );
  const [totalPrice, setTotalPrice] = useState(() => {
    const localStorageValue = localStorage.getItem("totalPrice");
    return localStorageValue ? parseInt(localStorageValue) * 1000 : 0;
  });

  const [bookingReceived, setBookingReceived] = useState({
    id: bookingDetail.id,
    justCreated: bookingDetail.justCreated,
    paymentCompleted: bookingDetail.paymentCompleted,
    tag: bookingDetail.tag,
    start: bookingDetail.start,
    end: bookingDetail.end,
    dayName: bookingDetail.dayName,
    dayNumber: bookingDetail.dayNumber,
    monthName: bookingDetail.monthName,
    description: bookingDetail.description,
    responsables: bookingDetail.responsables,
    totalPrice: bookingDetail.totalPrice,
    totalPaid: bookingDetail.totalPaid,
  });

  // console.log("modal detail total price", bookingReceived.totalPrice);
  // console.log("modal detail total paid", bookingReceived.totalPaid);
  // console.log("paymentCompleted", bookingReceived.paymentCompleted);
  // console.log("modal detail total price", bookingReceived.totalPrice);
  // console.log("modal detail abono ", totalPrice);
  // console.log("Booking closed ?", bookingClosed);

  const deleteBooking = async () => {
    setLoading(true);
    const gamefieldId = localStorage.getItem("gamefieldId");
    const bookingId = bookingDetail.id;
    const url = `${globals.apiURL}/game-fields/${gamefieldId}/booking/client/${bookingId}`;
    const headers = {
      "x-callejero-web-token": localStorage.getItem("auth"),
      "x-tz": localStorage.getItem("timezone"),
      "accept-language": "es",
    };

    try {
      const res = await axios.delete(url, { headers }).then((res) => {
        if (res.status == 200) {
          closeEventDetail();
          if (bookingReceived.justCreated == true) {
            handleDeleteEvent(true, bookingReceived.id, true);
          } else {
            handleDeleteEvent(true, bookingReceived.id, false);
          }
          setLoading(false);
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
          toast.error("La sesión ha caducado!", {
            autoClose: 2000,
            icon: "❌",
          });
          localStorage.clear();
          window.location.href = "/login";
          break;
        default:
          handleDeleteEvent(false);
          break;
      }
      setLoading(false);
      closeEventDetail();
    }
  };

  const completePayment = async () => {
    if (bookingClosed == false || paymentCompleted == false) {
      setLoadingPayment(true);
      const gamefieldId = localStorage.getItem("gamefieldId");
      const bookingId = bookingReceived.id;
      // console.log("gamefieldId", gamefieldId);
      // console.log("booking id", bookingId);
      const url = `${globals.apiURL}/game-fields/${gamefieldId}/booking/close-booking`;
      const headers = {
        "x-callejero-web-token": localStorage.getItem("auth"),
        "x-tz": localStorage.getItem("timezone"),
        "accept-language": "es",
      };

      try {
        const res = await axios
          .patch(
            url,
            {
              bookId: bookingId,
            },
            { headers }
          )
          .then((res) => {
            setLoadingPayment(false);
            if (res.status == 200) {
              setBookingClosed(true);
              setPaymentCompleted(true);
              handleCompletePayment(bookingId, bookingReceived.justCreated);
              toast.success("Pago total completado!", {
                autoClose: 2000,
                icon: "✅",
              });
            }
          });
      } catch (error) {
        setLoadingPayment(false);
        console.log(error);
        // @ts-ignore
        const codeError = error?.response?.data?.error?.code;
        //@ts-ignore
        const codeMessage = error?.response?.data?.error?.message;
        switch (codeError) {
          case "auth.web.failure.session.1000":
          case "auth.web.failure.session.1001":
          case "auth.web.failure.session.1002":
          case "auth.web.failure.session.1003":
          case "auth.web.failure.session.1004:":
            toast.error("La sesión ha caducado!", {
              autoClose: 2000,
              icon: "❌",
            });
            localStorage.clear();
            window.location.href = "/login";
            break;
          default:
            toast.error("Algo salió mal!", {
              autoClose: 2000,
              icon: "❌",
            });
            break;
        }
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    onOpen();
    const closeBtn = document.getElementsByClassName(
      "absolute appearance-none select-none top-1 right-1 p-2 text-foreground-500 rounded-full hover:bg-default-100 active:bg-default-200 tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2"
    )[0];
    closeBtn.classList.add("close-btn");
    closeBtn.addEventListener("click", () => closeEventDetail());
  }, []);

  const closeEventDetail = () => {
    setModalEventDetailOpen(false);
    updateOpenEventDetail(false);
  };

  return (
    <>
      <Modal isOpen={modalEventDetailOpen} onOpenChange={onOpenChange}>
        <ToastContainer />
        <ModalContent>
          {(onClose) => (
            <div className="modal">
              <ModalHeader className="flex flex-col gap-1 modal__title mt-6">
                Información de la reserva
              </ModalHeader>
              <ModalBody>
                <div className="flex">
                  <div className="bg-[#E7E8E2] w-28 h-8 flex items-center rounded-md px-2.5 mb-2 justify-center">
                    {bookingReceived.tag == "sub" && (
                      <p className="uppercase text-xs">Suscripcción</p>
                    )}
                    {bookingReceived.tag == "app" && (
                      <p className="uppercase text-xs">
                        de la {bookingReceived.tag}
                      </p>
                    )}
                    {bookingReceived.tag == "web" && (
                      <p className="uppercase text-xs">
                        de la {bookingReceived.tag}
                      </p>
                    )}
                  </div>
                  <p className="text-xl ml-2 mt-[2px]">
                    {bookingReceived.tag == "sub" && "⭐️"}
                    {bookingReceived.tag == "app" && "📱"}
                    {bookingReceived.tag == "web" && "💻"}
                  </p>
                </div>
                <div className="flex mb-3">
                  <Image
                    src={calendar}
                    alt="icon"
                    height={15}
                    priority={true}
                  />
                  <p className=" modal__date ml-2">
                    <span className="capitalize">
                      {bookingReceived.dayName}
                    </span>
                    , {bookingReceived.dayNumber} de{" "}
                    <span className="capitalize">
                      {bookingReceived.monthName}
                    </span>{" "}
                    ·{" "}
                    <span className="modal__date--hours font-medium">
                      {bookingReceived.start} - {bookingReceived.end}
                    </span>
                  </p>
                </div>
                {bookingDetail.description && (
                  <div>
                    <p className="font-medium text-sm text-[#393939]">
                      Descripcción
                    </p>
                    <p
                      id="description"
                      className={`modal__description text-xs capitalize`}
                    >
                      {bookingDetail.description}
                    </p>
                  </div>
                )}
                <div className=" mb-2 border-b-small border-slate-200"></div>
                <div className="flex column justify-between mb-2 items-center">
                  <div>
                    <p className="font-medium text-sm text-[#393939]">
                      Responsables
                    </p>
                    <div className="flex flex-col">
                      {bookingReceived.responsables !== undefined &&
                        //@ts-ignore
                        bookingReceived.responsables.length == 1 && (
                          <div
                            //@ts-ignore
                            key={bookingReceived.responsables[0].id}
                            className="flex items-center mt-4"
                          >
                            <div
                              className={`${
                                //@ts-ignore
                                bookingReceived.responsables[0].sex == "a"
                                  ? // ? "bg-callejero"
                                    "bg-slate-300"
                                  : //@ts-ignore
                                  bookingReceived.responsables[0].sex == "m"
                                  ? "bg-blue-300"
                                  : "bg-pink-300"
                              }  rounded-full flex p-2 mr-2`}
                            >
                              {/* @ts-ignore */}
                              {/* {bookingReceived.responsables[0].sex == "a" && ( */}
                              <Image
                                src={
                                  //  @ts-ignore
                                  bookingReceived.responsables[0].sex == "a"
                                    ? admin
                                    : //  @ts-ignore
                                    bookingReceived.responsables[0].sex == "m"
                                    ? male
                                    : female
                                }
                                alt="icon"
                                height={30}
                                width={30}
                                priority={true}
                                className=""
                              />
                              {/* )} */}
                            </div>
                            <p className="">
                              {/* @ts-ignore */}
                              {bookingReceived.responsables[0].name}
                            </p>
                          </div>
                        )}
                      {bookingDetail.responsables &&
                        bookingReceived.responsables.length > 1 &&
                        bookingDetail.responsables.map((responsable: any) => (
                          <div
                            key={responsable.id}
                            className="flex items-center mt-4"
                          >
                            <div
                              className={`${
                                responsable.sex == "m"
                                  ? "bg-blue-300"
                                  : "bg-pink-300"
                              }  rounded-full flex p-2 mr-2`}
                            >
                              <Image
                                src={responsable.sex == "m" ? male : female}
                                alt="icon"
                                height={25}
                                width={25}
                                priority={true}
                                className=""
                              />
                            </div>
                            <p className="">{responsable.name}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                  <button
                    className="text-xs h-8 border border-callejero rounded-full px-3 opacity-30 hidden"
                    disabled
                  >
                    Modificar
                  </button>
                </div>
                {bookingReceived.tag !== "sub" && (
                  <div className="mb-2 border-b-small border-slate-200"></div>
                )}
                {/* <div className="flex column justify-between mb-2 items-center">
                <p className="font-medium text-sm text-[#393939]">
                  Responsables
                </p>
                <button
                  className="text-xs px-4 h-8 border border-callejero rounded-full opacity-30"
                  disabled
                >
                  Añadir responsables
                </button>
              </div> */}
                {/* <div className="mb-2 border-b-small border-slate-200"></div> */}
                {bookingReceived.tag !== "sub" && (
                  <div className="mb-2">
                    <p className="font-medium text-sm text-[#393939] mb-2">
                      Dinero Abonado
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <p className="text-callejero text-2xl">
                          {`$${
                            bookingClosed || paymentCompleted
                              ? bookingReceived.totalPrice.toLocaleString()
                              : bookingReceived.totalPaid
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }  `}
                        </p>
                        <p className="text-[#818181] text-sm mt-1">
                          $
                          {`${
                            bookingClosed || paymentCompleted
                              ? "0,00"
                              : (
                                  totalPrice - bookingReceived.totalPaid
                                ).toLocaleString()
                          } pago pendiente`}
                        </p>
                        <p
                          className={`text-[#818181] text-sm mt-1 ${
                            (bookingClosed || paymentCompleted) &&
                            "line-through"
                          }`}
                        >
                          Total: ${bookingReceived.totalPrice.toLocaleString()}
                        </p>
                      </div>
                      <button
                        className={`text-sm md:text-sm h-10 border bg-callejero text-white rounded-full px-6 
                        w-[158px] transition-all ${
                          bookingClosed && paymentCompleted == true
                            ? "opacity-70 cursor-not-allowed hover:scale-100"
                            : "hover:scale-105"
                        }`}
                        onClick={completePayment}
                      >
                        {loadingPayment ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          `${
                            bookingClosed || paymentCompleted
                              ? "Pagado"
                              : "Completar pago"
                          } `
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {bookingReceived.tag !== "sub" && (
                  <div className="border-b-small border-slate-200"></div>
                )}
              </ModalBody>
              <ModalFooter>
                {bookingReceived.tag === "web" ? (
                  <div className="flex w-full justify-between">
                    <button
                      className="h-12 w-40 border bg-red-600 rounded-full text-white text-base font-medium mb-2 
                      hover:scale-105 transition-all flex place-items-center justify-center"
                      onClick={deleteBooking}
                    >
                      {loading ? (
                        <Spinner size="sm" color="white" />
                      ) : (
                        "Eliminar"
                      )}
                    </button>
                    <button
                      className="h-12 w-40 border border-callejero rounded-full text-callejero text-base 
                      font-medium hover:scale-105 transition-all"
                      onClick={closeEventDetail}
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full justify-end">
                    <button
                      className="h-12 w-[167px] border border-callejero rounded-full text-callejero text-base 
                      font-medium hover:scale-105 transition-all"
                      onClick={closeEventDetail}
                    >
                      Cerrar
                    </button>
                  </div>
                )}
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalEventDetail;
