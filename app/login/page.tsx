"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { FormEvent, useState } from "react";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "@/components/login/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/login/EyeSlashFilledIcon";
import Modal from "@/components/Modal";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";

import "./login.css";
import logo from "@/public/images/callejero-dark.svg";
import banner from "@/public/images/desktop-login-banner.svg";
import Image from "next/image";
import Button from "@/components/Button";
// import Loader from "@/components/loader/Loader";
import { globals } from "../globals";

function Login() {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [modalDetail, setModalDetail] = useState({
    title: "",
    subtitle: "",
    type: "",
  });
  const [modalVisible, setModalVisible] = useState(false);

  const redirectToSelectGameField = () => {
    router.push("/selectgamefield");
  };

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

    const url = `${globals.apiURL}/auth/web`;
    console.log("url ENV", url);
    try {
      const res = await axios
        .post(
          url,
          {
            email,
            password,
          },
          {
            // withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "x-tz": localStorage.getItem("timezone"),
              "accept-language": "es",
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
            setModalDetail({
              title: "Inicio de Sesión Exitoso!",
              subtitle: "¡Bienvenido de nuevo! Has iniciado sesión con éxito.",
              type: "success",
            });
            setModalVisible(true);
            setLoading(false);
            // window.location.href = "/selectgamefield";
            redirectToSelectGameField();
          }
        });
    } catch (error) {
      console.log(error);
      // console.log(error.response.data.error.message);
      //@ts-ignore
      const codeMessage = error?.response?.data?.error?.message;
      setModalDetail({
        //@ts-ignore
        title: codeMessage,
        subtitle: "",
        type: "error",
      });
      setModalVisible(true);
      // toast.error("Something failed!", {
      //   autoClose: 2000,
      //   icon: "❌",
      //   theme: "dark",
      // });
      setLoading(false);
      localStorage.clear();
    }
  };

  const updateOpen = (open: boolean) => {
    setModalVisible(open);
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
      window.location.href = "/selectgamefield";
    } else {
      setVisible(true);
    }
  };
  if (visible)
    return (
      <div>
        {modalVisible && (
          <Modal
            title={modalDetail.title}
            footer={modalDetail.subtitle}
            type={modalDetail.type}
            updateOpenInfo={updateOpen}
          />
        )}
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
                size="lg"
              />
              <Input
                name="password"
                isRequired
                id="passwordInput"
                variant="bordered"
                label="Contraseña"
                className="mt-8 mx-auto w-[342px]"
                type={isVisible ? "text" : "password"}
                size="lg"
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
                // <Loader />
                <Spinner size="lg" color="primary" className="mt-8" />
              ) : (
                <Button text="Ingresar" width={342} className="mt-8" />
              )}
              <p className="mt-8 opacity-70">
                ¿Olvidaste tu contraseña? {/* <a href=""> */}
                <b style={{ cursor: "not-allowed" }} className="text-callejero">
                  Recupérala aquí.
                </b>
                {/* </a> */}
              </p>
              <p className="mt-6 opacity-70">
                ¿No tienes una cuenta? {/* <a href=""> */}
                <b style={{ cursor: "not-allowed" }} className="text-callejero">
                  Regístrate.
                </b>
                {/* </a> */}
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
