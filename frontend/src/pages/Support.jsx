import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";
import SupportChatWidget from "../components/chat/SupportChatWidget";

function Support() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#050505] dark:text-white">

      <Navbar />

      <section className="relative px-6 pb-12 pt-8 lg:px-12">

        {/* Background Grid */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.07]
            [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]
            [background-size:60px_60px]
          "
        />

        <div className="relative mx-auto max-w-7xl">

          {/* ================= HEADER ================= */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="
                mb-4
                inline-flex
                border
                border-red-500/20
                bg-red-500/[0.06]
                px-4
                py-2
                text-xs
                font-bold
                tracking-[0.3em]
                text-red-600
                dark:text-red-500
              "
            >
              LOGITRACK SUPPORT
            </div>

            <h1
              className="
                text-5xl
                font-black
                leading-[1.05]
                tracking-tight
                text-slate-900
                dark:text-white
                sm:text-6xl
                lg:text-7xl
              "
            >
              We're here to
              <span className="block text-red-500">
                keep you moving.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Need help with a shipment, tracking, account or logistics
              operations? Our support team is ready to help.
            </p>
          </motion.div>


          {/* ================= CONTENT ================= */}

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">

            {/* CONTACT FORM */}

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-7
                shadow-sm
                dark:border-white/10
                dark:bg-white/[0.02]
                dark:shadow-none
                sm:p-8
              "
            >

              <div className="mb-7">
                <p className="text-[10px] font-bold tracking-[0.25em] text-slate-600 dark:text-slate-400">
                  SEND A REQUEST
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  How can we help?
                </h2>
              </div>


              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="
                      h-12
                      w-full
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      text-sm
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      focus:border-red-500/50
                      dark:border-white/10
                      dark:bg-black/40
                      dark:text-white
                      dark:placeholder:text-slate-500
                    "
                  />
                </div>


                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="
                      h-12
                      w-full
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      text-sm
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      focus:border-red-500/50
                      dark:border-white/10
                      dark:bg-black/40
                      dark:text-white
                      dark:placeholder:text-slate-500
                    "
                  />
                </div>

              </div>


              {/* Subject */}
              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subject
                </label>

                <select
                  className="
                    h-12
                    w-full
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    text-sm
                    text-slate-900
                    outline-none
                    focus:border-red-500/50
                    dark:border-white/10
                    dark:bg-black/40
                    dark:text-white
                  "
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a topic
                  </option>

                  <option value="shipment">
                    Shipment Issue
                  </option>

                  <option value="tracking">
                    Tracking Help
                  </option>

                  <option value="account">
                    Account Support
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>


              {/* Message */}
              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Message
                </label>

                <textarea
                  rows="4"
                  placeholder="Describe your issue..."
                  className="
                    w-full
                    resize-none
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-sm
                    text-slate-900
                    outline-none
                    placeholder:text-slate-400
                    focus:border-red-500/50
                    dark:border-white/10
                    dark:bg-black/40
                    dark:text-white
                    dark:placeholder:text-slate-500
                  "
                />
              </div>


              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="
                  mt-5
                  bg-red-500
                  px-7
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-red-600
                "
              >
                Send Request
              </motion.button>

            </motion.div>


            {/* ================= RIGHT SIDE ================= */}

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="space-y-5"
            >

              {/* Live Support */}

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-7
                  shadow-sm
                  dark:border-white/10
                  dark:bg-white/[0.02]
                  dark:shadow-none
                "
              >

                <div className="flex items-center gap-3">

                  <div className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500/10
                    text-red-600
                    dark:text-red-500
                  ">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Live AI Support
                      </p>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      Powered by Groq • Instant AI assistance
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="
                    mt-6
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-red-500/30
                    bg-red-500/10
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-red-600
                    dark:text-red-400
                    transition
                    hover:bg-red-500
                    hover:text-white
                  "
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Start a Conversation
                </button>

              </div>


              {/* Contact */}

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-7
                  shadow-sm
                  dark:border-white/10
                  dark:bg-white/[0.02]
                  dark:shadow-none
                "
              >

                <p className="text-[10px] font-bold tracking-[0.25em] text-slate-600 dark:text-slate-400">
                  CONTACT
                </p>

                <div className="mt-6 space-y-5">

                  <ContactItem
                    title="Email"
                    value="support@logitrack.com"
                  />

                  <ContactItem
                    title="Phone"
                    value="+91 1800 123 4567"
                  />

                  <ContactItem
                    title="Availability"
                    value="24 / 7 / 365"
                  />

                </div>

              </div>

            </motion.div>

          </div>

        </div>
      </section>

      {/* Floating launcher trigger if chat widget is closed */}
      {!isChatOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="
            fixed
            bottom-6
            right-6
            z-40
            flex
            items-center
            gap-2.5
            rounded-full
            bg-red-500
            px-5
            py-3.5
            font-bold
            text-white
            shadow-xl
            transition
            hover:bg-red-600
          "
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="text-sm">AI Support</span>
        </motion.button>
      )}

      {/* Chat Widget Modal */}
      <SupportChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <Footer />

    </main>
  );
}


/* ================= CONTACT ITEM ================= */

function ContactItem({ title, value }) {
  return (
    <div>
      <p className="text-[9px] font-bold tracking-[0.2em] text-slate-600 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-200">
         {value}
      </p>
    </div>
  );
}

export default Support;