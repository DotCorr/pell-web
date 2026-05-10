"use client";

import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const generateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Demo: generate a fake-looking but realistic API key
    const random = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setApiKey(`pk_test_${random}`);
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <header className="border-b-2 border-black">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-mono text-lg font-bold tracking-tight">
            ← PELL
          </Link>
          <div className="text-sm font-mono text-muted">dashboard / dev</div>
        </div>
      </header>

      <section className="border-b-2 border-black">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="font-mono text-xs mb-3">/ ONBOARDING</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Generate your API key.
          </h1>
          <p className="text-lg max-w-2xl mb-10">
            One key. Free for 1,000 calls/month. No credit card required.
          </p>

          {!apiKey ? (
            <form
              onSubmit={generateKey}
              className="border-2 border-black p-8 max-w-xl"
            >
              <label className="block font-mono text-xs mb-2">EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border-2 border-black px-4 py-3 mb-6 font-mono text-sm focus:outline-none focus:bg-black focus:text-white placeholder:text-muted"
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-3 font-mono text-sm border-2 border-black hover:bg-white hover:text-black transition-colors w-full"
              >
                generate key →
              </button>
              <div className="mt-4 text-xs text-muted font-mono">
                we&apos;ll only email you to verify the key. no marketing.
              </div>
            </form>
          ) : (
            <div className="border-2 border-black p-8 max-w-2xl">
              <div className="font-mono text-xs mb-2">YOUR API KEY</div>
              <div className="bg-black text-white p-4 font-mono text-sm break-all mb-4">
                {apiKey}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                }}
                className="border-2 border-black px-4 py-2 font-mono text-xs hover:bg-black hover:text-white transition-colors mr-3"
              >
                copy
              </button>
              <button
                onClick={() => setApiKey(null)}
                className="border-2 border-black px-4 py-2 font-mono text-xs hover:bg-black hover:text-white transition-colors"
              >
                regenerate
              </button>
              <div className="mt-6 text-xs text-muted font-mono">
                ⚠ store this securely. anyone with this key can encrypt under
                your account.
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-b-2 border-black">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="font-mono text-xs mb-3">/ QUICK START</div>
          <h2 className="text-3xl font-bold mb-8">Five lines, three languages.</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {[
              {
                lang: "TypeScript",
                cmd: "npm i pellcrypto",
                code: `import { Pell } from 'pellcrypto'

const pell = new Pell('YOUR_API_KEY')
const ct = await pell.encrypt({
  to: 'bob@acme.com',
  data: 'hello'
})`,
              },
              {
                lang: "Python",
                cmd: "pip install pellcrypto",
                code: `from pellcrypto import Pell

pell = Pell('YOUR_API_KEY')
ct = pell.encrypt(
    to='bob@acme.com',
    data='hello'
)`,
              },
              {
                lang: "Go",
                cmd: "go get github.com/pell/sdk",
                code: `import "github.com/pell/sdk"

p := pell.New("YOUR_API_KEY")
ct, _ := p.Encrypt(pell.Msg{
    To:   "bob@acme.com",
    Data: "hello",
})`,
              },
            ].map((s, i) => (
              <div
                key={s.lang}
                className={`border-2 border-black ${
                  i > 0 ? "lg:border-l-0 border-t-0 lg:border-t-2" : ""
                }`}
              >
                <div className="border-b-2 border-black px-4 py-2 font-mono text-xs flex items-center justify-between bg-black text-white">
                  <span>{s.lang}</span>
                </div>
                <pre className="px-4 py-3 font-mono text-xs bg-white border-b-2 border-black overflow-x-auto">
                  $ {s.cmd}
                </pre>
                <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto">
                  {s.code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="font-mono text-xs mb-3">/ USAGE</div>
          <h2 className="text-3xl font-bold mb-8">Your stats.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              { label: "calls this month", value: "0" },
              { label: "limit", value: "1,000" },
              { label: "keypairs", value: "1" },
              { label: "plan", value: "free" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`border-2 border-black p-6 ${
                  i > 0 ? "border-l-0" : ""
                } ${i >= 2 ? "border-t-0 md:border-t-2" : ""}`}
              >
                <div className="text-3xl font-bold mb-2">{s.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 max-w-5xl mx-auto text-xs font-mono text-muted flex flex-wrap items-center justify-between gap-2">
        <div>this is a research preview · functionality is mocked client-side</div>
        <Link href="/" className="hover:text-black">
          ← back to home
        </Link>
      </footer>
    </main>
  );
}
