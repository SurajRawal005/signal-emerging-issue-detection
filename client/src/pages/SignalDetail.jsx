import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const getSeverityClass = (severity) => {
  if (severity === "CRITICAL") {
    return "border-red-500/20 bg-red-500/10 text-red-400";
  }

  if (severity === "HIGH") {
    return "border-orange-500/20 bg-orange-500/10 text-orange-400";
  }

  if (severity === "MEDIUM") {
    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
  }

  return "border-slate-500/20 bg-slate-500/10 text-slate-400";
};

const MetricCard = ({ label, value, description }) => {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
      <p className="text-xs text-slate-600">{label}</p>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
};

const SignalDetail = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();

  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSignal = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/reports/analyze");
        const signals = response.data.analysis?.signals || [];

        const foundSignal = signals.find(
          (item) => String(item.clusterId) === String(id)
        );

        if (!foundSignal) {
          setError("Signal not found.");
          return;
        }

        setSignal(foundSignal);
      } catch (err) {
        console.error("Signal detail error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load signal details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSignal();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#070b14]/95 backdrop-blur-xl">
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
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
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
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <span>◈</span>
                Overview
              </Link>

              <Link
                to="/reports"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <span>▤</span>
                Reports
              </Link>

              <div className="flex items-center gap-3 rounded-xl bg-blue-600/10 px-3 py-3 text-sm font-medium text-blue-400">
                <span>⌁</span>
                Signals
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
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

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

        {/* Main */}
        <main className="w-full">
          <div className="mx-auto max-w-[1300px] px-6 py-8 lg:px-10">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white"
            >
              ← Back to overview
            </Link>

            {loading && (
              <div className="mt-6 rounded-2xl border border-white/5 bg-[#0c121e] p-12 text-center text-sm text-slate-500">
                Loading signal analysis...
              </div>
            )}

            {error && !loading && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
                {error}
              </div>
            )}

            {signal && !loading && (
              <>
                {/* Signal Header */}
                <section className="relative mt-6 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#111a2c] via-[#0d1422] to-[#090e18] p-7 lg:p-9">
                  <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-blue-400">
                          DETECTED SIGNAL
                        </span>

                        <span
                          className={`rounded-lg border px-3 py-1.5 text-[10px] font-semibold ${getSeverityClass(
                            signal.severity
                          )}`}
                        >
                          {signal.severity}
                        </span>
                      </div>

                      <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                        {signal.title}
                      </h1>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        Signal generated from related incident reports and
                        behavioral patterns detected by the analysis engine.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-black/20 px-8 py-6 text-center">
                      <p className="text-4xl font-bold text-blue-400">
                        {signal.signalScore}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-600">
                        Signal score
                      </p>
                    </div>
                  </div>
                </section>

                {/* Why detected */}
                <section className="mt-6 rounded-2xl border border-white/5 bg-[#0c121e]">
                  <div className="border-b border-white/5 px-6 py-5">
                    <h2 className="font-semibold">
                      Why was this detected?
                    </h2>

                    <p className="mt-1 text-xs text-slate-600">
                      Evidence and metrics contributing to this signal
                    </p>
                  </div>

                  <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                    <MetricCard
                      label="RELATED REPORTS"
                      value={signal.metrics.frequency}
                      description="Reports in this issue cluster"
                    />

                    <MetricCard
                      label="RECENT REPORTS"
                      value={signal.metrics.recentReports}
                      description="Reports in the recent period"
                    />

                    <MetricCard
                      label="UNIQUE REPORTERS"
                      value={signal.metrics.uniqueReporters}
                      description="Distinct people reporting"
                    />

                    <MetricCard
                      label="GROWTH"
                      value={`${signal.metrics.growthPercent > 0 ? "+" : ""}${signal.metrics.growthPercent}%`}
                      description="Compared with previous period"
                    />

                    <MetricCard
                      label="LOCATION CONCENTRATION"
                      value={`${Math.round(signal.metrics.locationConcentration * 100)}%`}
                      description="Reports at dominant location"
                    />

                    <MetricCard
                      label="TIME CONCENTRATION"
                      value={`${Math.round(signal.metrics.timeConcentration * 100)}%`}
                      description="Reports within dominant hour"
                    />
                  </div>
                </section>

                {/* Analysis */}
                <section className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-white/5 bg-[#0c121e]">
                    <div className="border-b border-white/5 px-6 py-5">
                      <h2 className="font-semibold">
                        Analysis summary
                      </h2>
                    </div>

                    <div className="space-y-3 p-6">
                      {Object.entries(signal.explanation).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                          >
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                              {key}
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-[#0c121e]">
                    <div className="border-b border-white/5 px-6 py-5">
                      <h2 className="font-semibold">
                        Signal context
                      </h2>
                    </div>

                    <div className="space-y-5 p-6">
                      <div>
                        <p className="text-xs text-slate-600">
                          CATEGORIES
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {signal.evidence.categories.map((category) => (
                            <span
                              key={category}
                              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400"
                            >
                              {category.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-600">
                          LOCATIONS
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {signal.evidence.locations.length > 0 ? (
                            signal.evidence.locations.map((location) => (
                              <span
                                key={location}
                                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400"
                              >
                                {location}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-600">
                              No location data
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-5">
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-600">
                            BASELINE MEAN
                          </span>

                          <span className="text-sm text-slate-300">
                            {signal.metrics.baselineMean}
                          </span>
                        </div>

                        <div className="mt-3 flex justify-between">
                          <span className="text-xs text-slate-600">
                            BASELINE STD. DEV.
                          </span>

                          <span className="text-sm text-slate-300">
                            {signal.metrics.baselineStandardDeviation}
                          </span>
                        </div>

                        <div className="mt-3 flex justify-between">
                          <span className="text-xs text-slate-600">
                            Z-SCORE
                          </span>

                          <span className="text-sm text-blue-400">
                            {signal.metrics.zScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Related Reports */}
                <section className="mt-6 rounded-2xl border border-white/5 bg-[#0c121e]">
                  <div className="border-b border-white/5 px-6 py-5">
                    <h2 className="font-semibold">
                      Related reports
                    </h2>

                    <p className="mt-1 text-xs text-slate-600">
                      Reports contributing to this detected issue
                    </p>
                  </div>

                  <div className="divide-y divide-white/5">
                    {signal.evidence.relatedReports.map((report) => (
                      <div
                        key={report.id}
                        className="px-6 py-5 hover:bg-white/[0.02]"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-medium text-slate-200">
                                {report.title}
                              </h3>

                              <span
                                className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${getSeverityClass(
                                  report.severity
                                )}`}
                              >
                                {report.severity}
                              </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                              {report.description}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
                              <span>
                                Category: {report.category.trim()}
                              </span>

                              {report.location && (
                                <span>
                                  Location: {report.location}
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="shrink-0 text-xs text-slate-600">
                            {formatDate(report.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignalDetail;