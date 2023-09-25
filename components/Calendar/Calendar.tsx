"use client";
import Fullcalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "./Calendar.css";
import { useState } from "react";

function Calendar(data: any) {
  const [bookings, setBookings] = useState(data.data);
  return (
    <div className="calendar bg-callejero">
      <div className="calendar__grid bg-white p-6">
        {/* <h1 className="text-2xl mb-6">
          {localStorage.getItem("organizationName")} /{" "}
          <b>{localStorage.getItem("gamefieldName")}</b>
        </h1> */}
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
            end: "today,dayGridMonth,timeGridWeek,timeGridDay",
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
          events={bookings.map((booking: any) => ({
            title: "Reserva",
            start: booking.startsAt,
            end: booking.endsAt,
          }))}
        />
      </div>
    </div>
  );
}

export default Calendar;
