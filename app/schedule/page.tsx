"use client";
import React, { useEffect, useState } from "react";
import Calendar from "@/components/Calendar/Calendar";
import Loader from "@/components/loader/Loader";

function Schedule() {
  const [loading, setLoading] = useState(false);

  //middleware
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.href;
      console.log("path", path);
      if (!path.includes("/login")) {
        validateToken();
      }
    }
  }, []);

  const validateToken = () => {
    const token = localStorage.getItem("auth");
    if (token) {
      setVisible(true);
    } else {
      window.location.href = "/login";
    }
  };

  if (visible) return <div>{loading ? <Loader /> : <Calendar />}</div>;
}

export default Schedule;
