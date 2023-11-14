"use client";
import React, { useEffect, useState } from "react";

function Home() {
  // middleware
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.href;
      // if (!path.includes("/login")) {
      validateToken();
      // }
    }
  }, []);

  const validateToken = () => {
    const token = localStorage.getItem("auth");
    if (!token) {
      window.location.href = "/login";
    } else {
      window.location.href = "/organizations";
    }
  };
  if (visible) return <div>Home</div>;
}

export default Home;
