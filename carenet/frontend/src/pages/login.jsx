import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Wifi, Shield, Activity, Brain, ArrowRight } from "lucide-react";
import axios from "../api/axios";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 2,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
  color: ["#06b6d4", "#3b82f6", "#8b5cf6", "#22c55e"][Math.floor(Math.random() * 4)],
}));

const FEATURES = [
  { icon: Brain, text: "AI-Powered Risk Prediction", color: "text-purple-400" },
  { icon: Activity, text: "Real-time Patient Monitoring", color: "text-cyan-400" },
  { icon: Shield, text: "Secure Aadhaar Integration", color: "text-green-400" },
];

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    // If already logged in, redirect
    if (localStorage.getItem("token")) navigate("/");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      {/* Animated particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px]" />

      {/* Left Panel — Hero */}
      <div
        className={`hidden lg:flex flex-col justify-center flex-1 px-16 xl:px-24 transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
      >
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Heart className="w-6 h-6 text-white" />
              <Wifi className="w-4 h-4 text-white absolute bottom-1.5 right-1.5" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight">CARE-NET</h1>
              <p className="text-slate-400 text-sm">v2.0 Platform</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
            AI-Powered{" "}
            <span className="gradient-text">Continuity of Care</span>{" "}
            Platform
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Identify patients at risk of treatment dropout before it happens.
            Leverage machine learning to protect vulnerable lives through
            proactive healthcare interventions.
          </p>

          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 transition-all duration-500`}
                style={{ animationDelay: `${0.3 + i * 0.15}s` }}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <span className="text-slate-300 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div
          className={`w-full max-w-md transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="glass-card p-8 xl:p-10 glow-cyan">
            {/* Mobile-only logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">CARE-NET</h1>
                <p className="text-slate-400 text-sm">AI Healthcare Platform</p>
              </div>
            </div>

            <div className="mb-8 hidden lg:block">
              <h2 className="text-white text-2xl font-bold mb-2">Welcome back</h2>
              <p className="text-slate-400">Sign in to your CARE-NET dashboard</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm animate-scaleIn flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Username</label>
                <input
                  id="login-username"
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3.5 placeholder-slate-500 transition-all"
                  placeholder="Enter your username"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3.5 placeholder-slate-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-premium w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl py-3.5 transition-all disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 glass-card p-4">
              <p className="text-slate-500 text-xs font-medium mb-3 uppercase tracking-wider">Demo credentials</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Admin</span>
                  <span className="text-sm">
                    <span className="text-cyan-400 font-mono">admin</span>
                    <span className="text-slate-600 mx-1">/</span>
                    <span className="text-cyan-400 font-mono">carenet2026</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Doctor</span>
                  <span className="text-sm">
                    <span className="text-cyan-400 font-mono">doctor</span>
                    <span className="text-slate-600 mx-1">/</span>
                    <span className="text-cyan-400 font-mono">doctor123</span>
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 text-xs text-center mt-6">
              HAL 4.0 Hackathon — Global Academy of Technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}