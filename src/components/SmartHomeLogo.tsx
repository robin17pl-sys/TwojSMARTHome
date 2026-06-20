import React from "react";

/**
 * High-fidelity logo emblem representing the smart home house with power icon and PCB traces.
 */
export function SmartHomeEmblem({ 
  className = "", 
  size = 48 
}: { 
  className?: string; 
  size?: number; 
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="houseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B2C6F" />
          <stop offset="60%" stopColor="#0066B3" />
          <stop offset="100%" stopColor="#00A2E8" />
        </linearGradient>
      </defs>
      
      {/* House Body Shape (thick border outer layout) */}
      <path
        d="M 120,200 L 250,90 L 325,153.5 L 325,135 L 345,135 L 345,171 L 380,200 
           M 144,206 L 144,350 A 10,10 0 0,0 154,360 L 346,360 A 10,10 0 0,0 351,357 M 356,220 L 356,260"
        stroke="url(#houseGradient)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* 2x2 Grid Window */}
      <g fill="#1F2937">
        <rect x="233" y="165" width="15" height="15" rx="1.5" />
        <rect x="253" y="165" width="15" height="15" rx="1.5" />
        <rect x="233" y="185" width="15" height="15" rx="1.5" />
        <rect x="253" y="185" width="15" height="15" rx="1.5" />
      </g>

      {/* Power Icon in standard center position */}
      <path
        d="M 220,265 A 28,28 0 1,0 280,265"
        stroke="#0066B3"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      <line
        x1="250"
        y1="235"
        x2="250"
        y2="265"
        stroke="#0066B3"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Top Circuit path */}
      <path
        d="M 320,240 M 345,240 L 390,240 L 415,215 L 435,215"
        stroke="#00A2E8"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="448" cy="215" r="9" fill="none" stroke="#00A2E8" strokeWidth="8" />

      {/* Middle Circuit path */}
      <path
        d="M 345,270 L 385,270 L 400,270 L 410,270"
        stroke="#00A2E8"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="423" cy="270" r="9" fill="none" stroke="#00A2E8" strokeWidth="8" />

      {/* Bottom Circuit path */}
      <path
        d="M 345,300 M 345,300 L 375,300 L 395,325 L 415,325"
        stroke="#00A2E8"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="428" cy="325" r="9" fill="none" stroke="#00A2E8" strokeWidth="8" />

    </svg>
  );
}

/**
 * Text layout resembling "Twój SMART Home" with highly stylized typography
 * and custom decorated lines and A-letter nested grid.
 */
export function SmartHomeLogoText({ 
  className = "",
  size = "md"
}: { 
  className?: string; 
  size?: "sm" | "md" | "lg";
}) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div className={`flex flex-col items-center select-none text-center ${className}`}>
      {/* 1. TWÓJ ROW WITH BLUE LINES */}
      <div className="flex items-center gap-3 w-full">
        <div className="h-[1.5px] bg-[#0066B3] flex-1 rounded-full opacity-80"></div>
        <span 
          style={{ letterSpacing: "0.22em" }} 
          className={`font-sans font-medium text-zinc-900 uppercase pr-1 ${
            isSm ? "text-[11px]" : isLg ? "text-[24px]" : "text-[14px]"
          }`}
        >
          Twój
        </span>
        <div className="h-[1.5px] bg-[#0066B3] flex-1 rounded-full opacity-80"></div>
      </div>

      {/* 2. SMART ROW WITH EMBEDDED WINDOW */}
      <div 
        style={{ letterSpacing: "0.05em" }}
        className={`font-sans font-black text-zinc-950 uppercase leading-none my-0.5 flex items-center justify-center ${
          isSm ? "text-[26px]" : isLg ? "text-[64px]" : "text-[38px]"
        }`}
      >
        SM
        <span className="relative inline-block">
          <span>A</span>
          {/* Micro layout for the blue 2x2 grid in 'A' */}
          <div 
            className="absolute left-[33%] bg-white p-[1px] rounded-[0.5px] grid grid-cols-2"
            style={{
              bottom: isSm ? "16%" : isLg ? "17%" : "16.5%",
              width: isSm ? "7px" : isLg ? "18px" : "11px",
              height: isSm ? "7px" : isLg ? "18px" : "11px",
              gap: isSm ? "1px" : isLg ? "2px" : "1px"
            }}
          >
            <div className="bg-[#00A2E8]" />
            <div className="bg-[#00A2E8]" />
            <div className="bg-[#00A2E8]" />
            <div className="bg-[#00A2E8]" />
          </div>
        </span>
        RT
      </div>

      {/* 3. HOME ROW WITH CYAN LINES */}
      <div className="flex items-center gap-3 w-full">
        <div className="h-[1.5px] bg-[#00A2E8] flex-1 rounded-full opacity-80"></div>
        <span 
          style={{ letterSpacing: "0.24em" }}
          className={`font-sans font-normal text-[#0066B3] uppercase pr-1 ${
            isSm ? "text-[12px]" : isLg ? "text-[26px]" : "text-[16px]"
          }`}
        >
          Home
        </span>
        <div className="h-[1.5px] bg-[#00A2E8] flex-1 rounded-full opacity-80"></div>
      </div>
    </div>
  );
}

/**
 * Full stacked branding representation. Elegant centered layout matching the provided attachment.
 */
export function SmartHomeFullLogo({ 
  className = "",
  emblemSize = 130,
  textSize = "md"
}: { 
  className?: string; 
  emblemSize?: number; 
  textSize?: "sm" | "md" | "lg";
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm ${className}`}>
      <SmartHomeEmblem size={emblemSize} className="mb-2" />
      <SmartHomeLogoText size={textSize} className="w-full max-w-[240px]" />
    </div>
  );
}

/**
 * Compact side-by-side layout designed specifically for header-bars/navigation menus.
 */
export function SmartHomeHeaderLogo({ 
  className = "",
  onClick
}: { 
  className?: string; 
  onClick?: () => void;
}) {
  return (
    <div 
      className={`flex items-center gap-2.5 cursor-pointer hover:opacity-95 active:scale-98 transition-all ${className}`}
      onClick={onClick}
    >
      <SmartHomeEmblem size={44} className="shrink-0" />
      <div className="flex flex-col items-center w-[110px]">
        <SmartHomeLogoText size="sm" className="w-full" />
      </div>
    </div>
  );
}
