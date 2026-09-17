import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateReport = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    severity: "LOW",
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
      await api.post("/reports", form);
      navigate("/reports");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create report."
      );
    } finally {
      setLoading(false);
    }
  };

  const severityOptions = [
    {
      value: "LOW",
      label: "Low",
      description: "Minor issue with limited impact.",
    },
    {
      value: "MEDIUM",
      label: "Medium",
      description: "Noticeable issue affecting normal activity.",
    },
    {
      value: "HIGH",
      label: "High",
      description: "Significant issue requiring attention.",
    },
    {
      value: "CRITICAL",
      label: "Critical",
      description: "Severe issue requiring immediate attention.",
    },
  ];

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

          <Link
            to="/reports"
            className="text-sm text-slate-500 transition hover:text-white"
          >
            ← Back to reports
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        {/* Heading */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400" />

            <span className="text-xs font-medium tracking-widest text-blue-400">
              INCIDENT INTAKE
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Report an incident
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Capture a clear description of an issue. Signal will use
            the report as evidence when analyzing emerging patterns.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/5 bg-[#0c121e] p-6 lg:p-8"
          >
            <div className="mb-7 border-b border-white/5 pb-6">
              <h2 className="font-semibold">
                Incident details
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Provide enough context for meaningful analysis.
              </p>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Incident title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Internet outage in Building A"
                  className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* Description */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-300">
                    Description
                  </label>

                  <span className="text-[10px] text-slate-700">
                    Be specific
                  </span>
                </div>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={7}
                  placeholder="Describe what happened, when it happened, and how it affected people or operations..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#080d17] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                />

                <p className="mt-2 text-[11px] text-slate-700">
                  Related wording across multiple reports helps Signal
                  identify similar incidents.
                </p>
              </div>

              {/* Category / Location */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Network"
                    className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Building A"
                    className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Severity
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {severityOptions.map((option) => {
                    const selected =
                      form.severity === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-xl border p-4 transition ${
                          selected
                            ? "border-blue-500/40 bg-blue-500/[0.06]"
                            : "border-white/5 bg-[#080d17] hover:border-white/10"
                        }`}
                      >
                        <input
                          type="radio"
                          name="severity"
                          value={option.value}
                          checked={selected}
                          onChange={handleChange}
                          className="sr-only"
                        />

                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-semibold ${
                              selected
                                ? "text-blue-400"
                                : "text-slate-300"
                            }`}
                          >
                            {option.label}
                          </span>

                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              option.value === "CRITICAL"
                                ? "bg-red-500"
                                : option.value === "HIGH"
                                ? "bg-orange-400"
                                : option.value === "MEDIUM"
                                ? "bg-yellow-400"
                                : "bg-slate-500"
                            }`}
                          />
                        </div>

                        <p className="mt-2 text-[11px] leading-5 text-slate-600">
                          {option.description}
                        </p>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <div className="border-t border-white/5 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Submitting incident..."
                    : "Submit Incident"}
                </button>

                <p className="mt-3 text-center text-[10px] text-slate-700">
                  Your report will be stored securely and added to
                  Signal's analysis dataset.
                </p>
              </div>
            </div>
          </form>

          {/* Information panel */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                ⌁
              </div>

              <h3 className="mt-5 font-semibold">
                Why your report matters
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-600">
                A single incident may not indicate a problem. Signal
                looks for relationships and changes across multiple
                reports.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0c121e] p-6">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-600">
                ANALYSIS PIPELINE
              </p>

              <div className="mt-5 space-y-4">
                {[
                  ["01", "Text processing"],
                  ["02", "Similarity analysis"],
                  ["03", "Issue clustering"],
                  ["04", "Pattern detection"],
                  ["05", "Signal scoring"],
                ].map(([number, label]) => (
                  <div
                    key={number}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-[9px] text-slate-600">
                      {number}
                    </span>

                    <span className="text-xs text-slate-500">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0c121e] p-6">
              <p className="text-xs font-semibold text-slate-400">
                Reporting tip
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Use concrete terms such as the affected location,
                type of issue, timing, and observable impact. This
                creates stronger evidence for pattern detection.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CreateReport;