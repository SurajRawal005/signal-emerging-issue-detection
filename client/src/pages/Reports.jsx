import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await api.get("/reports/mine");
        setReports(response.data.reports || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load reports."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "border-red-500/20 bg-red-500/10 text-red-400";
      case "HIGH":
        return "border-orange-500/20 bg-orange-500/10 text-orange-400";
      case "MEDIUM":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
      default:
        return "border-slate-700 bg-slate-800/60 text-slate-400";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#070b14]/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-600/20"
            >
              S
            </button>

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
              onClick={() => {
                localStorage.removeItem("signal_token");
                window.location.href = "/login";
              }}
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
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span>◈</span>
                Overview
              </Link>

              <Link
                to="/reports"
                className="flex items-center gap-3 rounded-xl bg-blue-600/10 px-3 py-3 text-sm font-medium text-blue-400"
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
        </aside>

        {/* Main */}
        <main className="w-full">
          <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
            {/* Page heading */}
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />

                  <span className="text-xs font-medium tracking-widest text-blue-400">
                    INCIDENT DATA
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                  Reports
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Review the incidents submitted to Signal. These reports
                  become the raw evidence used by the detection engine.
                </p>
              </div>

              <Link
                to="/reports/new"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                + New Report
              </Link>
            </div>

            {/* Summary cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-[#0c121e] p-5">
                <p className="text-xs font-medium text-slate-500">
                  TOTAL REPORTS
                </p>

                <p className="mt-3 text-2xl font-bold">
                  {loading ? "—" : reports.length}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Submitted by your account
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#0c121e] p-5">
                <p className="text-xs font-medium text-slate-500">
                  OPEN INCIDENTS
                </p>

                <p className="mt-3 text-2xl font-bold">
                  {loading
                    ? "—"
                    : reports.filter(
                        (report) => report.status === "OPEN"
                      ).length}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Currently unresolved
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#0c121e] p-5">
                <p className="text-xs font-medium text-slate-500">
                  HIGH PRIORITY
                </p>

                <p className="mt-3 text-2xl font-bold">
                  {loading
                    ? "—"
                    : reports.filter(
                        (report) =>
                          report.severity === "HIGH" ||
                          report.severity === "CRITICAL"
                      ).length}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  High or critical severity
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="rounded-2xl border border-white/5 bg-[#0c121e] p-16 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading incident data...
                </p>
              </div>
            ) : reports.length === 0 ? (
              /* Empty state */
              <div className="rounded-2xl border border-dashed border-white/10 bg-[#0c121e] p-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl text-blue-400">
                  ▤
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                  No incident reports yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Create your first report. Signal will use the collected
                  incidents to identify relationships and emerging patterns.
                </p>

                <Link
                  to="/reports/new"
                  className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
                >
                  Create First Report
                </Link>
              </div>
            ) : (
              /* Reports */
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0c121e]">
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
                  <div>
                    <h2 className="font-semibold">
                      Your incident reports
                    </h2>

                    <p className="mt-1 text-xs text-slate-600">
                      {reports.length} report
                      {reports.length !== 1 ? "s" : ""} in your dataset
                    </p>
                  </div>

                  <span className="rounded-lg border border-white/5 px-3 py-1.5 text-xs text-slate-500">
                    Recent first
                  </span>
                </div>

                <div className="divide-y divide-white/5">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="group p-6 transition hover:bg-white/[0.025]"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-semibold text-slate-200">
                              {report.title}
                            </h3>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${getSeverityStyle(
                                report.severity
                              )}`}
                            >
                              {report.severity}
                            </span>
                          </div>

                          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                            {report.description}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
                            <span>
                              Category:{" "}
                              <span className="text-slate-400">
                                {report.category}
                              </span>
                            </span>

                            <span>
                              Location:{" "}
                              <span className="text-slate-400">
                                {report.location || "Not specified"}
                              </span>
                            </span>

                            <span>
                              Reported:{" "}
                              <span className="text-slate-400">
                                {formatDate(report.created_at)}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3 lg:flex-col lg:items-end">
                          <span className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-slate-500">
                            {report.status}
                          </span>

                          <span className="text-xs text-slate-700">
                            #{report.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer note */}
            <div className="mt-5 flex items-center gap-2 px-1 text-[11px] text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
              Reports are securely stored in the Signal database.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;