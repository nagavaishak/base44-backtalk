import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Mascot from "@/components/Mascot";

export default function SignIn() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // "email" | "code"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputs = useRef([]);

  const continueEmail = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    setStep("code");
    setTimeout(() => inputs.current[0]?.focus(), 40);
  };

  const setDigit = (i, v) => {
    const d = (v || "").replace(/\D/g, "").slice(-1);
    setCode((c) => {
      const next = [...c];
      next[i] = d;
      return next;
    });
    if (d && i < 5) inputs.current[i + 1]?.focus();
  };
  const onKey = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
  };
  const onPaste = (e) => {
    const t = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (!t) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    for (let k = 0; k < t.length; k++) next[k] = t[k];
    setCode(next);
    inputs.current[Math.min(t.length, 5)]?.focus();
  };
  const confirm = () => {
    if (code.join("").length < 6) {
      setError("Enter the 6-digit code");
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
      <div className="flex items-center gap-2 mb-8">
        <Mascot size={26} />
        <span className="font-heading text-[20px] bt-track-tighter bt-ink">Supertake</span>
      </div>

      <div className="w-full max-w-[380px] p-7 rounded-[24px] bt-hairline bg-white">
        {step === "email" ? (
          <>
            <h1 className="font-heading text-[26px] bt-track-tighter bt-ink">Sign in</h1>
            <p className="mt-1.5 text-[13.5px] bt-ink/50">We'll send a one-time code to your email.</p>
            <div className="mt-5">
              <label className="text-[12px] bt-ink/45">Email</label>
              <input
                type="email"
                value={email}
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && continueEmail()}
                placeholder="you@example.com"
                className="mt-1.5 w-full h-12 px-4 rounded-full bg-[#F4F4EF] text-[15px] bt-ink outline-none border border-transparent focus:border-black/20 transition"
              />
              {error && <div className="mt-2 text-[12.5px] bt-neg">{error}</div>}
            </div>
            <button
              onClick={continueEmail}
              className="mt-5 w-full h-12 rounded-full bt-bg-green text-white text-[15px] font-medium hover:brightness-110 transition"
            >
              Continue
            </button>
            <p className="mt-4 text-[11.5px] bt-ink/35 text-center leading-relaxed">
              Practice mode — no real account, no real money.
            </p>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep("email")}
              className="flex items-center gap-1 text-[12.5px] bt-ink/45 hover:bt-ink transition"
            >
              <ArrowLeft size={13} /> back
            </button>
            <h1 className="mt-3 font-heading text-[26px] bt-track-tighter bt-ink">Enter the code</h1>
            <p className="mt-1.5 text-[13.5px] bt-ink/50">
              We sent a 6-digit code to <span className="bt-ink font-medium">{email}</span>.
            </p>
            <div className="mt-5 flex gap-2" onPaste={onPaste}>
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  value={d}
                  inputMode="numeric"
                  maxLength={1}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => onKey(i, e)}
                  className="w-11 h-14 text-center text-[20px] font-semibold rounded-[14px] bg-[#F4F4EF] bt-ink outline-none border border-transparent focus:border-black/20 transition"
                />
              ))}
            </div>
            {error && <div className="mt-3 text-[12.5px] bt-neg">{error}</div>}
            <button
              onClick={confirm}
              className="mt-5 w-full h-12 rounded-full bt-bg-green text-white text-[15px] font-medium hover:brightness-110 transition"
            >
              Sign in
            </button>
            <button
              onClick={() => setStep("email")}
              className="mt-3 text-[12.5px] bt-ink/45 hover:bt-ink transition"
            >
              Use a different email
            </button>
          </>
        )}
      </div>
    </div>
  );
}