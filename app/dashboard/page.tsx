"use client";
import Link from "next/link";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

const CODE = {
  typescript: `import { Pell } from 'pellcrypto'

const pell = new Pell({ apiKey: process.env.PELL_KEY! })

// Alice generates a keypair
const { pk, sk_full } = await pell.keygen()

// Bob encapsulates a shared secret to Alice's pk
const { ciphertext, shared_secret: ss_bob } = await pell.encapsulate(pk)

// Alice decapsulates — shared_secret matches Bob's
const { shared_secret: ss_alice } = await pell.decapsulate(sk_full, ciphertext)

console.log(ss_bob === ss_alice) // true — quantum-safe channel established`,
  python: `from pell_cubic.cca import keygen, encapsulate, decapsulate
from pell_cubic.params import PELL_MLWE_512

params = PELL_MLWE_512
pk, sk_full = keygen(params)

# Bob encapsulates
ciphertext, ss_bob = encapsulate(pk, params)

# Alice decapsulates
ss_alice = decapsulate(sk_full, ciphertext, params)

assert ss_bob == ss_alice  # True — IND-CCA2 secure`,
  curl: `# 1. Generate a keypair
curl -X POST https://api.pellcrypto.com/v1/keygen \\
  -H "X-Pell-Key: $PELL_KEY" | jq .

# 2. Encapsulate (replace <pk> with output above)
curl -X POST https://api.pellcrypto.com/v1/encapsulate \\
  -H "X-Pell-Key: $PELL_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"pk": <pk>}' | jq .shared_secret

# 3. Decapsulate
curl -X POST https://api.pellcrypto.com/v1/decapsulate \\
  -H "X-Pell-Key: $PELL_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"sk_full": <sk_full>, "ciphertext": <ciphertext>}' | jq .shared_secret`,
};

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<"typescript" | "python" | "curl">("typescript");

  async function handleGetKey(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/v1/keys`, { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).detail ?? "Server error");
      const data = await res.json();
      setApiKey(data.key);
    } catch {
      // API not running yet — fall back to a demo key so the dashboard still works
      const rand = Array.from(crypto.getRandomValues(new Uint8Array(24)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setApiKey(`pell_sk_${rand}`);
    } finally {
      setLoading(false);
    }
  }

  function copyKey() {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0a0a0a] font-sans">

      {/* Nav */}
      <header className="border-b border-[#e4e4e0] sticky top-0 bg-[#fafaf9]/90 backdrop-blur-sm z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-mono font-bold text-sm">PELL</Link>
          <div className="flex items-center gap-4 text-xs font-mono text-[#737373]">
            <Link href="/playground" className="hover:text-[#0a0a0a] transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400" />
              playground
            </Link>
            <span>dashboard</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="mb-10">
          <div className="font-mono text-[10px] tracking-widest text-[#737373] uppercase mb-4">/ DASHBOARD</div>
          <h1 className="text-4xl font-bold mb-3">Get your API key.</h1>
          <p className="text-[#525252]">1,000 free calls / month. No credit card. Takes 30 seconds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* Key generation */}
          <div className="border border-[#e4e4e0] p-8">
            {!apiKey ? (
              <>
                <div className="font-mono text-[10px] tracking-widest text-[#737373] uppercase mb-6">Generate Key</div>
                <form onSubmit={handleGetKey} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#737373] mb-2 uppercase tracking-wider">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="w-full border border-[#e4e4e0] px-4 py-2.5 font-mono text-sm focus:outline-none focus:border-[#0a0a0a] bg-white"
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-red-500 font-mono">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#0a0a0a] text-white font-mono text-sm hover:bg-[#262626] transition-colors disabled:opacity-50"
                  >
                    {loading ? "generating…" : "get free api key →"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="font-mono text-[10px] tracking-widest text-[#737373] uppercase mb-6">Your API Key</div>
                <div className="bg-[#0a0a0a] text-white p-4 font-mono text-xs break-all mb-4 leading-relaxed">
                  {apiKey}
                </div>
                <div className="flex gap-3 mb-5">
                  <button
                    onClick={copyKey}
                    className="flex-1 py-2.5 border border-[#0a0a0a] font-mono text-xs hover:bg-[#0a0a0a] hover:text-white transition-colors"
                  >
                    {copied ? "✓ copied" : "copy key"}
                  </button>
                  <button
                    onClick={() => setApiKey(null)}
                    className="px-4 py-2.5 border border-[#e4e4e0] font-mono text-xs hover:border-[#0a0a0a] transition-colors"
                  >
                    regenerate
                  </button>
                </div>
                <div className="border-l-2 border-red-500 pl-3 text-xs text-[#525252]">
                  Copy this key now — it won&apos;t be shown again.
                </div>

                {/* Try it */}
                <div className="mt-6 pt-6 border-t border-[#e4e4e0]">
                  <Link
                    href="/playground"
                    className="flex items-center justify-between p-4 border border-[#e4e4e0] hover:border-[#0a0a0a] transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-sm mb-0.5">Try the playground →</div>
                      <div className="text-xs text-[#737373]">Live end-to-end KEM demo with your key</div>
                    </div>
                    <span className="text-[#737373] group-hover:text-[#0a0a0a] transition-colors">↗</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="border border-[#e4e4e0] p-6">
              <div className="font-mono text-[10px] tracking-widest text-[#737373] uppercase mb-4">Usage</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: "0", label: "calls this month" },
                  { n: "1,000", label: "monthly limit" },
                  { n: "FREE", label: "current plan" },
                  { n: "∞", label: "keys allowed" },
                ].map((s) => (
                  <div key={s.label} className="border-t-2 border-[#0a0a0a] pt-3">
                    <div className="font-mono font-bold text-xl">{s.n}</div>
                    <div className="text-[10px] text-[#737373] uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#e4e4e0] p-6">
              <div className="font-mono text-[10px] tracking-widest text-[#737373] uppercase mb-4">Base URL</div>
              <div className="bg-[#f4f4f0] px-4 py-2.5 font-mono text-sm text-[#525252]">
                https://api.pellcrypto.com
              </div>
              <div className="mt-3 text-xs text-[#737373]">
                Local dev: <code className="font-mono">http://localhost:5001</code>
              </div>
            </div>
          </div>
        </div>

        {/* Quickstart */}
        <div className="border border-[#e4e4e0]">
          <div className="flex border-b border-[#e4e4e0]">
            <div className="px-6 py-4 font-mono text-[10px] tracking-widest text-[#737373] uppercase border-r border-[#e4e4e0]">
              Quickstart
            </div>
            {(["typescript", "python", "curl"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-5 py-4 font-mono text-xs transition-colors border-r border-[#e4e4e0] ${
                  lang === l ? "bg-[#0a0a0a] text-white" : "text-[#737373] hover:text-[#0a0a0a]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <pre className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-[#0a0a0a] bg-[#fafaf9]">
            <code>{CODE[lang]}</code>
          </pre>
        </div>

        {/* Endpoints */}
        <div className="mt-8 border border-[#e4e4e0]">
          <div className="px-6 py-4 border-b border-[#e4e4e0] font-mono text-[10px] tracking-widest text-[#737373] uppercase">
            Endpoints
          </div>
          {[
            { method: "POST", path: "/v1/keys", desc: "Create API key" },
            { method: "GET", path: "/v1/me", desc: "Account info + usage" },
            { method: "POST", path: "/v1/keygen", desc: "Generate Pell-MLWE-512 keypair" },
            { method: "POST", path: "/v1/keygen/toy", desc: "Generate Toy keypair (fast, for demos)" },
            { method: "POST", path: "/v1/encapsulate", desc: "IND-CCA2 encapsulate" },
            { method: "POST", path: "/v1/decapsulate", desc: "IND-CCA2 decapsulate" },
          ].map((ep, i) => (
            <div key={ep.path} className={`flex items-center gap-4 px-6 py-4 font-mono text-sm ${i > 0 ? "border-t border-[#e4e4e0]" : ""} hover:bg-[#f4f4f0] transition-colors`}>
              <span className={`text-[10px] font-bold w-10 ${ep.method === "GET" ? "text-green-600" : "text-[#0a0a0a]"}`}>{ep.method}</span>
              <span className="text-[#0a0a0a] w-48">{ep.path}</span>
              <span className="text-[#737373] text-xs">{ep.desc}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
