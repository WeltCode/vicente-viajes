import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const clouds = [
  { id: 1, top: "12%", size: 90, speed: 18, opacity: 0.85, delay: 0 },
  { id: 2, top: "28%", size: 60, speed: 24, opacity: 0.6, delay: -6 },
  { id: 3, top: "8%", size: 120, speed: 30, opacity: 0.5, delay: -14 },
  { id: 4, top: "42%", size: 75, speed: 20, opacity: 0.7, delay: -9 },
  { id: 5, top: "55%", size: 50, speed: 26, opacity: 0.4, delay: -3 },
];

const destinations = [
  "BARCELONA",
  "TOKIO",
  "NUEVA YORK",
  "BALI",
  "ROMA",
  "DUBAI",
  "MIAMI",
  "PARIS",
];

function Cloud({ top, size, speed, opacity, delay }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        animation: `vv404CloudDrift ${speed}s linear ${delay}s infinite`,
        opacity,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <svg width={size * 2.2} height={size * 0.7} viewBox="0 0 220 70" fill="none">
        <ellipse cx="80" cy="50" rx="80" ry="30" fill="white" />
        <ellipse cx="130" cy="48" rx="60" ry="28" fill="white" />
        <ellipse cx="90" cy="36" rx="45" ry="32" fill="white" />
        <ellipse cx="145" cy="38" rx="38" ry="26" fill="white" />
        <ellipse cx="170" cy="46" rx="40" ry="22" fill="white" />
        <ellipse cx="50" cy="46" rx="36" ry="20" fill="white" />
      </svg>
    </div>
  );
}

function AirplaneTrail() {
  return (
    <div
      style={{
        position: "absolute",
        top: "22%",
        right: "-120px",
        animation: "vv404FlyAcross 12s ease-in-out 1s infinite",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: "160px",
            height: "3px",
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.92))",
            borderRadius: "2px",
            marginRight: "4px",
          }}
        />
        <div
          style={{
            width: "12px",
            height: "3px",
            background: "rgba(255,255,255,0.45)",
            borderRadius: "2px",
            marginRight: "10px",
          }}
        />
        <svg width="58" height="32" viewBox="0 0 58 32" fill="none">
          <path d="M52 16L6 6L10 16L6 26L52 16Z" fill="white" />
          <path d="M30 6L22 1L24 6L30 6Z" fill="white" />
          <path d="M30 26L22 31L24 26L30 26Z" fill="white" />
          <path d="M14 13L8 10L9 13L14 13Z" fill="white" />
          <path d="M14 19L8 22L9 19L14 19Z" fill="white" />
        </svg>
      </div>
    </div>
  );
}

export default function NotFound404() {
  const [destIndex, setDestIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      const timeout = setTimeout(() => {
        setDestIndex((i) => (i + 1) % destinations.length);
        setVisible(true);
      }, 400);
      return () => clearTimeout(timeout);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-20" style={{ fontFamily: "'Poppins', sans-serif", margin: 0, padding: 0 }}>
      <style>{`
        @keyframes vv404CloudDrift {
          from { transform: translateX(110vw); }
          to   { transform: translateX(-60vw); }
        }
        @keyframes vv404FlyAcross {
          0%   { transform: translateX(0) translateY(0); opacity: 0; }
          8%   { opacity: 1; }
          50%  { transform: translateX(-80vw) translateY(-30px); }
          92%  { opacity: 1; }
          100% { transform: translateX(-110vw) translateY(-40px); opacity: 0; }
        }
        @keyframes vv404FloatPlane {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes vv404PulseBadge {
          0%, 100% { box-shadow: 0 0 0 0 rgba(156,197,161,0.45); }
          50%      { box-shadow: 0 0 0 12px rgba(156,197,161,0); }
        }
        @keyframes vv404FadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vv404TickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes vv404Twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.3); }
        }

        .vv404-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #9cc5a1;
          color: #1f2421;
          border: none;
          border-radius: 50px;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.18s, box-shadow 0.18s;
          animation: vv404PulseBadge 2.5s ease-in-out infinite;
          letter-spacing: 0.02em;
        }

        .vv404-btn-primary:hover {
          transform: scale(1.06);
          box-shadow: 0 8px 28px rgba(33,104,105,0.45);
        }

        .vv404-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.12);
          color: white;
          border: 1.5px solid rgba(255,255,255,0.45);
          border-radius: 50px;
          padding: 13px 28px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          backdrop-filter: blur(8px);
          transition: background 0.18s, transform 0.18s;
          letter-spacing: 0.03em;
        }

        .vv404-btn-secondary:hover {
          background: rgba(255,255,255,0.22);
          transform: scale(1.04);
        }

        @media (max-width: 680px) {
          .vv404-main {
            padding: 10px 18px 42px !important;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(175deg, #1f2421 0%, #216869 38%, #49a078 72%, #9cc5a1 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {[...Array(28)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 5 === 0 ? "3px" : "2px",
              height: i % 5 === 0 ? "3px" : "2px",
              background: "white",
              borderRadius: "50%",
              top: `${(i * 37 + 7) % 55}%`,
              left: `${(i * 53 + 11) % 95}%`,
              animation: `vv404Twinkle ${2 + (i % 4)}s ease-in-out ${(i * 0.3) % 2}s infinite`,
            }}
            aria-hidden="true"
          />
        ))}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "38%",
            background:
              "linear-gradient(to top, rgba(31,36,33,0.28) 0%, rgba(31,36,33,0.12) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {clouds.map((c) => (
          <Cloud key={c.id} {...c} />
        ))}

        <AirplaneTrail />

        <main
          className="vv404-main"
          style={{
            position: "relative",
            zIndex: 10,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 24px 60px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              animation: "vv404FloatPlane 4s ease-in-out infinite",
              marginBottom: "28px",
              filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.35))",
            }}
          >
            <svg width="200" height="110" viewBox="0 0 200 110" fill="none" aria-hidden="true">
              <path d="M180 55L20 25L30 55L20 85L180 55Z" fill="white" />
              <path d="M95 25L72 8L76 25H95Z" fill="white" />
              <path d="M95 85L72 102L76 85H95Z" fill="white" />
              <path d="M50 42L32 33L34 42H50Z" fill="#e8eef7" />
              <path d="M50 68L32 77L34 68H50Z" fill="#e8eef7" />
              <rect x="40" y="50" width="12" height="10" rx="3" fill="#49a078" />
              <rect x="57" y="50" width="12" height="10" rx="3" fill="#49a078" />
              <rect x="74" y="50" width="12" height="10" rx="3" fill="#49a078" />
              <circle cx="175" cy="55" r="5" fill="#9cc5a1" />
            </svg>
          </div>

          <div
            style={{
              fontSize: "clamp(90px, 20vw, 148px)",
              fontWeight: 800,
              color: "transparent",
              WebkitTextStroke: "2.5px rgba(255,255,255,0.72)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              marginBottom: "4px",
              animation: "vv404FadeInUp 0.8s 0.1s ease both",
              textShadow: "0 2px 30px rgba(156,197,161,0.22)",
            }}
          >
            404
          </div>

          <p
            style={{
              fontStyle: "italic",
              color: "#9cc5a1",
              fontSize: "clamp(16px, 3.5vw, 22px)",
              margin: "0 0 8px",
              letterSpacing: "0.01em",
              animation: "vv404FadeInUp 0.8s 0.2s ease both",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            Destino no encontrado
          </p>

          <p
            style={{
              color: "rgba(255,255,255,0.78)",
              fontSize: "clamp(14px, 2.5vw, 17px)",
              maxWidth: "460px",
              lineHeight: 1.65,
              margin: "0 0 36px",
              animation: "vv404FadeInUp 0.8s 0.3s ease both",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            Parece que esta ruta despego sin ti. Vuelve al inicio o sigue explorando experiencias y ofertas.
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "50px",
              padding: "10px 22px",
              marginBottom: "40px",
              backdropFilter: "blur(12px)",
              animation: "vv404FadeInUp 0.8s 0.4s ease both",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="rgba(156,197,161,0.95)" strokeWidth="1.5" />
              <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="rgba(156,197,161,0.95)" strokeWidth="1.5" />
            </svg>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Proximo vuelo a
            </span>
            <span
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "0.12em",
                minWidth: "110px",
                textAlign: "left",
                transition: "all 0.3s",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(6px)",
              }}
            >
              {destinations[destIndex]}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              justifyContent: "center",
              animation: "vv404FadeInUp 0.8s 0.5s ease both",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <Link to="/" className="vv404-btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 12L12 3L21 12V20H15V14H9V20H3V12Z" fill="#1f2421" />
              </svg>
              Volver al inicio
            </Link>
            <Link to="/excursiones" className="vv404-btn-secondary">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 16L3 12L5 12L3 8L21 12L21 16Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              Ver excursiones
            </Link>
          </div>
        </main>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            background: "rgba(0,0,0,0.25)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
            padding: "12px 0",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              gap: "0px",
              whiteSpace: "nowrap",
              animation: "vv404TickerScroll 22s linear infinite",
            }}
          >
            {[...destinations, ...destinations].map((d, i) => (
              <span
                key={i}
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  padding: "0 28px",
                }}
              >
                AIR {d}
              </span>
            ))}
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
