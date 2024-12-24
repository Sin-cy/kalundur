import React from "react";
import Link from "next/link";
import Image from "next/image";

import Logo from "@/public/main-logo.png"
import { AuthModal } from "./AuthModal";
import { ThemeToggle } from "./ThemeToggle";

// because this is no longer a route, we can just do export function (no need for default)

export function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between ">
      <Link href="/" className="flex gap-3 items-center ">
        <Image src={Logo} alt="Logo" className="size-10 " />
        <h4 className="text-3xl font-bold ">
          Kalundur<span className="text-[#5D8AF4]">Wiz</span>
        </h4>
      </Link>

      <div className="hidden md:flex md:justify-end md:space-x-4 ">
        <ThemeToggle />
        <AuthModal />
      </div>
    </div>
  )

}
