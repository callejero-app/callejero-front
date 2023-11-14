"use client";
import { useEffect, useRef, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalCreateEvent from "@/components/ModalCreateEvent";
import ModalEventDetail from "@/components/ModalEventDetail";
import moment from "moment";
import "./Calendar.scss";

function Calendar(data: any) {
  const [bookings, setBookings] = useState(data.data);
  const [gridModified, setGridModified] = useState(false);
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const [bookingInfo, setBookingInfo] = useState({});
  const [events, setEvents] = useState([
    {
      title: "",
      start: "",
      end: "",
      tag: "",
      detail: {},
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEventDetailVisible, setModalEventDetailVisible] = useState(false);
  const [bookingDetail, setBookingDetail] = useState({});

  useEffect(() => {
    setBookings(data.data);
  }, [data]);

  useEffect(() => {
    setEvents(
      bookings.length > 0
        ? bookings.map((booking: any) => ({
            detail: booking,
            title:
              booking.description != null ? booking.description : "Reserva",
            start: booking.startsAt,
            end: booking.endsAt,
          }))
        : {}
    );
    console.log("bookings", bookings);
    console.log("events", events);
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

  interface Event {
    title: string;
    start: string;
    end: string;
    tag: string;
    detail: {};
  }

  const addEvent = (newEvent: Event) => {
    setEvents([
      ...events,
      {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        tag: newEvent.tag,
        detail: newEvent.detail,
      },
    ]);
    console.log("event state:", events);
  };

  if (gridModified)
    return (
      <div className="calendar bg-callejero">
        <div className="calendar__grid bg-white md:px-6">
          <Fullcalendar
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
            height={"calc(100vh - 80px)"}
            eventColor={"#184135"}
            events={events}
            eventClick={(e) => {
              //PRIORIDAD
              console.log("evento", e);

              console.log("viene de la db");
              const tag = e.event._def.extendedProps.detail.originPlatform;
              const start = new Date(
                e.event._def.extendedProps.detail.startsAt
              );
              const startStr = moment(start).format("hh:mm A");
              const end = new Date(e.event._def.extendedProps.detail.endsAt);
              const endStr = moment(end).format("hh:mm A");
              const dayName = moment(start).format("dddd");
              const dayNumber = moment(start).format("D");
              const monthName = new Date(start).toLocaleString("es-ES", {
                month: "long",
              });
              const description = e.event._def.extendedProps.detail.description;
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
              setBookingDetail({
                tag: tag,
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
              setModalEventDetailVisible(true);
            }}
            eventMinWidth={50}
            eventClassNames={"own-event"}
            eventStartEditable={false}
            disableDragging={true}
            dateClick={(info) => {
              const dayName = moment(info.dateStr).format("dddd");
              const dayNumber = moment(info.dateStr).format("D");
              const monthName = new Date(info.dateStr).toLocaleString("es-ES", {
                month: "long",
              });
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
            />
          )}
          {modalEventDetailVisible && (
            <ModalEventDetail
              openEventDetail={modalEventDetailVisible}
              updateOpenEventDetail={updateOpenEventDetail}
              //@ts-ignore
              bookingDetail={bookingDetail}
            />
          )}
        </div>
      </div>
    );
}

export default Calendar;
