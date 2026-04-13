"use client";

export default function HeroSection() {
  return (
    <section className="relative w-full md:h-screen py-20 md:-mt-24 overflow-hidden">
      
      {/* ===== Background Video ===== */}
      <video
        className="absolute bottom-0 left-0 w-full h-full object-cover  "
        src="/hero-video-1.mp4"   // put video in /public folder
        autoPlay
        muted
        loop
        playsInline
      />

      {/* ===== Overlay ===== */}
      {/* <div className="absolute inset-0 bg-black/40" /> */}

      {/* ===== Content ===== */}
      <div className="relative z-10 flex h-full items-center justify-center text-center px-6">
        <div className="max-w-7xl">
          
          <h1 className="text-white text-md md:mt-24 md:text-3xl lg:text-3xl font-light tracking-widest uppercase">
           
          </h1>

        </div>
      </div>

    </section>
  );
}
