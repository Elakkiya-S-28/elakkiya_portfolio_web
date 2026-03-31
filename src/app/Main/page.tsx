"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi"; // Install react-icons

import Contacts from "@/container/Main/Contacts/page";
import Experience from "@/container/Main/Experience/page";
import Home from "@/container/Main/Home/page";
import Project from "@/container/Main/Project/page";
import { Skills } from "@/container/Main/Skills/page";

export default function Main() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#project" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contacts" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNav(false);
        setIsMobileMenuOpen(false); // Close menu on scroll
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="bg-[#050505] min-h-screen selection:bg-indigo-500/30">
      {/* NAVIGATION BAR */}
      <nav
        className={`fixed top-0 z-[100] w-full transition-all duration-300 border-b border-white/5 
        ${showNav ? "translate-y-0" : "-translate-y-full"} 
        ${lastScrollY > 20 ? "bg-black/80 backdrop-blur-xl py-3" : "bg-transparent py-5"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* LOGO */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl md:text-2xl font-bold tracking-tighter text-white"
          >
            Elakkiya <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Selvarajan</span>
          </motion.h1>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-white text-3xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>

        {/* MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-2xl font-semibold text-slate-300 hover:text-indigo-400 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* SECTIONS */}
      <main className="relative">
        <section id="home" className="scroll-mt-20">
          <Home />
        </section>

        <section id="skills" className="scroll-mt-20 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <Skills />
          </div>
        </section>

        <section id="project" className="scroll-mt-20 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <Project />
          </div>
        </section>

        <section id="experience" className="scroll-mt-20 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <Experience />
          </div>
        </section>

        <section id="contacts" className="scroll-mt-20 py-20 bg-gradient-to-b from-transparent to-indigo-500/5">
          <div className="max-w-7xl mx-auto px-6">
            <Contacts />
          </div>
        </section>
      </main>

      {/* GLOBAL SMOOTH SCROLL HACK */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}