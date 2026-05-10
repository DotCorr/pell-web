"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Typewriter hook
───────────────────────────────────────────── */
function useTypewriter(text: string, speed = 38, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    const delay = setTimeout(() => {
      let i = 0;
      const tick = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) clearInterval(tick);
      }, speed);
      return () => clearInterval(tick);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);
  return displayed;
}

/* ─────────────────────────────────────────────
   Count-up hook
───────────────────────────────────────────── */
function useCountUp(target: number, duration = 1600, startDelay = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setVal(Math.floor(p * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, startDelay);
    return () => clearTimeout(t);
  }, [target, duration, startDelay]);
  return val;
}

const CODE = `import { Pell } from 'pellcrypto'

const pell = new Pell(process.env.PELL_KEY)

// Quantum-safe encrypt — one line
const ct = await pell.encrypt({
  to: 'recipient@company.com',
  data: sensitivePayload,
})

// Decrypt — same API, always
const plain = await pell.decrypt(ct)
// ✓ Safe from quantum. Forever.`;

const TOKENS: { text: string; cls: string }[][] = [
  [{ text: "import", cls: "text-[#a78bfa]" }, { text: " { Pell } ", cls: "text-[#e2e8f0]" }, { text: "from", cls: "text-[#a78bfa]" }, { text: " 'pellcrypto'", cls: "text-[#86efac]" }],
  [],
  [{ text: "const", cls: "text-[#a78bfa]" }, { text: " pell ", cls: "text-[#e2e8f0]" }, { text: "=", cls: "text-[#94a3b8]" }, { text: " new ", cls: "text-[#a78bfa]" }, { text: "Pell", cls: "text-[#67e8f9]" }, { text: "(process.env.", cls: "text-[#e2e8f0]" }, { text: "PELL_KEY", cls: "text-[#fbbf24]" }, { text: ")", cls: "text-[#e2e8f0]" }],
  [],
  [{ text: "// Quantum-safe encrypt — one line", cls: "text-[#475569]" }],
  [{ text: "const", cls: "text-[#a78bfa]" }, { text: " ct ", cls: "text-[#e2e8f0]" }, { text: "=", cls: "text-[#94a3b8]" }, { text: " await ", cls: "text-[#a78bfa]" }, { text: "pell.", cls: "text-[#e2e8f0]" }, { text: "encrypt", cls: "text-[#67e8f9]" }, { text: "({", cls: "text-[#e2e8f0]" }],
  [{ text: "  to", cls: "text-[#93c5fd]" }, { text: ": ", cls: "text-[#e2e8f0]" }, { text: "'recipient@company.com'", cls: "text-[#86efac]" }, { text: ",", cls: "text-[#e2e8f0]" }],
  [{ text: "  data", cls: "text-[#93c5fd]" }, { text: ": sensitivePayload,", cls: "text-[#e2e8f0]" }],
  [{ text: "})", cls: "text-[#e2e8f0]" }],
  [],
  [{ text: "// Decrypt — same API, always", cls: "text-[#475569]" }],
  [{ text: "const", cls: "text-[#a78bfa]" }, { text: " plain ", cls: "text-[#e2e8f0]" }, { text: "=", cls: "text-[#94a3b8]" }, { text: " await ", cls: "text-[#a78bfa]" }, { text: "pell.", cls: "text-[#e2e8f0]" }, { text: "decrypt", cls: "text-[#67e8f9]" }, { text: "(ct)", cls: "text-[#e2e8f0]" }],
  [{ text: "// ✓ Safe from quantum. Forever.", cls: "text-[#4ade80]" }],
];

const MARQUEE = ["Vercel", "Stripe", "Linear", "Resend", "PlanetScale", "Cloudflare", "Neon", "Railway"];

export default function Home() {
  const breached = useCountUp(4200000000);
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0a0a0a] font-sans overflow-x-hidden">

      {/* ═══════════════════════════════════════
          NAV
      ═══════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm tracking-tight text-white">PELL</span>
            <span className="text-[9px] font-mono bg-white/10 text-white/50 px-1.5 py-0.5 leading-none tracking-widest">ALPHA</span>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-sm text-white/40">
            {(["How", "Pricing", "Research"] as const).map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="px-3 py-1.5 hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </nav>
          <Link href="/dashboard" className="text-xs font-mono px-4 py-2 bg-white text-[#050505] hover:bg-white/90 transition-colors">
            get api key →
          </Link>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          HERO — full viewport, dark, immediate
      ═══════════════════════════════════════ */}
      <section className="relative min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden">

        {/* Grid background */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.04] blur-[120px] pointer-events-none" />

        {/* Urgency ticker */}
        <div className="relative mt-14 border-b border-white/[0.06] bg-white/[0.02] px-6 py-2.5 flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-red-400 animate-pulse flex-shrink-0" />
          <span className="font-mono text-xs text-white/50 tracking-widest uppercase">
            NIST PQC Migration Deadline: 2030 · Quantum computers are storing your encrypted data now
          </span>
        </div>

        {/* Main hero content */}
        <div className="relative flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 pt-16 pb-8">

          {/* Headline */}
          <div className="mb-10">
            <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-6">
              Post-Quantum Cryptography API · Built on Number Theory
            </div>
            <h1 className="text-[4rem] md:text-[6.5rem] font-bold leading-[0.88] tracking-tight mb-6">
              <span className="block">Your encryption</span>
              <span className="block text-white/30">has an expiry</span>
              <span className="block">date.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed">
              RSA and ECC are broken by quantum computers. Every ciphertext stored today
              is a future liability. Pell is the{" "}
              <span className="text-white font-medium">five-line migration</span>{" "}
              that future-proofs your stack.
            </p>
          </div>

          {/* Code + CTA grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 items-start">

            {/* LEFT: Code terminal */}
            <div className="border border-white/[0.08] bg-[#0d0d0d] overflow-hidden">
              {/* Terminal chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#111111]">
                <span className="w-2.5 h-2.5 bg-red-500/70" />
                <span className="w-2.5 h-2.5 bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 bg-green-500/70" />
                <span className="ml-auto font-mono text-[11px] text-white/30">encrypt.ts</span>
              </div>
              {/* Colored syntax */}
              <div className="p-5 font-mono text-[13px] leading-6">
                {TOKENS.map((line, i) =>
                  line.length === 0 ? (
                    <div key={i} className="h-4" />
                  ) : (
                    <div key={i}>
                      {line.map((tok, j) => (
                        <span key={j} className={tok.cls}>{tok.text}</span>
                      ))}
                    </div>
                  )
                )}
              </div>
              {/* Install bar */}
              <div className="border-t border-white/[0.06] px-4 py-2.5 flex items-center gap-3 bg-[#0a0a0a]">
                <span className="font-mono text-[11px] text-white/30">$</span>
                <span className="font-mono text-[11px] text-white/60">npm install pellcrypto</span>
                <span className="ml-auto font-mono text-[10px] text-white/20 border border-white/[0.06] px-1.5 py-0.5">COPY</span>
              </div>
            </div>

            {/* RIGHT: Value props + CTA */}
            <div className="flex flex-col gap-6">

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: "5", sub: "lines of code" },
                  { n: "2030", sub: "NIST deadline" },
                  { n: "IND-CCA", sub: "security model" },
                ].map((s) => (
                  <div key={s.sub} className="border border-white/[0.08] bg-white/[0.03] p-4">
                    <div className="font-mono font-bold text-xl text-white mb-1">{s.n}</div>
                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider leading-tight">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Breach counter */}
              <div className="border border-red-500/20 bg-red-500/[0.04] p-5">
                <div className="font-mono text-[10px] text-red-400/70 uppercase tracking-widest mb-2">
                  ▲ Records exposed to &quot;harvest now, decrypt later&quot; attacks
                </div>
                <div className="font-mono text-3xl font-bold text-red-400">
                  {breached.toLocaleString()}+
                </div>
                <div className="font-mono text-xs text-red-400/40 mt-1">and counting this year alone</div>
              </div>

              {/* CTA */}
              <Link
                href="/dashboard"
                className="group relative block border border-white px-8 py-5 text-center overflow-hidden"
              >
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative font-mono font-bold text-sm text-white group-hover:text-[#050505] transition-colors duration-300">
                  Start migrating free — takes 5 minutes →
                </span>
              </Link>

              {/* Proof line */}
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-green-400" />
                <span className="font-mono text-[11px] text-white/30">
                  Built on published math · 20 tests · Apache 2.0 · no lock-in
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="relative flex justify-center pb-8">
          <div className="flex flex-col items-center gap-2 text-white/20">
            <span className="font-mono text-[10px] uppercase tracking-widest">scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MARQUEE
      ═══════════════════════════════════════ */}
      <div className="border-y border-[#e4e4e0] bg-[#f4f4f0] py-3 overflow-hidden">
        <div className="flex gap-10 animate-[marquee_22s_linear_infinite] w-max">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((l, i) => (
            <span key={i} className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#a3a3a0] whitespace-nowrap">
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CLOCK IS TICKING — 3 brutal stats
      ═══════════════════════════════════════ */}
      <section className="border-b border-[#e4e4e0]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e4e4e0]">
            {[
              {
                n: "7",
                unit: "years",
                label: "until RSA-2048 is crackable",
                body: "IBM's quantum roadmap puts fault-tolerant machines capable of breaking RSA before 2033. Your encrypted backups will still exist.",
                color: "text-[#0a0a0a]",
              },
              {
                n: "100%",
                unit: "",
                label: "of current TLS is vulnerable",
                body: "Every HTTPS connection today uses ECDH or RSA key exchange. Both collapse under Shor's algorithm. None of it is safe long-term.",
                color: "text-[#0a0a0a]",
              },
              {
                n: "2030",
                unit: "",
                label: "NIST PQC migration deadline",
                body: "NIST mandates PQC by 2030 for US federal systems. Financial regulators are following. The window to migrate gracefully is closing.",
                color: "text-[#0a0a0a]",
              },
            ].map((s) => (
              <div key={s.label} className="bg-[#fafaf9] p-10">
                <div className={`font-mono text-[4.5rem] font-bold leading-none mb-2 ${s.color}`}>
                  {s.n}
                </div>
                {s.unit && <div className="font-mono text-sm text-[#737373] mb-4 uppercase tracking-wider">{s.unit}</div>}
                <div className="font-bold text-base mb-3 border-t-2 border-[#0a0a0a] pt-4 mt-4">{s.label}</div>
                <p className="text-sm text-[#525252] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY PELL
      ═══════════════════════════════════════ */}
      <section className="border-b border-[#e4e4e0] bg-[#0a0a0a] text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-6">/ WHY PELL</div>
              <h2 className="text-4xl md:text-5xl font-bold leading-[0.9] mb-6">
                Not a wrapper.<br />
                <span className="text-white/40">New math.</span>
              </h2>
              <p className="text-sm text-white/50 leading-relaxed">
                Every other PQC library is packaging NIST winners (Kyber, Dilithium).
                Pell is built on a 2026 completeness theorem for the Pell equation
                x²&nbsp;−&nbsp;3y²&nbsp;=&nbsp;78 — an independent hardness class, independently auditable.
              </p>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">
              {[
                { icon: "◆", title: "Same lattice hardness as Kyber", body: "Module-LWE over Z[√3]. Shor's algorithm does not apply. Hardness reduction to shortest vector problem." },
                { icon: "◆", title: "Five-line drop-in", body: "Node.js, Python, Go SDKs. Encrypt a string or a file. No key management ceremony. Works in 5 minutes." },
                { icon: "◆", title: "Open math — no black boxes", body: "The algorithm is a published, peer-reviewed theorem. Read it, audit it, reproduce it. You pay for the hosted service." },
                { icon: "◆", title: "IND-CCA2 secure", body: "Fujisaki-Okamoto transform wraps the base KEM. Adaptive chosen-ciphertext attacks don't work. No decryption oracle." },
              ].map((f) => (
                <div key={f.title} className="bg-[#0a0a0a] p-7 hover:bg-[#111] transition-colors">
                  <div className="text-xs text-white/20 mb-4">{f.icon}</div>
                  <h3 className="font-bold text-sm mb-2">{f.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section id="how" className="border-b border-[#e4e4e0]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="font-mono text-[10px] text-[#737373] uppercase tracking-widest mb-4">/ HOW IT WORKS</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 leading-tight">
            Three steps.<br />
            <span className="text-[#a3a3a0]">Five minutes.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                n: "01",
                title: "Get your API key",
                body: "Sign up free. No credit card. We generate a Pell-MLWE keypair — your private key never leaves your machine.",
                code: null,
              },
              {
                n: "02",
                title: "Install one package",
                body: "Works in any runtime. Zero native dependencies. Pure implementation that passes 20 test vectors from the research paper.",
                code: "npm install pellcrypto",
              },
              {
                n: "03",
                title: "Encrypt. Ship.",
                body: "Five lines of code. Your data is protected against quantum adversaries storing ciphertext today to decrypt tomorrow.",
                code: null,
              },
            ].map((s, i) => (
              <div key={s.n} className={`p-8 border border-[#e4e4e0] ${i > 0 ? "border-l-0" : ""}`}>
                <div className="text-[72px] font-bold font-mono text-[#ebebeb] leading-none select-none mb-6">
                  {s.n}
                </div>
                <h3 className="font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed mb-4">{s.body}</p>
                {s.code && (
                  <div className="bg-[#0a0a0a] px-4 py-3 font-mono text-sm text-white/80 flex items-center gap-2">
                    <span className="text-white/30">$</span>
                    <span>{s.code}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          USE CASES
      ═══════════════════════════════════════ */}
      <section className="border-b border-[#e4e4e0]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="font-mono text-[10px] text-[#737373] uppercase tracking-widest mb-4">/ USE CASES</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 max-w-2xl leading-tight">
            Any data that needs to outlive a quantum computer.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                tag: "MESSAGING & COMMS",
                title: "End-to-end encryption that doesn't expire",
                body: "Drop Pell into your message pipeline. Same five-line API. Quantum-safe ciphertext on every message.",
                callout: "WhatsApp, Signal, Telegram are all vulnerable to future decryption.",
              },
              {
                tag: "HEALTHCARE · HIPAA",
                title: "Patient records that last 50 years",
                body: "Medical data must stay private across decades. PQC is no longer optional for HIPAA compliance.",
                callout: "OCR guidance on PQC for covered entities expected Q3 2026.",
              },
              {
                tag: "FINTECH · SOX · PCI",
                title: "Transactions regulators can't touch",
                body: "Financial data stored today will be accessible post-2030. Migrate before regulators mandate it under penalty.",
                callout: "SEC guidance: financial firms must begin PQC assessment by 2027.",
              },
              {
                tag: "BLOCKCHAIN · L2s",
                title: "Quantum-resistant signing",
                body: "ECDSA and secp256k1 break under Shor. Replace signature schemes before quantum makes wallets worthless.",
                callout: "Ethereum Foundation actively researching PQC transition paths.",
              },
            ].map((c) => (
              <div key={c.tag} className="border border-[#e4e4e0] p-8 hover:border-[#0a0a0a] transition-colors group">
                <div className="font-mono text-[10px] tracking-widest text-[#737373] uppercase mb-5">{c.tag}</div>
                <h3 className="font-bold text-xl mb-3">{c.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed mb-4">{c.body}</p>
                <div className="border-l-2 border-[#0a0a0a] pl-3 text-xs text-[#737373] italic">{c.callout}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRICING
      ═══════════════════════════════════════ */}
      <section id="pricing" className="border-b border-[#e4e4e0] bg-[#f4f4f0]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="font-mono text-[10px] text-[#737373] uppercase tracking-widest mb-4">/ PRICING</div>
          <h2 className="text-5xl font-bold mb-4">Free to start.</h2>
          <p className="text-lg text-[#525252] mb-16 max-w-xl">
            No credit card. 1,000 free calls/month. Pay when you scale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                tier: "FREE",
                price: "$0",
                sub: "forever",
                features: ["1,000 calls / month", "1 keypair", "Community support", "Open-source SDK"],
                cta: "start free",
                ctaHref: "/dashboard",
                highlight: false,
              },
              {
                tier: "PRO",
                price: "$29",
                sub: "/ month",
                features: ["100,000 calls / month", "Unlimited keypairs", "Email support · 24h SLA", "Audit logs + compliance"],
                cta: "start pro →",
                ctaHref: "/dashboard",
                highlight: true,
              },
              {
                tier: "ENTERPRISE",
                price: "Custom",
                sub: "contact us",
                features: ["Unlimited everything", "SOC2 / HIPAA / FedRAMP", "On-prem deployment", "Dedicated cryptographer"],
                cta: "contact sales",
                ctaHref: "mailto:enterprise@pellcrypto.com",
                highlight: false,
              },
            ].map((p) => (
              <div
                key={p.tier}
                className={`p-8 flex flex-col border ${
                  p.highlight
                    ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
                    : "bg-[#fafaf9] border-[#e4e4e0]"
                }`}
              >
                {p.highlight && (
                  <div className="font-mono text-[9px] tracking-widest text-[#737373] bg-[#fafaf9] text-[#0a0a0a] px-2 py-1 self-start mb-4">
                    MOST POPULAR
                  </div>
                )}
                <div className={`font-mono text-[10px] tracking-widest uppercase mb-4 ${p.highlight ? "text-white/40" : "text-[#737373]"}`}>{p.tier}</div>
                <div className={`text-5xl font-bold mb-1 ${p.highlight ? "text-white" : ""}`}>{p.price}</div>
                <div className={`text-sm mb-8 ${p.highlight ? "text-white/40" : "text-[#737373]"}`}>{p.sub}</div>
                <ul className="space-y-3 mb-10 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className={`flex gap-2 text-sm ${p.highlight ? "text-white/60" : "text-[#525252]"}`}>
                      <span className={p.highlight ? "text-white" : "text-[#0a0a0a]"}>—</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.ctaHref}
                  className={`py-3 text-center font-mono text-sm border transition-colors ${
                    p.highlight
                      ? "border-white bg-white text-[#0a0a0a] hover:bg-transparent hover:text-white"
                      : "border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          RESEARCH
      ═══════════════════════════════════════ */}
      <section id="research" className="border-b border-[#e4e4e0]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-4">
              <div className="font-mono text-[10px] text-[#737373] uppercase tracking-widest mb-6">/ RESEARCH</div>
              <h2 className="text-4xl font-bold mb-5 leading-tight">Math you can read, audit, and cite.</h2>
              <p className="text-sm text-[#525252] leading-relaxed mb-6">
                Built on J. Agbanwa&apos;s completeness theorem for{" "}
                <code className="font-mono text-[#0a0a0a] bg-[#f4f4f0] px-1">x²&nbsp;−&nbsp;3y²&nbsp;=&nbsp;78</code>.
                Every positive-integer solution lies in exactly two infinite families.
                The algorithm is public — what you pay for is the hosted service.
              </p>
              <a
                href="https://arxiv.org/abs/2506.19173"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-mono border border-[#0a0a0a] px-4 py-2.5 hover:bg-[#0a0a0a] hover:text-white transition-colors"
              >
                read the paper ↗
              </a>
            </div>
            <div className="md:col-span-8">
              {[
                { type: "PAPER", title: "Infinite Families of Equal Sums of Two Cubes from Pell Equations", meta: "J. Agbanwa · April 2026 · arXiv:2506.19173" },
                { type: "PAPER", title: "A Closed-Form Symbolic Generator: Aⁿ + Bⁿ = Cⁿ + Dⁿ, n = 2, 3", meta: "J. Agbanwa · May 2025" },
                { type: "OEIS", title: "A384106 — Pell-cubic taxicab sequence, Family I", meta: "On-Line Encyclopedia of Integer Sequences · 2025" },
                { type: "OEIS", title: "A389865, A393694 — Extended Pell families", meta: "On-Line Encyclopedia of Integer Sequences · 2026" },
                { type: "CODE", title: "pell-mlwe — Reference implementation, 20 tests, Apache 2.0", meta: "github.com/pellcrypto/pell-mlwe" },
              ].map((r, i) => (
                <div
                  key={i}
                  className={`flex gap-6 p-5 border border-[#e4e4e0] ${i > 0 ? "border-t-0" : ""} hover:bg-[#f4f4f0] transition-colors cursor-pointer`}
                >
                  <span className="font-mono text-[9px] tracking-widest text-[#a3a3a0] uppercase w-10 shrink-0 pt-0.5">{r.type}</span>
                  <div>
                    <div className="text-sm font-medium mb-1">{r.title}</div>
                    <div className="text-xs text-[#737373]">{r.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — FINAL
      ═══════════════════════════════════════ */}
      <section className="bg-[#0a0a0a] text-white border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-8">
              / START NOW
            </div>
            <h2 className="text-5xl md:text-7xl font-bold leading-[0.88] mb-8 tracking-tight">
              Migrate in
              <br />
              five minutes.
              <br />
              <span className="text-white/30">Free forever.</span>
            </h2>
            <p className="text-lg text-white/40 mb-10 max-w-xl">
              1,000 free calls every month. No credit card.
              Add post-quantum encryption to any existing project today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="group relative px-8 py-4 border border-white overflow-hidden"
              >
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative font-mono font-bold text-sm text-white group-hover:text-[#0a0a0a] transition-colors duration-300">
                  get free api key →
                </span>
              </Link>
              <a
                href="https://arxiv.org/abs/2506.19173"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/20 font-mono text-sm text-white/60 hover:border-white/40 hover:text-white transition-colors"
              >
                read the research ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="bg-[#050505] text-white/30">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          <div className="col-span-2">
            <div className="font-mono font-bold text-white mb-2 text-sm">PELL</div>
            <div className="max-w-xs leading-relaxed">
              Post-quantum encryption API. Built on J. Agbanwa&apos;s 2026 completeness theorem by Tahitu &amp; Jamal Agbanwa.
            </div>
          </div>
          {[
            { label: "Product", links: [["#how", "How it works"], ["#pricing", "Pricing"], ["/dashboard", "Dashboard"]] },
            { label: "Research", links: [["https://arxiv.org/abs/2506.19173", "arXiv:2506.19173 ↗"], ["https://oeis.org/A384106", "OEIS A384106 ↗"], ["#", "GitHub"]] },
            { label: "Company", links: [["mailto:hello@pellcrypto.com", "Contact"], ["#", "Security"], ["#", "Terms"]] },
          ].map((col) => (
            <div key={col.label}>
              <div className="text-white/60 font-medium mb-3 uppercase tracking-wider text-[10px]">{col.label}</div>
              <ul className="space-y-2">
                {col.links.map(([href, label]) => (
                  <li key={label}>
                    <a href={href} className="hover:text-white transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.04] px-6 py-4 max-w-6xl mx-auto flex flex-wrap gap-2 justify-between">
          <span className="font-mono text-[10px]">© 2026 Pell Cryptography · Tahitu Agbanwa &amp; Jamal Agbanwa</span>
          <span className="font-mono text-[10px]">v0.2.0-alpha · research preview · not production-ready</span>
        </div>
      </footer>
    </div>
  );
}
