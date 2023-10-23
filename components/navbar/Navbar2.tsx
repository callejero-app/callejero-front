"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/images/-callejero-light.svg";
import logoutButton from "@/public/images/right-from-bracket-solid.svg";
import logoMobile from "@/public/images/callejero-long.svg";
import { Link, Button } from "@nextui-org/react";
import "./Navbar2.scss";

function Navbar2() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="navbar flex bg-callejero h-20 px-6 md:px-14">
      <div className="items-center column flex md:hidden">
        <div className="burguer-menu">
          <div className="burguer-menu__line burguer-menu__line--one"></div>
          <div className="burguer-menu__line burguer-menu__line--two"></div>
          <div className="burguer-menu__line burguer-menu__line--three"></div>
        </div>
      </div>
      <Image
        src={logo}
        alt="icon"
        width={38}
        height={38}
        priority={true}
        className="hidden md:block"
      />
      <div className="w-screen flex justify-center md:hidden">
        <Image
          src={logoMobile}
          alt="icon"
          priority={true}
          className="md:hidden"
        />
      </div>
      <ul className="hidden md:flex text-white items-center w-full">
        <div className=" flex float-left">
          <li className="hidden md:block mx-12">
            <p>Home2</p>
          </li>
          <li className="hidden md:block">
            <p>Calendario</p>
          </li>
        </div>
        <div className="float-right hidden w-full justify-end md:flex">
          <Button
            onClick={logout}
            as={Link}
            fullWidth={false}
            className="text-white logout-btn"
            variant="flat"
          >
            Log Out
          </Button>
        </div>
      </ul>
      <div className="flex float-right md:hidden items-center">
        <button>
          <Image
            src={logoutButton}
            alt="icon"
            width={38}
            height={38}
            priority={true}
            className="md:hidden"
          />
        </button>
      </div>
    </div>
  );
}

export default Navbar2;
