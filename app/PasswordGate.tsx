"use client";
import { useState } from "react";

export default function PasswordGate({ children, password }: { children: React.ReactNode; password: string }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === password) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-charcoal-500 animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="bg-charcoal-400 rounded-xl shadow-lg p-8 flex flex-col gap-4 w-80 animate-fadeInUp border-2 border-persian_green-500"
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-saffron-500">Foosball Ladder Login</h2>
        <input
          type="password"
          className="border border-persian_green-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-persian_green-500 transition bg-charcoal-100 text-charcoal-700 placeholder:text-charcoal-700"
          placeholder="Enter password"
          value={input}
          onChange={e => setInput(e.target.value)}
          aria-label="Password"
        />
        {error && <div className="text-burnt_sienna-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="btn-primary rounded px-4 py-2 font-semibold transition"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
