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
import male from "@/public/images/male.png";
import female from "@/public/images/female.png";

const ModalEventDetail: React.FC<{
  bookingDetail: {
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
}> = ({ bookingDetail, openEventDetail, updateOpenEventDetail }) => {
  const [modalEventDetailOpen, setModalEventDetailOpen] =
    useState(openEventDetail);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  console.log("lo q llega:", bookingDetail);

  const [bookingReceived, setBookingReceived] = useState({
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

  console.log("bookingReceived:", bookingReceived);

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
                Desafío de equipos
              </ModalHeader>
              <ModalBody>
                <div className="bg-[#E7E8E2] w-28 h-8 flex items-center rounded-md px-2.5 mb-2">
                  {bookingReceived.tag == "app" && (
                    <p className="uppercase text-xs">
                      📱 de la {bookingReceived.tag}
                    </p>
                  )}
                  {bookingReceived.tag == "web" && (
                    <p className="uppercase text-xs">
                      💻 de la {bookingReceived.tag}
                    </p>
                  )}
                </div>
                <div className="flex mb-3">
                  <Image
                    src={calendar}
                    alt="icon"
                    height={15}
                    priority={true}
                  />
                  <p className=" modal__date ml-2">
                    {bookingReceived.dayName}, {bookingReceived.dayNumber} de{" "}
                    {bookingReceived.monthName} · {bookingReceived.start} -{" "}
                    {bookingReceived.end}
                  </p>
                </div>
                {bookingDetail.description && (
                  <div>
                    <p className="font-medium text-sm text-[#393939]">
                      Descripcción
                    </p>
                    <p
                      id="description"
                      className={`modal__description text-xs`}
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
                      {bookingDetail.responsables &&
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
                    className="text-xs px-6 h-8 border border-callejero rounded-full px-3 opacity-30"
                    disabled
                  >
                    Modificar
                  </button>
                </div>
                <div className="mb-2 border-b-small border-slate-200"></div>
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
                <div className="mb-2">
                  <p className="font-medium text-sm text-[#393939] mb-2">
                    Dinero Abonado
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <p className="text-callejero text-2xl">
                        $
                        {bookingReceived.tag == "web" &&
                          `${bookingReceived.totalPrice.toLocaleString()}`}
                        {bookingReceived.tag == "app" &&
                          `${bookingReceived.totalPaid.toLocaleString()}`}
                        {/* ${bookingReceived.totalPaid.toLocaleString()} */}
                      </p>
                      <p className="text-[#818181] text-xs">
                        $
                        {bookingReceived.tag == "web" &&
                          "0 pendiente por abonar"}
                        {bookingReceived.tag == "app" &&
                          `${
                            bookingReceived.totalPrice -
                            bookingReceived.totalPaid
                          } penditente por abonar`}
                      </p>
                    </div>
                    <button
                      className="text-xs h-8 border border-callejero rounded-full px-6 opacity-30"
                      disabled
                    >
                      Registrar pago
                    </button>
                  </div>
                </div>
                <div className="mb-2 border-b-small border-slate-200"></div>
              </ModalBody>
              <ModalFooter>
                {/* <div className="flex w-full justify-between"> */}
                <div className="flex w-full justify-end">
                  <button
                    // className="h-12 w-[167px] border border-callejero rounded-full text-callejero text-base font-medium hover:scale-105 transition-all"
                    className="h-12 w-full border border-callejero rounded-full text-callejero text-base font-medium hover:scale-105 transition-all"
                    onClick={closeEventDetail}
                  >
                    Cerrar
                  </button>
                  <button
                    className="h-12 w-[167px] border bg-callejero rounded-full text-white text-base font-medium mb-2 hover:scale-105 transition-all hidden"
                    onClick={() => {}}
                  >
                    Sí
                    {/* {loading ? <Spinner size="sm" color="white" /> : "Guardar"} */}
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

export default ModalEventDetail;
