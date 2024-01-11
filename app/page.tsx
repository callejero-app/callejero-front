"use client";
import React, { useEffect, useState } from "react";

function Home() {
  // middleware
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      validateToken();
    }
  }, []);

  const validateToken = () => {
    const token = localStorage.getItem("auth");
    if (!token) {
      window.location.href = "/login";
    } else {
      window.location.href = "/selectgamefield";
    }
  };
  if (visible) return <div>Home</div>;
}

export default Home;
