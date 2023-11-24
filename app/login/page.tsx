"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { FormEvent, useState } from "react";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "@/components/login/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/login/EyeSlashFilledIcon";
import { ToastContainer, toast } from "react-toastify";

import "./login.css";
import logo from "@/public/images/callejero-dark.svg";
import banner from "@/public/images/desktop-login-banner.svg";
import Image from "next/image";
import Button from "@/components/Button";
import Loader from "@/components/loader/Loader";

function Login() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.clear();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const remoteTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezone =
      remoteTimezone != undefined ? remoteTimezone : "America/Bogota";
    localStorage.setItem("timezone", timezone);
    // Varaibles de entorno
    // const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/web`;
    const url = `https://callejero.com.co/test/api/v1/auth/web`;
    try {
      const res = await axios
        .post(
          url,
          {
            email: email,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-tz": localStorage.getItem("timezone"),
            },
          }
        )
        .then((res) => {
          // console.log("response", res);

          // const webToken = res.data.data.webToken;
          // const userId = res.data.data.user.id;
          localStorage.setItem("auth", res.data.data.webToken);
          localStorage.setItem("clientId", res.data.data.user.id);
          localStorage.setItem("clientName", res.data.data.user.name);
          localStorage.setItem("clientSex", res.data.data.user.sex);
          if (res.status == 200) {
            toast.success("User found!", {
              autoClose: 2000,
              icon: "✅",
              theme: "dark",
            });
            setLoading(false);
            window.location.href = "/selectgamefield";
          }
        });
    } catch (error) {
      console.log(error);
      toast.error("Something failed!", {
        autoClose: 2000,
        icon: "❌",
        theme: "dark",
      });
      setLoading(false);
      localStorage.clear();
    }
  };

  //middleware
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      validateToken();
    }
  }, []);

  const validateToken = () => {
    const token = localStorage.getItem("auth");
    if (token) {
      window.location.href = "/organizations";
    } else {
      setVisible(true);
    }
  };
  if (visible)
    return (
      <div>
        <div className="login text-center items-center flex h-screen">
          <div className="w-full flex">
            <form
              onSubmit={handleSubmit}
              className="w-full lg:w-1/2 self-center"
            >
              <Image
                src={logo}
                alt="icon"
                width={140}
                priority={true}
                className="mx-auto"
              />
              <h1 className="login__title mt-10">Inicia sesión</h1>
              <Input
                name="email"
                isRequired
                variant="bordered"
                type="email"
                label="Correo electrónico"
                className="mt-8 mx-auto w-[342px]"
              />
              <Input
                name="password"
                isRequired
                id="passwordInput"
                variant="bordered"
                label="Contraseña"
                className="mt-8 mx-auto w-[342px]"
                type={isVisible ? "text" : "password"}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
              {loading ? (
                <Loader />
              ) : (
                <Button text="Ingresar" width={342} className="mt-8" />
              )}
              <p className="mt-8">
                ¿Olvidaste tu contraseña?{" "}
                <a href="">
                  <b className="text-callejero">Recupérala aquí.</b>
                </a>
              </p>
              <p className="mt-6">
                ¿No tienes una cuenta?{" "}
                <a href="">
                  <b className="text-callejero">Regístrate.</b>
                </a>
              </p>
            </form>
            <div className="login__banner hidden lg:block lg:w-1/2">
              <Image
                src={banner}
                style={{ height: "85vh" }}
                alt="icon"
                priority={true}
                className="p-9"
              />
            </div>
          </div>
        </div>
      </div>
    );
}

export default Login;
