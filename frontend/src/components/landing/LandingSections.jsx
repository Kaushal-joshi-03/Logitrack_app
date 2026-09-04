import { Link } from "react-router-dom";
import SectionReveal from "./SectionReveal";

function SectionShell({ id, eyebrow, title, blurb, children, cta }) {
  return (
    <section
      id={id}
      className="landing-scroll-section relative w-full px-6 py-28 lg:px-14"
    >
      <div className="mx-auto w-full max-w-[1300px]">
        <SectionReveal variant="up" className="max-w-2xl">
          <div className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.35em] text-[#ff2438]">
            <span className="h-[2px] w-8 bg-[#ff2438]" />
            {eyebrow}
          </div>
          <h2 className="text-3xl font-black leading-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            {blurb}
          </p>
        </SectionReveal>

        <div className="mt-14">{children}</div>

        {cta && (
          <SectionReveal variant="fade" delay={0.15} className="mt-14">
            <Link
              to={cta.to}
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              }}
              className="
                inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-white/15
                bg-white dark:bg-white/[0.04] px-6 py-3 text-xs font-bold uppercase tracking-wider
                text-slate-900 dark:text-white transition-all duration-300 shadow-sm
                hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400
              "
            >
              {cta.label}
              <span>→</span>
            </Link>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}

function GlassCard({ number, title, description, icon, delay = 0 }) {
  return (
    <SectionReveal
      variant="up"
      delay={delay}
      className="
        group relative overflow-hidden rounded-2xl border border-slate-200
        bg-white/95 p-6 shadow-sm backdrop-blur-md transition-all duration-300
        hover:-translate-y-1.5 hover:border-red-500/40 hover:shadow-md
        dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none dark:hover:bg-white/[0.05]
      "
    >
      <div className="relative flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {number}
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-base text-red-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-red-500">
          {icon}
        </span>
      </div>
      <h3 className="relative mt-8 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="relative mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
    </SectionReveal>
  );
}

/* ================================================================
   SERVICES
   ================================================================ */
const SERVICE_ITEMS = [
  { number: "01", icon: "⚡", title: "Express Delivery", description: "Priority-lane shipments with accelerated handling at every hub." },
  { number: "02", icon: "◈", title: "Shipment Management", description: "Create, monitor and manage shipments from a single workspace." },
  { number: "03", icon: "▣", title: "Warehouse Operations", description: "Intake scanning, receiving and distributor hand-off, streamlined." },
  { number: "04", icon: "◎", title: "Distribution", description: "Route packages through the right hub chain automatically." },
  { number: "05", icon: "◫", title: "Package Handling", description: "Careful, trackable custody at every touchpoint of the journey." },
  { number: "06", icon: "◍", title: "Real-Time Operations", description: "Live status across client, warehouse, distributor and courier." },
];

export function ServicesSection({ id }) {
  return (
    <SectionShell
      id={id}
      eyebrow="WHAT WE DO"
      title="A full logistics stack, built for scale."
      blurb="From the moment a shipment is created to the moment it's signed for, LOGITRACK coordinates every role in the chain — client, warehouse, distributor, courier and admin — in real time."
      cta={{ to: "/services", label: "Explore Full Services" }}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_ITEMS.map((s, i) => (
          <GlassCard key={s.title} {...s} delay={i * 0.06} />
        ))}
      </div>
    </SectionShell>
  );
}

/* ================================================================
   SOLUTIONS
   ================================================================ */
const SOLUTION_ITEMS = [
  { number: "01", icon: "◆", title: "Enterprise Logistics", description: "High-volume operations with role-based access and audit trails." },
  { number: "02", icon: "◇", title: "E-commerce Delivery", description: "Fulfillment pipelines built for fast-moving online storefronts." },
  { number: "03", icon: "▤", title: "Warehouse Management", description: "Structured receiving, storage and outbound hand-off workflows." },
  { number: "04", icon: "⬡", title: "Last-Mile Delivery", description: "Courier assignment and delivery confirmation at the final leg." },
];

export function SolutionsSection({ id }) {
  return (
    <SectionShell
      id={id}
      eyebrow="SOLUTIONS"
      title="Built for how your business actually ships."
      blurb="Whether you're running enterprise distribution or last-mile delivery for online orders, LOGITRACK's role-based dashboards adapt to the way each team already works."
      cta={{ to: "/solutions", label: "See All Solutions" }}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SOLUTION_ITEMS.map((s, i) => (
          <GlassCard key={s.title} {...s} delay={i * 0.07} />
        ))}
      </div>
    </SectionShell>
  );
}

/* ================================================================
   NETWORK
   ================================================================ */
const NETWORK_CITIES = [
  { name: "Delhi", tag: "North Hub" },
  { name: "Mumbai", tag: "West Gateway" },
  { name: "Ahmedabad", tag: "Transit Facility" },
  { name: "Bengaluru", tag: "South Hub" },
];

export function NetworkSection({ id }) {
  return (
    <SectionShell
      id={id}
      eyebrow="NATIONAL NETWORK"
      title="A live map of hubs, routes and distribution centers."
      blurb="Every warehouse, distribution center and delivery point is connected on a single logistics graph — the same network your dashboard uses to route every shipment."
      cta={{ to: "/network", label: "View Live Network" }}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {NETWORK_CITIES.map((c, i) => (
          <SectionReveal
            key={c.name}
            variant="scale"
            delay={i * 0.08}
            className="
              relative rounded-xl border border-slate-200 bg-white/95 px-5 py-6
              text-center shadow-sm backdrop-blur-md transition-all duration-300
              hover:border-red-500/40 hover:shadow-md
              dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none dark:hover:bg-white/[0.05]
            "
          >
            <span className="mx-auto mb-3 block h-2 w-2 rounded-full bg-[#ff2438] shadow-[0_0_10px_rgba(255,36,56,0.8)]" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</div>
            <div className="mt-1 text-[10px] font-semibold tracking-wider text-slate-600 dark:text-slate-400">{c.tag}</div>
          </SectionReveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* ================================================================
   TRACKING
   ================================================================ */
const TRACKING_STEPS = [
  "Package Created",
  "Picked Up",
  "Warehouse",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export function TrackingSection({ id }) {
  return (
    <SectionShell
      id={id}
      eyebrow="SHIPMENT TRACKING"
      title="Know exactly where every package is."
      blurb="Every shipment moves through the same six checkpoints — visible to your client the whole way, from creation to doorstep."
      cta={{ to: "/tracking", label: "Track Shipment" }}
    >
      <SectionReveal variant="fade">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-5">
          {TRACKING_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className="
                  flex items-center gap-2 rounded-full border border-slate-200
                  bg-white px-4 py-2 text-[11px] font-semibold uppercase
                  tracking-wider text-slate-700 shadow-sm
                  dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:shadow-none
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff2438]" />
                {step}
              </div>
              {i < TRACKING_STEPS.length - 1 && (
                <span className="text-slate-400 dark:text-slate-500">→</span>
              )}
            </div>
          ))}
        </div>
      </SectionReveal>
    </SectionShell>
  );
}

/* ================================================================
   SUPPORT
   ================================================================ */
export function SupportSection({ id }) {
  return (
    <SectionShell
      id={id}
      eyebrow="HERE TO HELP"
      title="Support, whenever a shipment needs it."
      blurb="From delivery issues to account questions, the LOGITRACK help center connects you to the right team fast."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <GlassCard number="01" icon="☎" title="Customer Support" description="Talk to a real person about any active shipment." />
        <GlassCard number="02" icon="⚑" title="Delivery Issues" description="Report a delay, damage, or delivery exception." delay={0.08} />
        <GlassCard number="03" icon="✉" title="Contact Us" description="Reach the LOGITRACK team directly for anything else." delay={0.16} />
      </div>

      <SectionReveal variant="fade" delay={0.2} className="mt-14 text-center">
        <Link
          to="/support"
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }}
          className="
            inline-flex items-center gap-2 rounded-lg bg-[#ff2438] px-7 py-3.5
            text-xs font-bold uppercase tracking-wider text-white
            shadow-[0_10px_30px_rgba(255,36,56,0.25)] transition
            hover:-translate-y-1 hover:bg-red-600
          "
        >
          Visit Help Center
          <span>→</span>
        </Link>
      </SectionReveal>
    </SectionShell>
  );
}