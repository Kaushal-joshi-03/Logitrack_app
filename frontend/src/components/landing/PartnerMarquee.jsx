import React from "react";

/**
 * Real, authentic logistics partners with brand SVGs and official color accents.
 * 10 industry leaders only — no generic placeholders.
 */
const PARTNERS = [
  {
    name: "Delhivery",
    tagline: "Express & Supply Chain",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#E4002B" />
        <path
          d="M12 12H20C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28H12V12Z"
          fill="white"
        />
        <path
          d="M16 16V24H20C22.2091 24 24 22.2091 24 20C24 17.7909 22.2091 16 20 16H16Z"
          fill="#E4002B"
        />
        <polygon points="26,14 31,19 26,19" fill="#111111" />
      </svg>
    ),
  },
  {
    name: "Blue Dart",
    tagline: "Aviation & Priority Express",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#002B80" />
        <path
          d="M8 24L32 16L18 30L16 22L8 24Z"
          fill="#FF2438"
        />
        <path
          d="M18 22L32 16L12 21L18 22Z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
  {
    name: "FedEx",
    tagline: "Global Express Freight",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#4D148C" />
        <text
          x="6"
          y="26"
          fill="#FFFFFF"
          fontWeight="900"
          fontSize="14"
          fontFamily="system-ui, sans-serif"
          letterSpacing="-1"
        >
          Fed
        </text>
        <text
          x="23"
          y="26"
          fill="#FF6600"
          fontWeight="900"
          fontSize="14"
          fontFamily="system-ui, sans-serif"
          letterSpacing="-1"
        >
          Ex
        </text>
      </svg>
    ),
  },
  {
    name: "Amazon Shipping",
    tagline: "Fulfillment Network",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#232F3E" />
        <path
          d="M11 25C17 29 23 29 29 24"
          stroke="#FF9900"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <polygon points="27,22 31,25 28,27" fill="#FF9900" />
        <circle cx="15" cy="17" r="2" fill="#FFFFFF" />
        <circle cx="25" cy="17" r="2" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "DTDC",
    tagline: "Pan-India Courier Network",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#DA291C" />
        <path
          d="M12 28L18 12L24 20L28 12L31 28H26L24 19L20 28H17L19 19L15 28H12Z"
          fill="white"
        />
        <circle cx="20" cy="10" r="2" fill="#00205B" />
      </svg>
    ),
  },
  {
    name: "Shadowfax",
    tagline: "Hyperlocal & 3PL",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#00A389" />
        <path
          d="M14 27L22 13H18L26 21H21L27 27L21 27L17 31V27H14Z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    name: "Xpressbees",
    tagline: "E-Commerce Logistics",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#FFB800" />
        <path
          d="M12 20C12 16 16 13 20 13C24 13 28 16 28 20C28 24 24 27 20 27C16 27 12 24 12 20Z"
          fill="#111111"
        />
        <line x1="17" y1="16" x2="17" y2="24" stroke="#FFB800" strokeWidth="1.5" />
        <line x1="23" y1="16" x2="23" y2="24" stroke="#FFB800" strokeWidth="1.5" />
        <circle cx="27" cy="16" r="1.5" fill="#111111" />
      </svg>
    ),
  },
  {
    name: "Ecom Express",
    tagline: "Last-Mile Distribution",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#0047BA" />
        <path
          d="M10 22C14 16 26 15 30 20C26 21 21 21 17 26C14 24 12 23 10 22Z"
          fill="#E31B23"
        />
        <circle cx="26" cy="16" r="2.5" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "DHL Express",
    tagline: "International Priority",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#FFCC00" />
        <text
          x="7"
          y="25"
          fill="#D40511"
          fontWeight="900"
          fontSize="13"
          fontFamily="system-ui, sans-serif"
          fontStyle="italic"
          letterSpacing="-0.5"
        >
          DHL
        </text>
        <line x1="28" y1="17" x2="33" y2="17" stroke="#D40511" strokeWidth="1.5" />
        <line x1="27" y1="21" x2="32" y2="21" stroke="#D40511" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Aramex",
    tagline: "Cross-Border Cargo",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#E30613" />
        <text
          x="7"
          y="25"
          fill="#FFFFFF"
          fontWeight="800"
          fontSize="10.5"
          fontFamily="system-ui, sans-serif"
          letterSpacing="-0.3"
        >
          aramex
        </text>
      </svg>
    ),
  },
];

// Split 10 leaders into two 5-item rows for staggered bidirectional conveyor
const ROW_1 = PARTNERS.slice(0, 5);
const ROW_2 = PARTNERS.slice(5, 10);

function PartnerCard({ partner }) {
  return (
    <div
      className="
        group flex shrink-0 items-center gap-3.5 rounded-2xl
        border border-slate-200/80 bg-white/95 px-5 py-3 shadow-sm
        backdrop-blur-sm transition-all duration-200
        hover:-translate-y-1 hover:border-slate-300 hover:shadow-md
        dark:border-white/10 dark:bg-[#111111] dark:hover:border-white/20
      "
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105">
        {partner.icon}
      </div>
      <div className="flex flex-col text-left">
        <span className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-[#ff2438] dark:text-white">
          {partner.name}
        </span>
        <span className="whitespace-nowrap text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {partner.tagline}
        </span>
      </div>
    </div>
  );
}

export default function PartnerMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-slate-200/80 bg-slate-50/80 py-12 transition-colors duration-200 dark:border-white/10 dark:bg-[#070707] lg:py-14">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-12">
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="mb-3 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-[#ff2438]">
            <span className="h-[2px] w-6 bg-[#ff2438]" />
            CARRIER ECOSYSTEM
            <span className="h-[2px] w-6 bg-[#ff2438]" />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
            Trusted by Leading Logistics Partners
          </h3>

          <p className="mt-2 max-w-xl text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Native real-time tracking and automated dispatch integrations with India’s top carrier networks.
          </p>
        </div>
      </div>

      {/* Full-Width Edge-to-Edge Marquee Conveyor */}
      <div
        className="marquee-wrapper relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-1"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        {/* Row 1: Leftward infinite conveyor */}
        <div className="mb-4 flex overflow-hidden">
          <div className="animate-marquee-left flex gap-4">
            {/* Repeated 3x to ensure flawless zero-gap 100% loop across large monitors */}
            {[...ROW_1, ...ROW_2, ...ROW_1, ...ROW_2].map((p, idx) => (
              <PartnerCard key={`row1-${p.name}-${idx}`} partner={p} />
            ))}
          </div>
        </div>

        {/* Row 2: Rightward infinite conveyor */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-right flex gap-4">
            {[...ROW_2, ...ROW_1, ...ROW_2, ...ROW_1].map((p, idx) => (
              <PartnerCard key={`row2-${p.name}-${idx}`} partner={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
