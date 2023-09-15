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
        <h1 className="text-2xl mb-6">
          {localStorage.getItem("organizationName")} /{" "}
          <b>{localStorage.getItem("gamefieldName")}</b>
        </h1>
        <Fullcalendar
          locale={esLocale}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"timeGridWeek"}
          headerToolbar={{
            start: "today prev,next", // will normally be on the left. if RTL, will be on the right
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
          }}
          height={"90vh"}
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
