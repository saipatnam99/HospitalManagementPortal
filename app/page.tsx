"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // GSAP animation for text
    gsap.fromTo(
      textRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 2, ease: "power3.out" }
    );
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");

    gsap.to(e.currentTarget, {
      x: 100,
      opacity: 0,
      duration: 1,
      onComplete: () => {
        if (href) window.location.href = href;
      },
    });
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col text-white"
      style={{
        backgroundImage: "url('https://healthray.com/wp-content/uploads/2024/02/Benefits-Of-Creating-Hospital-Management-System-1024x529.webp')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <nav className="relative z-10 flex flex-col md:flex-row justify-between items-center p-4 md:pb-6 bg-transparent text-white">
        <div className="flex items-center">
          <a
            href="/login"
            onClick={handleLinkClick}
            className="px-4 py-2 mt-2 md:mt-0 text-md font-semibold bg-transparent border border-white rounded-lg hover:bg-white hover:text-blue-500 transition duration-300"
          >
            Login
          </a>
          <a
            href="/signup"
            onClick={handleLinkClick}
            className="px-4 py-2 mt-2 md:mt-0 md:ml-4 text-md font-semibold bg-transparent border border-white rounded-lg hover:bg-white hover:text-blue-500 transition duration-300"
          >
            Sign Up
          </a>
        </div>
      </nav>

      <div className="relative z-10 flex-grow flex justify-center items-center p-4">
        <h1
          ref={textRef}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-center leading-tight max-w-3xl md:max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-white to-blue-500"
        >
          Welcome to Hospital Management Portal
        </h1>
      </div>
    </div>
  );
};

export default Home;
