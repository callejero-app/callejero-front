"use client";
import Fullcalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "./Calendar.css";

function Calendar() {
  return (
    <div className="calendar bg-callejero">
      <div className="calendar__grid bg-white p-6">
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
          // events={["2023-09-04"]}
          eventColor={"#184135"}
          events={[
            { title: "Juego de Practica", date: "2023-09-04T08:00:00" },
            {
              title: "Reserva Juan",
              start: "2023-09-07T12:00:00",
              end: "2023-09-07T12:30:00",
            },
            { title: "Reservado", date: "2023-09-05" },
          ]}
        />
      </div>
    </div>
  );
}

export default Calendar;
