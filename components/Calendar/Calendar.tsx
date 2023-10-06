"use client";
import { useEffect, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.scss";

function Calendar(data: any) {
  const [bookings, setBookings] = useState(data.data);
  const [gridModified, setGridModified] = useState(false);

  console.log("bookings", bookings);
  console.log("data q llega", data.data);

  useEffect(() => {
    setBookings(data.data);
  }, [data]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGridModified(true);
    }
  }, []);

  if (gridModified)
    return (
      <div className="calendar bg-callejero">
        <div className="calendar__grid bg-white p-6">
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
            dayHeaderClassNames={"dayHeader"}
            dayHeaderFormat={{
              day: "numeric",
              weekday: "long",
              omitCommas: true,
            }}
            dayHeaderContent={(arg) => {
              var day = arg.date.getDate(); // Obtener el día del mes
              var weekday = arg.date.toLocaleString("default", {
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
            initialView={"timeGridWeek"}
            height={"calc(100vh - 202px)"}
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
          />
        </div>
      </div>
    );
}

export default Calendar;
