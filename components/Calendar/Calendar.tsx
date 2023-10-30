"use client";
import { useEffect, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalCreateEvent from "@/components/ModalCreateEvent";
import "./Calendar.scss";

function Calendar(data: any) {
  const [bookings, setBookings] = useState(data.data);
  const [gridModified, setGridModified] = useState(false);
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("Nico");
  const [msg, setMsg] = useState("");

  // console.log("bookings", bookings);
  // console.log("data q llega", data.data);

  useEffect(() => {
    setBookings(data.data);
  }, [data]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGridModified(true);
    }
  }, []);

  useEffect(() => {
    resizeListener();
  }, [widthScreen]);

  const resizeListener = () => {
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      setWidthScreen(width);
      // if (width > 768) console.log("modo desktop");
    });
  };

  // const updateMessage = (msg: string) => {
  //   setMsg(msg);
  // };

  const updateOpen = (open: boolean) => {
    setModalVisible(open);
  };

  if (gridModified)
    return (
      <div className="calendar bg-callejero">
        <div className="calendar__grid bg-white md:p-6">
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
            events={
              bookings.length > 0
                ? bookings.map((booking: any) => ({
                    title: "Reserva",
                    start: booking.startsAt,
                    end: booking.endsAt,
                  }))
                : {}
            }
            eventMinWidth={50}
            eventClassNames={"own-event"}
            selectable={true}
            select={(start) => {
              console.log("click en: ", start);
              // <ModalCreateEvent />;
              setModalVisible(true);
            }}
            longPressDelay="0"
          />
          {/* {modalVisible && <ModalCreateEvent open={true} />} */}
          {modalVisible && (
            // <ModalCreateEvent name={name} updateMessage={updateMessage} />
            <ModalCreateEvent open={modalVisible} updateOpen={updateOpen} />
          )}
          {/* <h1>Texto del hijo: {msg}</h1> */}
        </div>
      </div>
    );
}

export default Calendar;
