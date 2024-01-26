"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/images/-callejero-light.svg";
import logoutButton from "@/public/images/right-from-bracket-solid.svg";
import logoMobile from "@/public/images/callejero-long.svg";
import { Link, Button } from "@nextui-org/react";
import "./Navbar.scss";

function Navbar() {
  const [visible, setVisible] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.href;
      setVisible(!path.includes("/login"));
    }
  }, []);

  if (visible)
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
            width={140}
            height={80}
            className="md:hidden"
          />
        </div>
        <ul className="hidden md:flex text-white items-center w-full">
          <div className=" flex float-left">
            <li className="hidden md:block ml-12">
              <Link
                href={`/selectgamefield`}
                className="text-white px-4 py-2 hover:bg-[#557b6b] rounded-full"
              >
                Organizaciones
              </Link>
            </li>
            <li className="hidden ml-6">
              <Link
                href={`/gamefields`}
                className="text-white px-4 py-2 hover:bg-[#557b6b] rounded-full transition-all"
              >
                Canchas
              </Link>
            </li>
          </div>
          <div className="float-right hidden w-full justify-end md:flex">
            <Button
              onClick={logout}
              as={Link}
              fullWidth={false}
              className="text-white logout-btn rounded-full hover:scale-105 transition-all"
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
              onClick={logout}
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

export default Navbar;
