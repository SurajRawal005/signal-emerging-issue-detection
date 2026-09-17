import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
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
      await register(
        form.name,
        form.email,
        form.password
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left */}
        <div className="relative hidden overflow-hidden border-r border-white/5 bg-[#090e19] lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

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
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

              <span className="text-xs font-medium tracking-widest text-emerald-400">
                START DETECTING
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight">
              Turn reports
              <br />
              into signals.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-500">
              Build a structured incident dataset and let Signal
              uncover relationships, growth patterns, and emerging
              issues.
            </p>

            <div className="mt-10 space-y-3">
              {[
                "Collect structured incident reports",
                "Discover relationships between incidents",
                "Detect emerging patterns automatically",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-[10px] font-semibold text-blue-400">
                    0{index + 1}
                  </span>

                  <span className="text-xs text-slate-500">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-slate-700">
            © 2026 Signal · Emerging Issue Detection Platform
          </p>
        </div>

        {/* Register */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
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
                CREATE WORKSPACE
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Join Signal and start building your incident dataset.
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
                    Full name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

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
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                  />

                  <p className="mt-2 text-[10px] text-slate-700">
                    Your password is securely hashed before storage.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Creating workspace..."
                    : "Create Account"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-400 transition hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;