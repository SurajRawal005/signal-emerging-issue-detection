import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left branding panel */}
        <div className="relative hidden overflow-hidden border-r border-white/5 bg-[#090e19] lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-600/20">
                S
              </div>

              <div>
                <p className="font-bold tracking-[0.25em]">
                  SIGNAL
                </p>
                <p className="text-[10px] tracking-wide text-slate-600">
                  EMERGING ISSUE DETECTION
                </p>
              </div>
            </div>
          </div>

          <div className="relative max-w-lg">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
              <span className="text-xs font-medium tracking-widest text-blue-400">
                INTELLIGENCE PLATFORM
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight">
              Find the signal
              <br />
              inside the noise.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-500">
              Signal transforms scattered incident reports into
              meaningful issue clusters, patterns, and actionable
              intelligence.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-lg font-bold text-slate-300">
                  TF-IDF
                </p>
                <p className="mt-1 text-[10px] text-slate-600">
                  TEXT ANALYSIS
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-lg font-bold text-slate-300">
                  Graph
                </p>
                <p className="mt-1 text-[10px] text-slate-600">
                  CLUSTERING
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-lg font-bold text-slate-300">
                  Score
                </p>
                <p className="mt-1 text-[10px] text-slate-600">
                  RISK SIGNAL
                </p>
              </div>
            </div>
          </div>

          <p className="relative text-xs text-slate-700">
            © 2026 Signal · Emerging Issue Detection Platform
          </p>
        </div>

        {/* Login */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
                S
              </div>

              <div>
                <p className="font-bold tracking-[0.25em]">
                  SIGNAL
                </p>
                <p className="text-[10px] text-slate-600">
                  EMERGING ISSUE DETECTION
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xs font-medium tracking-widest text-blue-400">
                SECURE ACCESS
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue to your Signal workspace.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/5 bg-[#0c121e] p-6 lg:p-7"
            >
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Email address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-400">
                      Password
                    </label>

                    <span className="text-[10px] text-slate-700">
                      Secure authentication
                    </span>
                  </div>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Authenticating..." : "Sign In"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-400 transition hover:text-blue-300"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;