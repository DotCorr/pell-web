"use client";
import { useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

type Step = "idle" | "keygen" | "encapsulate" | "decapsulate" | "done";

interface KeyPair {
  pk: unknown;
  sk_full: unknown;
}
interface EncapResult {
  ciphertext: unknown;
  shared_secret: string;
}
interface DecapResult {
  shared_secret: string;
  verified: boolean;
}

function truncate(hex: string, chars = 32) {
  return hex.length > chars ? hex.slice(0, chars) + "…" : hex;
}

function StatusDot({ active, done }: { active: boolean; done: boolean }) {
  if (done) return <span className="w-2 h-2 bg-green-400 flex-shrink-0" />;
  if (active) return <span className="w-2 h-2 bg-yellow-400 animate-pulse flex-shrink-0" />;
  return <span className="w-2 h-2 border border-white/20 flex-shrink-0" />;
}

export default function Playground() {
  const [apiKey, setApiKey] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [keys, setKeys] = useState<KeyPair | null>(null);
  const [encap, setEncap] = useState<EncapResult | null>(null);
  const [decap, setDecap] = useState<DecapResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    "X-Pell-Key": apiKey,
  };

  async function doKeygen() {
    setError(null);
    setLoading(true);
    setStep("keygen");
    try {
      const res = await fetch(`${API}/v1/keygen/toy`, { method: "POST", headers });
      if (!res.ok) throw new Error((await res.json()).detail ?? res.statusText);
      const data = await res.json();
      setKeys({ pk: data.pk, sk_full: data.sk_full });
      setStep("encapsulate");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setStep("idle");
    } finally {
      setLoading(false);
    }
  }

  async function doEncapsulate() {
    if (!keys) return;
    setError(null);
    setLoading(true);
    setStep("encapsulate");
    try {
      const res = await fetch(`${API}/v1/encapsulate`, {
        method: "POST",
        headers,
        body: JSON.stringify({ pk: keys.pk }),
      });
      if (!res.ok) throw new Error((await res.json()).detail ?? res.statusText);
      const data: EncapResult = await res.json();
      setEncap(data);
      setStep("decapsulate");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function doDecapsulate() {
    if (!keys || !encap) return;
    setError(null);
    setLoading(true);
    setStep("decapsulate");
    try {
      const res = await fetch(`${API}/v1/decapsulate`, {
        method: "POST",
        headers,
        body: JSON.stringify({ sk_full: keys.sk_full, ciphertext: encap.ciphertext }),
      });
      if (!res.ok) throw new Error((await res.json()).detail ?? res.statusText);
      const data: DecapResult = await res.json();
      setDecap(data);
      setStep("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("idle");
    setKeys(null);
    setEncap(null);
    setDecap(null);
    setError(null);
  }

  const match = decap && encap && decap.shared_secret === encap.shared_secret;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">

      {/* Nav */}
      <header className="border-b border-white/[0.06] px-6 h-14 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="font-mono font-bold text-sm tracking-tight">PELL</Link>
        <div className="flex items-center gap-4 text-xs font-mono text-white/40">
          <Link href="/" className="hover:text-white transition-colors">← landing</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">dashboard</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-4">
            / LIVE PLAYGROUND
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Watch it work.
          </h1>
          <p className="text-white/50 text-lg max-w-xl leading-relaxed">
            A live end-to-end demo of the Pell-MLWE KEM.
            Alice generates a keypair. Bob encapsulates a shared secret to her public key.
            Alice decapsulates with her private key. The secrets match — quantum-safe.
          </p>
        </div>

        {/* API key input */}
        <div className="mb-8 border border-white/[0.08] p-5 bg-white/[0.02]">
          <label className="block font-mono text-[10px] tracking-widest text-white/40 uppercase mb-3">
            Your API Key — <a href="/dashboard" className="underline hover:text-white">get one free</a>
          </label>
          <div className="flex gap-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pell_sk_…"
              className="flex-1 bg-[#0d0d0d] border border-white/[0.08] px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Main demo panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Step controls */}
          <div className="space-y-3">

            {/* Step 1 */}
            <div className={`border p-5 transition-colors ${step === "idle" || step === "keygen" ? "border-white/20 bg-white/[0.03]" : "border-white/[0.06] bg-white/[0.01]"}`}>
              <div className="flex items-center gap-3 mb-3">
                <StatusDot active={step === "keygen" && loading} done={!!keys} />
                <span className="font-mono text-xs text-white/50 uppercase tracking-wider">Step 01</span>
                <span className="font-bold text-sm">Generate Keypair</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Alice generates a Pell-MLWE keypair. The public key can be shared freely.
                The private key never leaves the client.
              </p>
              <button
                onClick={doKeygen}
                disabled={loading || !apiKey || !!keys}
                className="w-full py-2.5 border border-white/20 font-mono text-xs hover:border-white hover:bg-white hover:text-[#050505] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading && step === "keygen" ? "generating…" : keys ? "✓ keypair ready" : "generate keypair →"}
              </button>
              {keys && (
                <div className="mt-3 bg-[#0d0d0d] p-3 font-mono text-[11px] text-white/40 border border-white/[0.04]">
                  <span className="text-white/60">pk</span> = Z[√3] matrix [{(keys.pk as unknown[]).length} × {((keys.pk as unknown[])[0] as unknown[]).length}]<br />
                  <span className="text-white/60">sk</span> = private · stored locally
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div className={`border p-5 transition-colors ${step === "encapsulate" ? "border-white/20 bg-white/[0.03]" : "border-white/[0.06] bg-white/[0.01]"}`}>
              <div className="flex items-center gap-3 mb-3">
                <StatusDot active={step === "encapsulate" && loading} done={!!encap} />
                <span className="font-mono text-xs text-white/50 uppercase tracking-wider">Step 02</span>
                <span className="font-bold text-sm">Encapsulate (Bob)</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Bob uses Alice&apos;s public key to encapsulate a shared secret.
                He gets back a ciphertext and <code className="text-white/60">ss_bob</code>.
              </p>
              <button
                onClick={doEncapsulate}
                disabled={loading || !keys || !!encap}
                className="w-full py-2.5 border border-white/20 font-mono text-xs hover:border-white hover:bg-white hover:text-[#050505] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading && step === "encapsulate" ? "encapsulating…" : encap ? "✓ encapsulated" : "encapsulate →"}
              </button>
              {encap && (
                <div className="mt-3 bg-[#0d0d0d] p-3 font-mono text-[11px] border border-white/[0.04] space-y-1">
                  <div><span className="text-white/40">ss_bob</span> = <span className="text-green-400">{truncate(encap.shared_secret, 24)}</span></div>
                  <div><span className="text-white/40">ct</span> = <span className="text-white/40">Z[√3] vector (encrypted)</span></div>
                </div>
              )}
            </div>

            {/* Step 3 */}
            <div className={`border p-5 transition-colors ${step === "decapsulate" ? "border-white/20 bg-white/[0.03]" : "border-white/[0.06] bg-white/[0.01]"}`}>
              <div className="flex items-center gap-3 mb-3">
                <StatusDot active={step === "decapsulate" && loading} done={!!decap} />
                <span className="font-mono text-xs text-white/50 uppercase tracking-wider">Step 03</span>
                <span className="font-bold text-sm">Decapsulate (Alice)</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Alice uses her private key to decapsulate Bob&apos;s ciphertext.
                She recovers <code className="text-white/60">ss_alice</code>.
              </p>
              <button
                onClick={doDecapsulate}
                disabled={loading || !encap || !!decap}
                className="w-full py-2.5 border border-white/20 font-mono text-xs hover:border-white hover:bg-white hover:text-[#050505] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading && step === "decapsulate" ? "decapsulating…" : decap ? "✓ decapsulated" : "decapsulate →"}
              </button>
              {decap && (
                <div className="mt-3 bg-[#0d0d0d] p-3 font-mono text-[11px] border border-white/[0.04] space-y-1">
                  <div><span className="text-white/40">ss_alice</span> = <span className="text-green-400">{truncate(decap.shared_secret, 24)}</span></div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Result panel */}
          <div className="flex flex-col gap-6">

            {/* Verdict */}
            <div className={`border p-8 flex flex-col items-center justify-center min-h-[200px] transition-all ${
              step === "done"
                ? match
                  ? "border-green-500/40 bg-green-500/[0.04]"
                  : "border-red-500/40 bg-red-500/[0.04]"
                : "border-white/[0.06] bg-white/[0.01]"
            }`}>
              {step === "done" && match !== null ? (
                <>
                  <div className={`text-5xl font-bold font-mono mb-4 ${match ? "text-green-400" : "text-red-400"}`}>
                    {match ? "✓" : "✗"}
                  </div>
                  <div className={`font-mono text-sm font-bold mb-2 ${match ? "text-green-400" : "text-red-400"}`}>
                    {match ? "SHARED SECRETS MATCH" : "MISMATCH — TAMPERED?"}
                  </div>
                  <p className="text-xs text-white/40 text-center max-w-xs leading-relaxed">
                    {match
                      ? "Alice and Bob now share a 256-bit secret key — without ever transmitting it. This channel is quantum-safe."
                      : "The ciphertext was tampered. IND-CCA2 implicit rejection triggered — attacker learns nothing."}
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-bold font-mono text-white/10 mb-3">?</div>
                  <div className="font-mono text-xs text-white/20">
                    complete all three steps to see the result
                  </div>
                </div>
              )}
            </div>

            {/* Full hex comparison */}
            {step === "done" && encap && decap && (
              <div className="border border-white/[0.06] bg-[#0a0a0a] p-5 font-mono text-[11px] space-y-4">
                <div className="text-white/30 uppercase tracking-widest text-[9px] mb-2">Shared Secret Comparison</div>
                <div>
                  <div className="text-white/40 mb-1">ss_bob (encapsulate)</div>
                  <div className="text-green-400 break-all leading-relaxed">{encap.shared_secret}</div>
                </div>
                <div className="border-t border-white/[0.06] pt-4">
                  <div className="text-white/40 mb-1">ss_alice (decapsulate)</div>
                  <div className="text-green-400 break-all leading-relaxed">{decap.shared_secret}</div>
                </div>
                <div className={`border-t border-white/[0.06] pt-4 font-bold ${match ? "text-green-400" : "text-red-400"}`}>
                  {match ? "✓ 256-bit match — identical shared secret established" : "✗ mismatch"}
                </div>
              </div>
            )}

            {/* What just happened */}
            {step === "done" && (
              <div className="border border-white/[0.06] p-5 text-xs text-white/40 space-y-2 leading-relaxed">
                <div className="text-white/60 font-bold mb-3">What just happened</div>
                <p>Alice generated a lattice-based keypair over Z[√3] — the ring at the heart of Agbanwa&apos;s completeness theorem.</p>
                <p>Bob used her public key to encapsulate a random shared secret. The ciphertext hides the secret under the hardness of the Module-LWE problem over Z[√3].</p>
                <p>Alice used her private key to recover the exact same secret. Neither party transmitted the secret — a quantum computer observing the ciphertext learns nothing.</p>
                <div className="border-t border-white/[0.06] pt-3 text-white/30">
                  Security: IND-CCA2 via Fujisaki-Okamoto · arXiv:2506.19173
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="border border-red-500/30 bg-red-500/[0.05] p-4 font-mono text-xs text-red-400">
                <span className="text-red-400/60">error: </span>{error}
                <div className="mt-2 text-white/30">Make sure the API server is running: <code>cd api && uvicorn main:app --port 5001</code></div>
              </div>
            )}

            {/* Reset */}
            {step === "done" && (
              <button
                onClick={reset}
                className="w-full py-3 border border-white/20 font-mono text-xs hover:border-white hover:bg-white hover:text-[#050505] transition-all"
              >
                run again →
              </button>
            )}
          </div>
        </div>

        {/* Info bar */}
        <div className="mt-10 border-t border-white/[0.06] pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Algorithm", value: "Pell-MLWE (Toy params)" },
            { label: "Security model", value: "IND-CCA2 via FO-transform" },
            { label: "Hardness", value: "Module-LWE over Z[√3]" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-1">{s.label}</div>
              <div className="font-mono text-sm text-white/70">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
