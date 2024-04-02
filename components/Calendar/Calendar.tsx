"use client";
import { FC, useEffect, useRef, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalCreateEvent from "@/components/ModalCreateEvent";
import ModalEventDetail from "@/components/ModalEventDetail";
import Modal from "@/components/Modal";
import ModalLoading from "@/components/ModalLoading";
import moment from "moment";
import "./Calendar.scss";

const Calendar: FC<{
  data: any;
  suscriptions: any;
  closeTimes: any;
  history: any;
  fetchBookings: Function;
}> = ({ data, suscriptions, closeTimes, history, fetchBookings }) => {
  const [events, setEvents] = useState([
    {
      id: "",
      newId: "",
      justCreated: false,
      paymentCompleted: false,
      subscription: false,
      newStart: "",
      newEnd: "",
      // detail: {},
      title: "",
      start: "",
      end: "",
      description: "",
      tag: "",
      // price: 0,
      totalPrice: 0,
      totalPaid: 0,
      isHistory: false,
      // className: "",
    },
  ]);
  const [bookings, setBookings] = useState(data);
  const [suscriptionsReceiveds, setSuscriptionsReceiveds] =
    useState(suscriptions);
  const [closeTimesReceiveds, setCloseTimesReceiveds] = useState(closeTimes);
  const [historyReceiveds, setHistoryReceiveds] = useState(history);

  const [gridModified, setGridModified] = useState(false);
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const [bookingInfo, setBookingInfo] = useState({});
  const [totalPrice, setTotalPrice] = useState(() => {
    const localStorageValue = localStorage.getItem("totalPrice");
    return localStorageValue ? parseInt(localStorageValue) * 1000 : 0;
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEventDetailVisible, setModalEventDetailVisible] = useState(false);
  const [bookingDetail, setBookingDetail] = useState({});
  const [modalDetail, setModalDetail] = useState({
    title: "",
    subtitle: "",
    type: "",
  });
  const [modalLoadingDetail, setModalLoadingDetail] = useState({
    title: "",
    footer: "",
  });
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [modalLoadingVisible, setModalLoadingVisible] = useState(false);

  useEffect(() => {
    setBookings(data);
    if (suscriptions) setSuscriptionsReceiveds(suscriptions);
    if (closeTimes) setCloseTimesReceiveds(closeTimes);
    if (history) setHistoryReceiveds(history);
  }, [data, suscriptions, closeTimes, history]);

  //fill events
  useEffect(() => {
    const subs = suscriptionsReceiveds.map((sub: any) => ({
      idSub: sub.id,
      newId: "",
      justCreated: false,
      paymentCompleted: false,
      subscription: true,
      newStart: "",
      newEnd: "",
      detail: sub,
      title: sub.description != null ? sub.description : "Reserva",
      start: sub.start,
      end: sub.end,
      description:
        sub.description != null ? sub.description : "Sin descripcción",
      // tag: "sub",
      // price: 0,
      // totalPrice: 0,
      // totalPaid: 0,
      isHistory: false,
      // className: "sub",
    }));
    // console.log("subs que llegan", subs);
    //bookings
    const books = bookings.map((booking: any) => ({
      id: booking.id,
      newId: "",
      justCreated: false,
      paymentCompleted: false,
      subscription: false,
      newStart: "",
      newEnd: "",
      detail: booking,
      title: booking.description != null ? booking.description : "Reserva",
      start: booking.startsAt,
      end: booking.endsAt,
      description:
        booking.description != null ? booking.description : "Sin descripcción",
      // tag: "web",
      // price: 0,
      // totalPrice: 0,
      // totalPaid: 0,
      isHistory: false,
      className: booking.status === "partial" && "own-event__partial",
    }));
    // console.log("book q llegan", books);
    //history
    const historyEvents = historyReceiveds.map((historyEl: any) => ({
      id: historyEl.id,
      newId: "",
      justCreated: false,
      paymentCompleted: false,
      subscription: false,
      newStart: "",
      newEnd: "",
      detail: historyEl,
      title: historyEl.description != null ? historyEl.description : "Reserva",
      start: historyEl.startsAt,
      end: historyEl.endsAt,
      description:
        historyEl.description != null
          ? historyEl.description
          : "Sin descripcción",
      isHistory: historyEl.isHistory,
      className: "own-event__history",
    }));

    //closetimes
    const closes = closeTimesReceiveds.map((close: any) => {
      return {
        start: close.start,
        end: close.end,
        display: "background",
        className: "own-event__closeTime",
      };
    });

    setEvents(books);
    setEvents((prevEvents) => [
      ...prevEvents,
      ...subs,
      ...historyEvents,
      ...closes,
    ]);
    // setTimeout(() => {
    //   console.log("events primer useEffect", events);
    // }, 3000);
    if (bookings.length > 0)
      localStorage.setItem(
        "totalPrice",
        bookings[0].totalPrice.amount.toLocaleString()
      );
  }, [bookings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGridModified(true);
    }
  }, []);

  useEffect(() => {
    resizeListener();
  }, [widthScreen]);

  //change calendar view auto by sceen size
  const resizeListener = () => {
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      setWidthScreen(width);
      // if (width > 768) console.log("modo desktop");
    });
  };

  const updateOpen = (open: boolean) => {
    setModalVisible(open);
  };

  const updateOpenEventDetail = (openEventDetail: boolean) => {
    setModalEventDetailVisible(openEventDetail);
  };

  const updateOpenInfo = (open: boolean) => {
    setModalInfoVisible(open);
    open;
  };

  interface Event {
    id: string;
    newId: string;
    justCreated: boolean;
    paymentCompleted: boolean;
    subscription: boolean;
    newStart: string;
    newEnd: string;
    // detail: {};
    title: string;
    start: string;
    end: string;
    description: string;
    tag: string;
    // price: 0;
    totalPrice: 0;
    totalPaid: 0;
    // className: "";
  }

  const addEvent = (newEvent: Event) => {
    // if (newEvent.tag != "sub") {
    if (events.length == undefined) {
      setEvents([
        {
          id: "",
          newId: newEvent.newId,
          justCreated: newEvent.justCreated,
          paymentCompleted: newEvent.paymentCompleted,
          subscription: false,
          newStart: newEvent.newStart,
          newEnd: newEvent.newEnd,
          title: newEvent.title,
          // detail: {},
          start: newEvent.start,
          end: newEvent.end,
          description: newEvent.description,
          tag: newEvent.tag,
          // price: 0,
          totalPrice: newEvent.totalPrice,
          totalPaid: newEvent.totalPaid,
          isHistory: false,
          // className: "",
        },
      ]);
    } else {
      setEvents([
        ...events,
        {
          id: "",
          newId: newEvent.newId,
          justCreated: newEvent.justCreated,
          paymentCompleted: newEvent.paymentCompleted,
          subscription: false,
          newStart: newEvent.newStart,
          newEnd: newEvent.newEnd,
          title: newEvent.title,
          // detail: {},
          start: newEvent.start,
          end: newEvent.end,
          description: newEvent.description,
          tag: newEvent.tag,
          // price: 0,
          totalPrice: newEvent.totalPrice,
          totalPaid: newEvent.totalPaid,
          isHistory: false,
          // className: "",
        },
      ]);
    }
    if (newEvent.tag == "sub") {
      fetchBookings(localStorage.getItem("gamefieldId")!);
      setModalLoadingDetail({
        title: "Creando suscripcción",
        footer: "Espera un momento",
      });
      setModalLoadingVisible(true);
      setTimeout(() => {
        setModalLoadingVisible(false);
      }, 1200);
    } else {
      setModalDetail({
        title: "Reserva creada!",
        subtitle: "",
        type: "success",
      });
      setModalInfoVisible(true);
      setTimeout(() => {
        setModalInfoVisible(false);
      }, 1200);
    }
    // console.log("events dsps de crear", events);
    // } else {
    //   addSubscription(newEvent);
    // }
    // window.location.href = "/schedule";
  };

  // const addSubscription = (newEvent: any) => {
  //   if (events.length == undefined) {
  //     setEvents([
  //       {
  //         id: "",
  //         newId: newEvent.newId,
  //         isHistory: false,
  //         justCreated: newEvent.justCreated,
  //         paymentCompleted: newEvent.paymentCompleted,
  //         subscription: true,
  //         newStart: newEvent.newStart,
  //         newEnd: newEvent.newEnd,
  //         title: newEvent.title,
  //         start: newEvent.start,
  //         end: newEvent.end,
  //         // detail: newEvent.detail,
  //         description: newEvent.description,
  //         tag: newEvent.tag,
  //         // price: 0,
  //         totalPrice: newEvent.totalPrice,
  //         totalPaid: newEvent.totalPaid,
  //         // className: "",
  //       },
  //     ]);
  //   } else {
  //     setEvents([
  //       ...events,
  //       {
  //         id: "",
  //         newId: newEvent.newId,
  //         justCreated: newEvent.justCreated,
  //         paymentCompleted: newEvent.paymentCompleted,
  //         subscription: true,
  //         newStart: newEvent.newStart,
  //         newEnd: newEvent.newEnd,
  //         title: newEvent.title,
  //         start: newEvent.start,
  //         end: newEvent.end,
  //         description: "",
  //         tag: newEvent.tag,
  //         // detail: {},
  //         // price: 0,
  //         totalPrice: 0,
  //         totalPaid: 0,
  //         isHistory: false,
  //         // className: "",
  //       },
  //     ]);
  //     console.log("events despues de agregar", events.length);
  //   }
  //   setModalDetail({
  //     title: "Reserva creada!",
  //     subtitle: "",
  //     type: "success",
  //   });
  //   setModalInfoVisible(true);
  //   setTimeout(() => {
  //     setModalInfoVisible(false);
  //   }, 1200);
  //   // window.location.href = "/schedule";
  // };

  const handleCreateEventError = (codeMessage: string) => {
    setModalDetail({ title: codeMessage, subtitle: "", type: "error" });
    setModalInfoVisible(true);
  };

  const handleDeleteEvent = (
    status: boolean,
    bookingId: string = "",
    justCreated: boolean,
    tag: string = ""
  ) => {
    console.log("id que llega", bookingId);
    if (status == true) {
      if (tag == "sub") {
        fetchBookings(localStorage.getItem("gamefieldId")!);
        setModalLoadingDetail({
          title: "Eliminando suscripcción",
          footer: "Espera un momento",
        });
        setModalLoadingVisible(true);
        setTimeout(() => {
          setModalLoadingVisible(false);
        }, 1200);
      } else {
        if (justCreated == true) {
          const newEvents = events.filter((e) => e.newId !== bookingId);
          setEvents(newEvents);
        } else {
          const newEvents = events.filter((e) => e.id !== bookingId);
          setEvents(newEvents);
        }
        setModalDetail({
          title: "Reserva eliminada con exito!",
          subtitle: "",
          type: "success",
        });
        setModalInfoVisible(true);
        setTimeout(() => {
          setModalInfoVisible(false);
        }, 1200);
      }
    } else {
      setModalDetail({
        title: "No se ha podido eliminar la reserva!",
        subtitle: "",
        type: "error",
      });
      setModalInfoVisible(true);
    }
    // window.location.href = "/schedule";
  };

  const handleCompletePayment = (bookingId: string, justCreated: boolean) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        justCreated == true
          ? event.newId == bookingId
            ? { ...event, paymentCompleted: true, totalPaid: totalPrice }
            : event
          : event.id == bookingId
          ? { ...event, paymentCompleted: true, totalPaid: totalPrice }
          : event
      )
    );
    console.log(
      "evento actualizado payment",
      justCreated
        ? events.filter((e) => e.newId == bookingId)
        : events.filter((e) => e.id == bookingId)
    );
  };

  function renderEventContent(eventInfo: any) {
    console.log("event info", eventInfo);
    return (
      <>
        <div id="overlayTypeEvent">{}</div>
        <p>{eventInfo.event.title}</p>
      </>
    );
    // if (arg.event.extendedProps?.detail?.originPlatform == "web") {
    //         miDiv.style.cssText = `width: 32px;
    //                             height: 32px;
    //                             background-color: white;
    //                             border-radius: 8rem;
    //                             position: absolute;
    //                             top: -18px;
    //                             right: -20px;
    //                             font-size: 20px;
    //                             padding: 1px;`;
    //         miDiv.innerHTML = "💻";
    //       }
  }

  if (gridModified)
    return (
      <div className="calendar bg-callejero">
        <div className="calendar__grid bg-white md:px-6">
          <Fullcalendar
            // eventContent={renderEventContent}
            eventContent={(arg) => {
              console.log("arg", arg);
              let miDiv = document.createElement("div");
              let title = document.createElement("p");
              title.innerHTML = arg.event.title;
              const originPlatform =
                arg.event.extendedProps?.detail?.originPlatform;
              const isSub = arg.event.extendedProps?.subscription;
              if (
                originPlatform == "web" ||
                originPlatform == "app" ||
                isSub == true
              ) {
                miDiv.style.cssText = `width: 32px;
                                    height: 32px;
                                    background-color: white;
                                    border-radius: 8rem;
                                    position: absolute;
                                    top: -18px;
                                    right: -20px;
                                    font-size: 20px;
                                    padding: 1px;`;
                switch (originPlatform) {
                  case "web":
                    miDiv.innerHTML = "💻";
                    break;
                  case "app":
                    miDiv.innerHTML = "📱";
                    break;

                  default:
                    "";
                    break;
                }
                if (isSub) miDiv.innerHTML = "⭐";
              }

              let arrayOfDomNodes = [miDiv, title];
              return { domNodes: arrayOfDomNodes };
            }}
            slotDuration="01:00:00"
            slotLabelFormat={[
              {
                hour: "numeric",
                minute: "2-digit",
              },
            ]}
            slotLabelContent={(slotInfo) => {
              var hour = slotInfo.date.getHours();
              var ampm = hour >= 12 ? "PM" : "AM";
              hour = hour % 12 || 12;
              return hour + ":00 " + ampm;
            }}
            slotLabelClassNames={"slotTimes"}
            headerToolbar={{
              start: "prev,next",
              center: "title",
              end: "today,timeGridWeek,timeGridDay",
            }}
            titleFormat={{ year: "numeric", month: "long" }}
            titleRangeSeparator=" / "
            dayHeaderClassNames={"dayHeader"}
            dayHeaderFormat={{
              day: "numeric",
              weekday: "long",
              omitCommas: true,
            }}
            dayHeaderContent={(arg) => {
              var day = arg.date.getDate();
              var weekday = arg.date.toLocaleString("es", {
                weekday: "long",
              });
              return (
                <div>
                  <div className="headerDay">{day}</div>
                  <div className="headerWeekday">{weekday}</div>
                </div>
              );
            }}
            allDayClassNames="clasePrueba"
            allDaySlot={false}
            locale={esLocale}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={
              window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek"
            }
            eventColor={"#184135"}
            events={events}
            eventClick={(e) => {
              let closeTime = false;
              const target = e.jsEvent.target;
              if (target instanceof HTMLElement) {
                closeTime = target.classList.contains("own-event__closeTime");
              }
              if (!closeTime) {
                const justCreated = e.event._def.extendedProps.justCreated;
                const paymentCompleted =
                  e.event._def.extendedProps.paymentCompleted;
                const sub = e.event._def.extendedProps.subscription;
                if (sub) {
                  console.log("click en sub", e);
                  const id = e.event._def.extendedProps.detail.id;
                  const newId = e.event._def.extendedProps.newId;
                  console.log("id", id);
                  console.log("newID", newId);
                  const tag = "sub";
                  const start = new Date(
                    e.event._def.extendedProps.detail.start
                  );
                  const end = new Date(e.event._def.extendedProps.detail.end);
                  setBookingDetail({
                    id: id,
                    tag: tag,
                    start: moment(start).format("hh:mm A"),
                    end: moment(end).format("hh:mm A"),
                    dayName: moment(start).format("dddd"),
                    dayNumber: moment(start).format("D"),
                    monthName: new Date(start).toLocaleString("es-ES", {
                      month: "long",
                    }),
                    description: e.event._def.extendedProps.detail.description,
                    responsables: [
                      {
                        name: e.event._def.extendedProps.detail.creator.name,
                        sex: e.event._def.extendedProps.detail.creator.sex
                          ? e.event._def.extendedProps.detail.creator.sex
                          : "a",
                        id: e.event._def.extendedProps.detail.creator.id,
                      },
                    ],
                    totalPrice: localStorage.getItem("totalPrice"),
                    totalPaid: e.event._def.extendedProps.totalPaid,
                  });
                }
                if (justCreated) {
                  const start =
                    e.event._instance &&
                    new Date(e.event._instance.range.start);
                  const dayName = moment(start).format("dddd");
                  const dayNumber = moment(start).format("D");
                  const monthName =
                    e.event._instance &&
                    new Date(e.event._instance.range.start).toLocaleString(
                      "es-ES",
                      {
                        month: "long",
                      }
                    );
                  const totalPrice = e.event._def.extendedProps.totalPrice;
                  const totalPaid = e.event._def.extendedProps.totalPaid;
                  const id = e.event._def.extendedProps.newId;
                  setBookingDetail({
                    id: id,
                    justCreated: true,
                    paymentCompleted: paymentCompleted,
                    tag: e.event._def.extendedProps.tag,
                    start: e.event._def.extendedProps.newStart,
                    end: e.event._def.extendedProps.newEnd,
                    dayName: dayName,
                    dayNumber: dayNumber,
                    monthName: monthName,
                    description: e.event._def.extendedProps.description,
                    responsables: [
                      {
                        name: localStorage.getItem("clientName"),
                        sex: localStorage.getItem("clientSex"),
                      },
                    ],
                    totalPrice: totalPrice,
                    totalPaid: totalPaid,
                  });
                }
                if (!justCreated && !sub) {
                  const tag = e.event._def.extendedProps.detail.originPlatform;
                  const isHistory = e.event._def.extendedProps.detail.isHistory;
                  const start = new Date(
                    e.event._def.extendedProps.detail.startsAt
                  );
                  const startStr = moment(start).format("hh:mm A");
                  const end = new Date(
                    e.event._def.extendedProps.detail.endsAt
                  );
                  const endStr = moment(end).format("hh:mm A");
                  const dayName = moment(start).format("dddd");
                  const dayNumber = moment(start).format("D");
                  const monthName = new Date(start).toLocaleString("es-ES", {
                    month: "long",
                  });
                  const description =
                    e.event._def.extendedProps.detail.description;
                  const teams = e.event._def.extendedProps.detail.teams;
                  const totalPrice =
                    e.event._def.extendedProps.detail.totalPrice.amount;
                  const totalPaid =
                    e.event._def.extendedProps.detail.totalPaid.amount;
                  const responsables = teams.map((t: any) => ({
                    name: t.teamLeader.name,
                    sex: t.teamLeader.sex,
                    id: t.teamLeader.id,
                  }));
                  const id = e.event._def.extendedProps.detail.id;
                  const status = e.event._def.extendedProps.detail.status;
                  setBookingDetail({
                    id: id,
                    status: status,
                    tag: tag,
                    isHistory: isHistory,
                    paymentCompleted: paymentCompleted,
                    start: startStr,
                    end: endStr,
                    dayName: dayName,
                    dayNumber: dayNumber,
                    monthName: monthName,
                    description: description,
                    responsables: responsables,
                    totalPrice: totalPrice,
                    totalPaid: totalPaid,
                  });
                }
                setModalEventDetailVisible(true);
              }
            }}
            eventMinWidth={50}
            eventClassNames={"own-event"}
            eventStartEditable={false}
            dateClick={(info) => {
              let closeTime = false;
              const target = info.jsEvent.target;
              if (target instanceof HTMLElement) {
                closeTime = target.classList.contains("own-event__closeTime");
              }

              if (!closeTime) {
                const dayName = moment(info.dateStr).format("dddd");
                const dayNumber = moment(info.dateStr).format("D");
                const monthName = new Date(info.dateStr).toLocaleString(
                  "es-ES",
                  {
                    month: "long",
                  }
                );
                const startHour = moment(info.dateStr).format("hh:mm A");
                const endHour = moment(info.date)
                  .add(1, "hours")
                  .format("hh:mm A");
                const startsAtDate = moment(info.date).format("YYYY-MM-DD");
                const endsAtDate = moment(info.date).format("YYYY-MM-DD");
                const startsAtTime = moment(info.dateStr).format("hh:mm");
                const endsAtTime = moment(info.dateStr)
                  .add(1, "hours")
                  .format("hh:mm");
                const startsAtTime24 = moment(info.dateStr).format("HH:mm");
                const endsAtTime24 = moment(info.dateStr)
                  .add(1, "hours")
                  .format("HH:mm");

                setBookingInfo({
                  dateStr: info.dateStr,
                  dayName: dayName,
                  dayNumber: dayNumber,
                  monthName: monthName,
                  startHour: startHour,
                  endHour: endHour,
                  startsAtDate: startsAtDate,
                  startsAtTime: startsAtTime,
                  startsAtTime24: startsAtTime24,
                  endsAtDate: endsAtDate,
                  endsAtTime: endsAtTime,
                  endsAtTime24: endsAtTime24,
                });
                setModalVisible(true);
              }
            }}
            //@ts-ignore
            longPressDelay="0"
          />
          {modalVisible && (
            <ModalCreateEvent
              open={modalVisible}
              updateOpen={updateOpen}
              //@ts-ignore
              bookingInfo={bookingInfo}
              addEvent={addEvent}
              handleCreateEventError={handleCreateEventError}
            />
          )}
          {modalEventDetailVisible && (
            <ModalEventDetail
              openEventDetail={modalEventDetailVisible}
              updateOpenEventDetail={updateOpenEventDetail}
              //@ts-ignore
              bookingDetail={bookingDetail}
              handleDeleteEvent={handleDeleteEvent}
              handleCompletePayment={handleCompletePayment}
            />
          )}
          {modalInfoVisible && (
            <Modal
              title={modalDetail.title}
              footer={modalDetail.subtitle}
              type={modalDetail.type}
              updateOpenInfo={updateOpenInfo}
            />
          )}
          {modalLoadingVisible && (
            <ModalLoading
              title={modalLoadingDetail.title}
              footer={modalLoadingDetail.footer}
            />
          )}
        </div>
      </div>
    );
};

export default Calendar;
