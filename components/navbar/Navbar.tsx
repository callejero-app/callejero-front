"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import logo from "@/public/images/-callejero-light.svg";
import "./Navbar.css";

export default function App() {
  const menuItems = ["Inicio", "Horario de Canchas", "Personal", "Log Out"];

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
      <Navbar
        disableAnimation
        isBordered
        className="bg-callejero h-20 text-white px-14"
      >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>
            <Image
              src={logo}
              alt="icon"
              height={38}
              priority={true}
              className="mx-auto"
            />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarBrand>
            <Image
              src={logo}
              alt="icon"
              height={38}
              priority={true}
              className="mx-auto"
            />
          </NavbarBrand>
          <NavbarItem>
            <Link color="foreground" href="#">
              Inicio
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link color="foreground" href="#" className="selected">
              Horario de Canchas
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Personal
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              onClick={logout}
              as={Link}
              className="text-white logout-btn"
              variant="flat"
            >
              Log Out
            </Button>
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <div
              className="bg-white rounded-full"
              style={{ width: "48px", height: "48px" }}
            ></div>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color={
                  index === 1
                    ? "warning"
                    : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    );
}
