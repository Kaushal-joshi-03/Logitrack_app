import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const INITIAL_MESSAGE = {
  id: "welcome-1",
  role: "assistant",
  content:
    "Hello! 👋 I'm LogiTrack's AI Support Assistant. How can I help you with shipment tracking, delivery status, warehouse operations, or your account today?",
  timestamp: new Date(),
};

const SUGGESTIONS = [
  "How do I track my shipment?",
  "What are warehouse intake steps?",
  "How do distributor hubs work?",
  "Contact human support",
];

// Rich Markdown / Text Formatter component (ChatGPT style)
function FormattedMessage({ content, isUser }) {
  if (isUser) {
    return <p className="whitespace-pre-wrap font-medium">{content}</p>;
  }

  // Helper to parse bold, inline code, links, and emails
  const formatInline = (text) => {
    // Matches **bold**, `code`, and emails
    const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const segments = text.split(tokenRegex);

    return segments.map((segment, idx) => {
      if (!segment) return null;

      if (segment.startsWith("**") && segment.endsWith("**")) {
        return (
          <strong
            key={idx}
            className="font-bold text-slate-900 dark:text-white"
          >
            {segment.slice(2, -2)}
          </strong>
        );
      }

      if (segment.startsWith("`") && segment.endsWith("`")) {
        return (
          <code
            key={idx}
            className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-red-600 dark:bg-white/10 dark:text-red-400"
          >
            {segment.slice(1, -1)}
          </code>
        );
      }

      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(segment)) {
        return (
          <a
            key={idx}
            href={`mailto:${segment}`}
            className="font-semibold text-red-500 underline decoration-red-500/40 hover:text-red-600 dark:hover:text-red-400"
          >
            {segment}
          </a>
        );
      }

      return <span key={idx}>{segment}</span>;
    });
  };

  // Split into paragraphs / blocks
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200 sm:text-[13px]">
      {blocks.map((block, bIdx) => {
        const lines = block.split("\n").filter((l) => l.trim().length > 0);

        // Check if block is a list (numbered or bulleted)
        const isList = lines.every((l) => /^(\d+\.|\*|-|•)\s/.test(l.trim()));

        if (isList) {
          return (
            <div key={bIdx} className="my-1.5 space-y-1.5 pl-0.5">
              {lines.map((line, lIdx) => {
                const numMatch = line.trim().match(/^(\d+)\.\s+/);
                const cleanText = line.trim().replace(/^(\d+\.|\*|-|•)\s+/, "");

                return (
                  <div key={lIdx} className="flex items-start gap-2">
                    {numMatch ? (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-[10px] font-bold text-red-500 dark:bg-red-500/20">
                        {numMatch[1]}
                      </span>
                    ) : (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    )}
                    <div className="flex-1">{formatInline(cleanText)}</div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Regular paragraph with potential headers (### / ##)
        const isHeading = block.startsWith("###") || block.startsWith("##");
        if (isHeading) {
          const cleanHeading = block.replace(/^#+\s*/, "");
          return (
            <h4
              key={bIdx}
              className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
            >
              {formatInline(cleanHeading)}
            </h4>
          );
        }

        return (
          <p key={bIdx} className="leading-5">
            {formatInline(block)}
          </p>
        );
      })}
    </div>
  );
}

export default function SupportChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setErrorBanner(null);

    // Prepare history payload (last 6 messages)
    const historyPayload = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: text,
        history: historyPayload,
      });

      if (response.data && (response.data.reply || response.data.message)) {
        const replyText = response.data.reply || response.data.message;
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: replyText,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error("No response from assistant");
      }
    } catch (err) {
      console.error("Chat API error:", err);
      const fallback =
        err.response?.data?.fallbackReply ||
        err.response?.data?.message ||
        "I'm currently having trouble connecting to the AI service. Please reach out to our team at support@logitrack.com for immediate assistance.";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: fallback,
          isError: true,
          timestamp: new Date(),
        },
      ]);
      setErrorBanner("Connection issue. Showing fallback response.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date(),
      },
    ]);
    setErrorBanner(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-5 right-5 z-50 flex h-[600px] max-h-[85vh] w-[385px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl transition-colors duration-200 dark:border-white/10 dark:bg-[#0c0c0c] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] sm:w-[430px]"
        >
          {/* ================= HEADER ================= */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-5 py-4 backdrop-blur-md transition-colors duration-200 dark:border-white/10 dark:bg-[#121212]/95">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 ring-1 ring-red-500/25">
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
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#121212]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    LogiTrack AI
                  </h3>
                  <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-500">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant Support Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear conversation"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={onClose}
                title="Close chat"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* ================= ERROR BANNER ================= */}
          {errorBanner && (
            <div className="flex items-center justify-between bg-amber-500/10 px-4 py-2 text-[11px] text-amber-600 dark:text-amber-400">
              <span>{errorBanner}</span>
              <button
                type="button"
                onClick={() => setErrorBanner(null)}
                className="font-bold underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ================= MESSAGES CONTAINER ================= */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-500 ring-1 ring-red-500/20">
                      LT
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${isUser
                        ? "rounded-tr-sm bg-red-500 text-xs font-medium text-white shadow-sm sm:text-[13px]"
                        : msg.isError
                          ? "rounded-tl-sm border border-amber-500/30 bg-amber-500/5"
                          : "rounded-tl-sm border border-slate-200/90 bg-slate-50/90 shadow-sm dark:border-white/10 dark:bg-[#181818] dark:shadow-none"
                      }`}
                  >
                    <FormattedMessage content={msg.content} isUser={isUser} />

                    <span
                      className={`mt-1.5 block text-[9px] ${isUser
                          ? "text-red-100"
                          : "text-slate-400 dark:text-slate-500"
                        }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-white">
                      You
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* AI Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-500 ring-1 ring-red-500/20">
                  LT
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:border-white/10 dark:bg-[#181818] dark:text-slate-400">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-red-500 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-red-500 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-red-500" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    Generating answer...
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ================= SUGGESTIONS ================= */}
          {messages.length <= 2 && !isLoading && (
            <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 dark:border-white/5 dark:bg-[#0f0f0f]/50">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Suggested topics
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(suggestion)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 transition hover:border-red-500/40 hover:text-red-500 dark:border-white/10 dark:bg-[#161616] dark:text-slate-300 dark:hover:border-red-500/40 dark:hover:text-red-400"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= INPUT AREA ================= */}
          <div className="border-t border-slate-200 bg-white p-3 transition-colors duration-200 dark:border-white/10 dark:bg-[#101010]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white dark:border-white/10 dark:bg-[#181818] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-red-500 dark:focus:bg-[#141414]"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm transition hover:bg-red-600 disabled:opacity-40"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-slate-400 dark:text-slate-500">
              <span>LogiTrack AI Assistant</span>
              <span>Press Enter to send</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
