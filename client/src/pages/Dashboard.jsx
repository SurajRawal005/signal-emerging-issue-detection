import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [signals, setSignals] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/reports/analyze");

        const analysis = response.data.analysis;

        setSignals(analysis.signals || []);
        setTotalReports(analysis.totalReports || 0);
      } catch (err) {
        console.error("Dashboard analysis error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load Signal analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, []);

  const highSeverityCount = signals.filter(
    (signal) =>
      signal.severity === "HIGH" ||
      signal.severity === "CRITICAL"
  ).length;

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      case "HIGH":
        return "border-orange-500/20 bg-orange-500/10 text-orange-400";

      case "MEDIUM":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

      default:
        return "border-slate-500/20 bg-slate-500/10 text-slate-400";
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return "text-red-400";
    if (score >= 60) return "text-orange-400";
    if (score >= 40) return "text-yellow-400";

    return "text-slate-400";
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#070b14]/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-600/20">
              S
            </div>

            <div>
              <p className="text-sm font-bold tracking-[0.22em]">
                SIGNAL
              </p>

              <p className="hidden text-[10px] text-slate-500 sm:block">
                EMERGING ISSUE DETECTION
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-200">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500">
                {user?.role || "REPORTER"}
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-4rem)] w-60 border-r border-white/5 bg-[#090e19] lg:block">
          <div className="p-5">
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] text-slate-600">
              WORKSPACE
            </p>

            <nav className="space-y-1">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 rounded-xl bg-blue-600/10 px-3 py-3 text-sm font-medium text-blue-400"
              >
                <span>◈</span>
                Overview
              </Link>

              <Link
                to="/reports"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span>▤</span>
                Reports
              </Link>

              <div className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600">
                <span>⌁</span>
                Signals

                <span className="ml-auto rounded bg-white/5 px-2 py-0.5 text-[9px]">
                  SOON
                </span>
              </div>

              <div className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600">
                <span>◫</span>
                Analytics

                <span className="ml-auto rounded bg-white/5 px-2 py-0.5 text-[9px]">
                  SOON
                </span>
              </div>
            </nav>
          </div>

          <div className="mx-5 mt-5 border-t border-white/5 pt-5">
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] text-slate-600">
              SYSTEM
            </p>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

                <span className="text-xs font-medium text-slate-300">
                  Detection engine
                </span>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-slate-600">
                System operational and ready to analyze incoming reports.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full">
          <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#111a2c] via-[#0d1422] to-[#090e18] p-7 lg:p-9">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />

                    <span className="text-xs font-medium tracking-widest text-blue-400">
                      SIGNAL OVERVIEW
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                    Welcome back,{" "}
                    {user?.name?.split(" ")[0] || "there"}.
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                    Monitor incident reports and identify emerging issues
                    before they become larger problems.
                  </p>
                </div>

                <Link
                  to="/reports/new"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                >
                  + Create Report
                </Link>
              </div>
            </section>

            {/* Metrics */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* Total Reports */}
              <div className="rounded-2xl border border-white/5 bg-[#0c121e] p-5 transition hover:border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    TOTAL REPORTS
                  </p>

                  <span className="rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-blue-400">
                    ▤
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {loading ? "..." : totalReports}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Reports submitted
                </p>
              </div>

              {/* Signals */}
              <div className="rounded-2xl border border-white/5 bg-[#0c121e] p-5 transition hover:border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    EMERGING SIGNALS
                  </p>

                  <span className="rounded-lg bg-violet-500/10 px-2.5 py-1.5 text-violet-400">
                    ⌁
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {loading ? "..." : signals.length}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Detected issue clusters
                </p>
              </div>

              {/* High Severity */}
              <div className="rounded-2xl border border-white/5 bg-[#0c121e] p-5 transition hover:border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    HIGH SEVERITY
                  </p>

                  <span className="rounded-lg bg-red-500/10 px-2.5 py-1.5 text-red-400">
                    !
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {loading ? "..." : highSeverityCount}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  High-priority issues
                </p>
              </div>

              {/* Status */}
              <div className="rounded-2xl border border-white/5 bg-[#0c121e] p-5 transition hover:border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    SYSTEM STATUS
                  </p>

                  <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-emerald-400">
                    ●
                  </span>
                </div>

                <p className="mt-5 text-xl font-bold text-emerald-400">
                  OPERATIONAL
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Detection pipeline ready
                </p>
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Content Grid */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
              {/* Emerging Issues */}
              <div className="rounded-2xl border border-white/5 bg-[#0c121e]">
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
                  <div>
                    <h2 className="font-semibold text-white">
                      Emerging issues
                    </h2>

                    <p className="mt-1 text-xs text-slate-600">
                      Signals detected from report patterns
                    </p>
                  </div>

                  <span className="rounded-lg border border-white/5 px-3 py-1.5 text-xs text-slate-500">
                    Live
                  </span>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="py-12 text-center text-sm text-slate-500">
                      Analyzing reports...
                    </div>
                  ) : signals.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-12 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
                        ⌁
                      </div>

                      <h3 className="mt-4 font-medium text-slate-300">
                        No signals detected yet
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-600">
                        Once enough incident reports are collected, Signal
                        will analyze their similarity and patterns to surface
                        emerging issues here.
                      </p>

                      <Link
                        to="/reports/new"
                        className="mt-5 inline-flex rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                      >
                        Submit a report
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {signals
                        .sort(
                          (a, b) =>
                            b.signalScore - a.signalScore
                        )
                        .map((signal) => (
                          <Link
                            key={signal.clusterId}
                            to={`/signals/${signal.clusterId}`}
                            className="block rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-blue-500/20 hover:bg-white/[0.035]"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-medium text-slate-200">
                                    {signal.title}
                                  </h3>

                                  <span
                                    className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${getSeverityClass(
                                      signal.severity
                                    )}`}
                                  >
                                    {signal.severity}
                                  </span>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                                  <span>
                                    {signal.metrics.frequency} reports
                                  </span>

                                  <span>
                                    {signal.metrics.uniqueReporters} reporter
                                    {signal.metrics.uniqueReporters !== 1
                                      ? "s"
                                      : ""}
                                  </span>

                                  <span>
                                    {signal.metrics.growthPercent >= 0
                                      ? "+"
                                      : ""}
                                    {signal.metrics.growthPercent}% growth
                                  </span>
                                </div>
                              </div>

                              <div className="shrink-0 text-left sm:text-right">
                                <p
                                  className={`text-2xl font-bold ${getScoreClass(
                                    signal.signalScore
                                  )}`}
                                >
                                  {signal.signalScore}
                                </p>

                                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                  Signal score
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                              <div
                                className="h-full rounded-full bg-blue-500 transition-all"
                                style={{
                                  width: `${Math.min(
                                    signal.signalScore,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* How it works */}
              <div className="rounded-2xl border border-white/5 bg-[#0c121e]">
                <div className="border-b border-white/5 px-6 py-5">
                  <h2 className="font-semibold text-white">
                    How Signal works
                  </h2>

                  <p className="mt-1 text-xs text-slate-600">
                    From raw reports to actionable signals
                  </p>
                </div>

                <div className="space-y-1 p-4">
                  {[
                    [
                      "01",
                      "Collect",
                      "Incident reports enter the system.",
                    ],
                    [
                      "02",
                      "Compare",
                      "Text similarity connects related reports.",
                    ],
                    [
                      "03",
                      "Cluster",
                      "Related incidents form issue groups.",
                    ],
                    [
                      "04",
                      "Analyze",
                      "Frequency and growth reveal patterns.",
                    ],
                    [
                      "05",
                      "Score",
                      "Evidence produces a signal severity.",
                    ],
                  ].map(([number, title, description]) => (
                    <div
                      key={number}
                      className="flex gap-4 rounded-xl p-3 transition hover:bg-white/[0.03]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[10px] font-semibold text-slate-500">
                        {number}
                      </span>

                      <div>
                        <p className="text-sm font-medium text-slate-300">
                          {title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bottom CTA */}
            <section className="mt-6 rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] p-6">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-semibold text-blue-400">
                    BUILD THE DATASET
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Start with your first incident report.
                  </h2>

                  <p className="mt-1 text-xs text-slate-600">
                    More structured reports give the detection engine more
                    evidence to identify meaningful patterns.
                  </p>
                </div>

                <Link
                  to="/reports"
                  className="shrink-0 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  View all reports →
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;