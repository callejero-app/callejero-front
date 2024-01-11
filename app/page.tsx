"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

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
      // window.location.href = "/login";
      router.push("/login");
    } else {
      // window.location.href = "/selectgamefield";
      router.push("/selectgamefield");
    }
  };
  if (visible) return <div>Home</div>;
}

export default Home;
