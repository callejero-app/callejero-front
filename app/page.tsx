"use client";
import React, { useEffect, useState } from "react";

function Home() {
  // middleware
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.href;
      if (!path.includes("/login")) {
        validateToken();
      }
    }
  }, []);
  const validateToken = () => {
    const token = localStorage.getItem("auth");
    const org = localStorage.getItem("organizationId");
    const gamefield = localStorage.getItem("gamefieldId");
    if (token && org && gamefield) {
      window.location.href = "/schedule";
    } else if (token && !org) {
      window.location.href = "/organizations";
    } else if (token && !gamefield) {
      window.location.href = "/organizations";
    } else if (!token) {
      window.location.href = "/login";
    }
  };
  if (visible) return <div>Home</div>;
}

export default Home;
