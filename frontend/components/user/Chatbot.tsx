"use client";

import Link from "next/link";

export default function Chatbot() {
  return (
    <>
      <style>{`
        @keyframes float-shake {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%       { transform: translateY(-2px) rotate(-1deg); }
          50%       { transform: translateY(2px) rotate(1deg); }
          75%       { transform: translateY(-1px) rotate(-1deg); }
        }
        .chatbot-float { animation: float-shake 3s ease-in-out infinite; }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50 chatbot-float">
        <div className="group relative flex items-center">

          {/* Tooltip */}
          <span className="
            pointer-events-none absolute right-18 top-1/2 -translate-y-1/2
            whitespace-nowrap rounded-full bg-slate-900 px-3 py-1.5
            text-xs font-medium text-white shadow-lg
            opacity-0 transition-opacity duration-200 group-hover:opacity-100
          ">
            AI Human Design
          </span>

          {/* Button */}
          <Link
            href="/ai-chat"
            aria-label="Mở chat AI Human Design"
            className="
              relative flex h-14 w-14 items-center justify-center rounded-full
              bg-linear-to-br from-fuchsia-500 via-indigo-500 to-sky-400
              shadow-[0_0_28px_rgba(139,92,246,0.55)]
              transition-transform duration-200 hover:scale-110 active:scale-95
            "
          >
            {/* Glow pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping bg-fuchsia-400/30" />

            {/* Chat icon */}
            <svg
  xmlns="http://www.w3.org/2000/svg"
  className="relative h-6 w-6 text-white"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={1.8}
>
  <rect x="6" y="8" width="12" height="11" rx="2" />
  <circle cx="9.5" cy="12" r="0.5" fill="currentColor" />
  <circle cx="14.5" cy="12" r="0.5" fill="currentColor" />
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M9 15h6M12 8V5M10 5h4M9 3l3 2 3-2"
  />
</svg>
          </Link>

        </div>
      </div>
    </>
  );
}
