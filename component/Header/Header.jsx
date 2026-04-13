"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";

export default function Header() {
  const [showTop, setShowTop] = useState(true);
  const [communitiesOpen, setCommunitiesOpen] = useState(false);

  const communities = [
    "Port Moody Area",
    "Kitsilano",
    "Shaughnessy",
    "West Vancouver Area",
    "Burnaby",
    "Richmond",
    "Surrey",
    "Coquitlam",
    "Vancouver",
    "North Vancouver"
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setShowTop(true);
      } else {
        setShowTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");

  return (
    <header className="md:sticky md:top-0 z-50">

      {/* ===== Top Bar ===== */}
      <div
        className={`absolute left-0 right-0 top-0 bg-white pt-2 transition-transform duration-300 ${
          showTop ? "md:translate-y-0" : "md:-translate-y-full"
        }`}
      >
        <div className="h-full mx-auto md:pt-2 max-w-7xl px-4">
          <div className="h-full flex items-center justify-center md:justify-between text-sm">
            <div></div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <FaEnvelope /> info@trashthat.ca
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main Header ===== */}
      <div className={`bg-white shadow-sm ${showTop ? "md:pt-[44px] pt-[30px]" : ""}`}>
        <div className="flex justify-center py-2">
          <Link href="/">
            <Image
              src="/logo-1.png"
              alt="TrashThat"
              width={260}
              height={180}
              className={`object-contain transition-all duration-300 ${showTop ? "w-40 lg:w-52" : "w-28 lg:w-36"}`}
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  );
}