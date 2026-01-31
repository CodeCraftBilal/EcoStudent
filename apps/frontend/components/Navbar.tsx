"use client";
import { Leaf, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import HomeNavBar from "./Navbar/HomeNavBar";
import { ShopNavBar } from "./shop/header";

const Navbar = () => {
  const pathname = usePathname();
  console.log(pathname)

  return (
    <HomeNavBar />
  );
};

export default Navbar;