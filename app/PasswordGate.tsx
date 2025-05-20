"use client";
import { useState } from "react";

const PASSWORD = "1974"; // Change this to your shared password

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4 w-80 animate-fadeInUp"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Foosball Ladder Login</h2>
        <input
          type="password"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          placeholder="Enter password"
          value={input}
          onChange={e => setInput(e.target.value)}
          aria-label="Password"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-indigo-500 text-white rounded px-4 py-2 font-semibold hover:bg-indigo-600 transition"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
