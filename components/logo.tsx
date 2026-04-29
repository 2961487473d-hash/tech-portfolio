"use client";
import { useEffect, useState } from "react";

export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [phase, setPhase] = useState<"cursor" | "typing" | "done">("cursor");

  const fullText = "DJW";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let timeout: NodeJS.Timeout;

    if (phase === "cursor") {
      timeout = setTimeout(() => {
        setPhase("typing");
      }, 800);
    } else if (phase === "typing") {
      if (typedText.length < fullText.length) {
        timeout = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, 180);
      } else {
        timeout = setTimeout(() => {
          setPhase("done");
        }, 400);
      }
    }

    return () => clearTimeout(timeout);
  }, [mounted, phase, typedText]);

  useEffect(() => {
    if (phase === "done") return;
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <svg
      viewBox="0 0 160 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={{
        overflow: "visible",
        ...props.style,
      }}
    >
      <defs>
        <filter id="glow-d" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feFlood floodColor="#22c55e" floodOpacity="0.5" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="flow-grad" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9">
            <animate attributeName="offset" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="40%" stopColor="#4ade80" stopOpacity="0.6">
            <animate attributeName="offset" values="0.4;1.4;0.4" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="70%" stopColor="#166534" stopOpacity="0.3">
            <animate attributeName="offset" values="0.7;1.7;0.7" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#166534" stopOpacity="0.15">
            <animate attributeName="offset" values="1;2;1" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>

        <style>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.18); opacity: 0.85; }
          }
          @keyframes wave-sine {
            0% { transform: translateY(0px); }
            25% { transform: translateY(-1.5px); }
            50% { transform: translateY(0px); }
            75% { transform: translateY(1.5px); }
            100% { transform: translateY(0px); }
          }
          @keyframes fade-in-scale {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1); }
          }
          .dot-d {
            animation: breathe 3s ease-in-out infinite;
            transform-origin: 105px 18px;
          }
          .line-j {
            filter: drop-shadow(0 0 3px rgba(34,197,94,0.4));
          }
          .wave-w {
            animation: wave-sine 2.6s ease-in-out infinite;
            transform-origin: center;
          }
          .logo-group {
            animation: fade-in-scale 0.5s ease-out forwards;
          }
        `}</style>
      </defs>

      <g className="logo-group">
        {/* D - Data 圆点（右上角） */}
        <g className="dot-d" style={{ opacity: mounted ? 1 : 0 }}>
          <circle cx="105" cy="18" r="11" fill="white" filter="url(#glow-d)" />
          <circle
            cx="105"
            cy="18"
            r="11"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.2"
            strokeOpacity="0.35"
          >
            <animate attributeName="r" values="11;14;11" dur="3s" repeatCount="indefinite" />
            <animate attributeName="strokeOpacity" values="0.35;0.08;0.35" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* J - Junction 折线（绿色，从圆点向下） */}
        <g className="line-j" style={{ opacity: mounted ? 1 : 0 }}>
          <path
            d="M105 29 L105 55 L88 55"
            stroke="url(#flow-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <animate attributeName="stroke-dasharray" values="0,200;80,120;0,200" dur="2s" repeatCount="indefinite" />
          </path>
          <path
            d="M105 29 L105 55 L88 55"
            stroke="#22c55e"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeOpacity="0.25"
          />
        </g>

        {/* W - Wave 波形（白色，更大，位置略高于J） */}
        <g className="wave-w" style={{ opacity: mounted ? 1 : 0 }}>
          <path
            d="M38 52 L48 68 L62 48 L76 68 L86 50"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* 文字：DJW.terminal - 居中并向下靠 */}
        <text
          x="80"
          y="95"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="14"
          letterSpacing="1"
        >
          {phase === "cursor" && (
            <tspan fill="#22c55e">{showCursor ? "_" : " "}</tspan>
          )}
          {phase === "typing" && (
            <>
              <tspan fill="#22c55e">{typedText}</tspan>
              <tspan fill="#22c55e">{showCursor ? "|" : ""}</tspan>
            </>
          )}
          {phase === "done" && (
            <>
              <tspan fill="#22c55e">DJW</tspan>
              <tspan fill="white">.terminal</tspan>
              <tspan fill="#22c55e">
                <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
                _
              </tspan>
            </>
          )}
        </text>
      </g>
    </svg>
  );
};
