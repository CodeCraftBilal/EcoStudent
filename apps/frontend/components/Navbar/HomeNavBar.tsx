"use client";
import { Leaf, Menu, ShoppingBag, ShoppingBasket, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/context/useSession";
import Image from "next/image";

const HomeNavBar = () => {
  // checking the session
  const { session, isLoading, refreshSession } = useSession();

  const hiddenPaths = ["/auth/signin", "/auth/signup", "/dashboard", "/shop"];

  const pages = [
    { id: 1, name: "Home", href: "/" },
    { id: 2, name: "Shop", href: "/shop" },
    { id: 3, name: "Features", href: "/#features" },
    { id: 4, name: "How It Works", href: "/how-it-works" },
    { id: 5, name: "About Us", href: "/aboutus" },
  ];

  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // refreshSession()
  }, [])
  
  useEffect(() => {
    const shouldHide = hiddenPaths.some((path) => pathname.startsWith(path));
    setIsHidden(shouldHide);
  }, [pathname]);

  // Early return after useEffect sets the state
  if (isHidden) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* <Leaf className="w-8 h-8 text-green-600" /> */}
            <Image src={'/logo.png'} alt='EcoStudent' width={50} height={50} />
            <span className="text-2xl font-bold text-gray-900">EcoStudent</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={page.href}
                className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
              >
                {page.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session && session.userName ? (
              <Link
                href={"/dashboard"}
                className="text-gray-700 cursor-pointer hover:text-green-600 transition-colors font-bold"
              >
                {session.userName}
              </Link>
            ) : (
              <Link
                href={"/auth/signin"}
                className="text-gray-700 cursor-pointer hover:text-green-600 transition-colors font-bold"
              >
                Signin 
              </Link>
            )}
            <Link
              href={"/shop"}
              className="flex gap-1 font-bold text-xl bg-green-600 cursor-pointer text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors shadow-lg"
            >
              <ShoppingBasket />
              Start Shoping
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {session && session.userName ? (
              <Link
                href={"/dashboard"}
                className="text-gray-700 cursor-pointer hover:text-green-600 transition-colors text-lg font-bold"
              >
                {session.userName}
              </Link>
            ) : (
              <Link
                href={"/auth/signin"}
                className="text-gray-700 cursor-pointer hover:text-green-600 transition-colors text-lg font-bold"
              >
                Signin
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 right-0 w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-green-100">
              {pages.map((page) => (
                <Link
                  key={page.id}
                  href={page.href}
                  onClick={closeMenu}
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors cursor-pointer"
                >
                  {page.name}
                </Link>
              ))}
              {/* Mobile Signup Button */}
              <div className="px-3 py-2">
                <Link
                  href={"/auth/signup"}
                  onClick={closeMenu}
                  className="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-full hover:bg-green-700 transition-colors shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HomeNavBar;
