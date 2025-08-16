"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ConnectWalletButton from "@/component/ConnectButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "#features", label: "Features" },
    { href: "#docs", label: "Docs" },
    { href: "#about", label: "About" },
  ];


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (open && !event.target.closest("nav")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg"
          : "bg-gray-900/80 backdrop-blur-sm"
      } text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
   
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                <span className="text-sm font-black">TS</span>
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                TSender
              </span>
            </Link>

    
            <div className="hidden md:flex md:ml-8 space-x-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-gray-300 hover:text-white rounded-lg transition-all duration-200 group overflow-hidden"
                >
                  <span className="relative z-10 font-medium">
                    {link.label}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-8 transition-all duration-300"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ConnectWalletButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              aria-controls="mobile-menu"
              aria-expanded={open}
              className="relative inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 md:hidden transition-all duration-200"
            >
              <span className="sr-only">Toggle navigation menu</span>
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute left-0 top-1 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    open ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 w-6 h-0.5 bg-current transition-all duration-300 ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-5 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    open ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-gray-900/95 backdrop-blur-md border-t border-gray-800/50">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-200 transform ${
                open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              }`}
              style={{
                transitionDelay: open ? `${index * 50}ms` : "0ms",
              }}
            >
              {link.label}
            </a>
          ))}

          <div
            className={`pt-4 border-t border-gray-800/50 mt-4 transform transition-all duration-200 ${
              open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
            style={{
              transitionDelay: open ? `${links.length * 50}ms` : "0ms",
            }}
          >
            <div className="px-4">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
