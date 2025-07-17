"use client";
import { useState } from "react";

export default function PasswordGate({ children, password }: { children: React.ReactNode; password: string }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === password) {
      setUnlocked(true);
      setError("");
    } else {
      setAttempts(prev => prev + 1);
      setError(`Incorrect password. Please try again. (Attempt ${attempts + 1})`);
      setInput(""); // Clear input on failed attempt
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-charcoal-500 animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="bg-charcoal-400 rounded-xl shadow-lg p-8 flex flex-col gap-4 w-80 animate-fadeInUp border-2 border-persian_green-500"
        aria-label="Login Form"
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-saffron-500">
          Foosball Ladder Login 🏆
        </h2>
        <p className="text-charcoal-200 text-center text-sm mb-4">
          Please enter the password to access the foosball tracker
        </p>
        <input
          type="password"
          className="border border-persian_green-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-persian_green-500 transition bg-charcoal-100 text-charcoal-700 placeholder:text-charcoal-700"
          placeholder="Enter password"
          value={input}
          onChange={e => setInput(e.target.value)}
          aria-label="Password"
          required
          autoFocus
        />
        {error && (
          <div role="alert" className="text-burnt_sienna-400 text-sm bg-burnt_sienna-900/30 p-2 rounded border border-burnt_sienna-500/50">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="btn-primary rounded px-4 py-2 font-semibold transition hover:bg-persian_green-600 focus:outline-none focus:ring-2 focus:ring-persian_green-400"
          disabled={!input.trim()}
        >
          Unlock 🔓
        </button>
        {attempts > 3 && (
          <p className="text-charcoal-300 text-xs text-center">
            Having trouble? Contact the administrator for assistance.
          </p>
        )}
      </form>
    </div>
  );
}
