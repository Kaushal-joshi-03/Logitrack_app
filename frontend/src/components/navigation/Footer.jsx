import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#060606] text-slate-400">
      {/* Top Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ================= COLUMN 1: BRAND INFO & CONTACT (4 Cols) ================= */}
          <div className="space-y-6 lg:col-span-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5">
                <img
                  src={logoImg}
                  alt="LogiTrack Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="footer-title text-xl font-black tracking-tight !text-white">
                  LOGI<span className="text-[#ff2438]">TRACK</span>
                </span>
                <span className="ml-2 rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400">
                  ENTERPRISE
                </span>
              </div>
            </div>

            <p className="max-w-sm text-xs leading-6 text-slate-400">
              Next-generation enterprise logistics platform coordinating real-time visibility, intelligent routing, and role-based workflows across India.
            </p>

            {/* Social Media Links */}
            <div className="space-y-2">
              <p className="footer-heading text-[10px] font-bold uppercase tracking-[0.2em] !text-slate-300">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] !text-slate-400 transition hover:border-red-500/50 hover:bg-red-500/10 hover:!text-[#ff2438]"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href="#"
                  aria-label="X (formerly Twitter)"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] !text-slate-400 transition hover:border-red-500/50 hover:bg-red-500/10 hover:!text-[#ff2438]"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] !text-slate-400 transition hover:border-red-500/50 hover:bg-red-500/10 hover:!text-[#ff2438]"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] !text-slate-400 transition hover:border-red-500/50 hover:bg-red-500/10 hover:!text-[#ff2438]"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] !text-slate-400 transition hover:border-red-500/50 hover:bg-red-500/10 hover:!text-[#ff2438]"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Reach Us At */}
            <div className="space-y-2 border-t border-white/10 pt-4 text-xs">
              <p className="footer-heading text-[10px] font-bold uppercase tracking-[0.2em] !text-slate-300">
                Reach Us At
              </p>
              <div className="space-y-1.5 !text-slate-400">
                <p>
                  <strong className="!text-slate-200">Support:</strong>{" "}
                  <a
                    href="mailto:support@logitrack.com"
                    className="transition hover:!text-[#ff2438]"
                  >
                    support@logitrack.com
                  </a>
                </p>
                <p>
                  <strong className="!text-slate-200">Enterprise Sales:</strong>{" "}
                  <a
                    href="mailto:sales@logitrack.com"
                    className="transition hover:!text-[#ff2438]"
                  >
                    sales@logitrack.com
                  </a>
                </p>
                <p className="text-[11px] leading-relaxed">
                  <strong className="!text-slate-200">Corporate HQ:</strong>{" "}
                  Cyber Towers, Level 8, Hitec City, Hyderabad, TS 500081
                </p>
              </div>
            </div>

            {/* Download App Buttons */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <p className="footer-heading text-[10px] font-bold uppercase tracking-[0.2em] !text-slate-300">
                Mobile Applications
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {/* Google Play */}
                <a
                  href="#"
                  className="app-store-btn flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition hover:border-red-500/40 hover:bg-white/10"
                >
                  <svg className="h-5 w-5 text-[#ff2438] fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186A2.247 2.247 0 0 1 3 20.6V3.4c0-.62.228-1.18.609-1.586zm11.602 11.604l2.585-2.585-12.012-6.9a2.298 2.298 0 0 1 .843-.133l8.584 9.618zm0-2.836L6.627 22.2c-.302 0-.589-.047-.843-.133l12.012-6.9-2.585-2.585zm1.414 1.418l4.47-2.568a1.272 1.272 0 0 0 0-2.196l-4.47-2.568-2.099 2.099 2.099 3.233z" />
                  </svg>
                  <div>
                    <div className="app-store-label text-[8px] uppercase tracking-wider">
                      GET IT ON
                    </div>
                    <div className="app-store-name text-xs font-bold">Google Play</div>
                  </div>
                </a>

                {/* App Store */}
                <a
                  href="#"
                  className="app-store-btn flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition hover:border-red-500/40 hover:bg-white/10"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.36-.58.67-.99 1.74-.88 2.76 1.01.08 2.04-.52 2.6-1.27z" />
                  </svg>
                  <div>
                    <div className="app-store-label text-[8px] uppercase tracking-wider">
                      DOWNLOAD ON
                    </div>
                    <div className="app-store-name text-xs font-bold">App Store</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* ================= MIDDLE & RIGHT LINK COLUMNS (8 Cols) ================= */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {/* Column 1: Products & Services */}
            <div>
              <p className="footer-heading mb-4 text-xs font-bold uppercase tracking-[0.2em] !text-white">
                Products & Services
              </p>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    to="/services"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Shipment Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tracking"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Real-Time Tracking
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Warehouse Operations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/solutions"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Fleet Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/solutions"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Last-Mile Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Bulk Shipping Engine
                  </Link>
                </li>
                <li>
                  <Link
                    to="/network"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Intelligent Routing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Features */}
            <div>
              <p className="footer-heading mb-4 text-xs font-bold uppercase tracking-[0.2em] !text-white">
                Features
              </p>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    Cash on Delivery
                  </a>
                </li>
                <li>
                  <Link
                    to="/network"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Serviceable Pin Codes
                  </Link>
                </li>
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    REST API Integration
                  </a>
                </li>
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    Multi-Pickup Locations
                  </a>
                </li>
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    Print Shipping Labels
                  </a>
                </li>
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    SMS & WhatsApp Alerts
                  </a>
                </li>
                <li>
                  <Link
                    to="/solutions"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    All Features →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <p className="footer-heading mb-4 text-xs font-bold uppercase tracking-[0.2em] !text-white">
                Resources
              </p>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    Rate Calculator
                  </a>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Knowledge Base
                  </Link>
                </li>
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    Coupons & Offers
                  </a>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    Logistics Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    Developer Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    System Status
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Company & Support */}
            <div>
              <p className="footer-heading mb-4 text-xs font-bold uppercase tracking-[0.2em] !text-white">
                Company
              </p>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    to="/solutions"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    About LogiTrack
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link
                    to="/solutions"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    Enterprise Clients
                  </Link>
                </li>
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    Careers{" "}
                    <span className="ml-1 rounded bg-red-500/20 px-1 py-0.5 text-[9px] font-bold text-red-400">
                      HIRING
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    Investor Relations
                  </a>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]"
                  >
                    24/7 AI Help Center
                  </Link>
                </li>
                <li>
                  <a href="#" className="!text-slate-400 transition duration-200 hover:!text-[#ff2438]">
                    Security & Trust
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="bottom-bar border-t border-white/10 bg-[#040404] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs !text-slate-400 sm:flex-row lg:px-12">
          {/* Copyright */}
          <div className="!text-slate-400">
            © 2026 <strong className="!text-white">LogiTrack Technologies Inc.</strong> All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 !text-slate-400">
            <a href="#" className="!text-slate-400 transition hover:!text-white">
              Terms & Conditions
            </a>
            <span className="text-slate-600">|</span>
            <a href="#" className="!text-slate-400 transition hover:!text-white">
              Privacy Policy
            </a>
            <span className="text-slate-600">|</span>
            <a href="#" className="!text-slate-400 transition hover:!text-white">
              Compliance
            </a>
            <span className="text-slate-600">|</span>
            <a href="#" className="!text-slate-400 transition hover:!text-white">
              Refund & Cancellation Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
