const {
  analyzeFrequency,
  getHistoricalReports,
} = require("./frequencyService");

const {
  calculateBaseline,
  calculateZScore,
} = require("./baselineService");

const {
  calculateReporterDiversity,
} = require("./diversityService");

const {
  calculateTimeConcentration,
  calculateLocationConcentration,
} = require("./concentrationService");

const {
  calculateSignalScore,
  getSeverity,
} = require("./scoringService");

const normalizeScore = (value, max = 100) => {
  if (max === 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, (value / max) * 100)
  );
};

const getDailyCounts = (reports) => {
  const dailyCounts = {};

  for (const report of reports) {
    const date = new Date(report.created_at);

    const day = date.toISOString().split("T")[0];

    dailyCounts[day] =
      (dailyCounts[day] || 0) + 1;
  }

  return dailyCounts;
};

const buildSignal = (cluster) => {
  const reports = cluster.reports || [];

  const frequency = analyzeFrequency(reports);

 const historicalReports =
  getHistoricalReports(reports);

  const historicalDailyCounts =
    getDailyCounts(historicalReports);

  const historicalCounts =
    Object.values(historicalDailyCounts);

  const currentCount =
    frequency.recentCount;

  const baseline =
    calculateBaseline(historicalCounts);

  const zScore = calculateZScore(
    currentCount,
    baseline.mean,
    baseline.standardDeviation
  );

  const reporterDiversity =
    calculateReporterDiversity(reports);

  const timeConcentration =
    calculateTimeConcentration(reports);

  const locationConcentration =
    calculateLocationConcentration(reports);

  const frequencyScore = normalizeScore(
    frequency.totalCount,
    10
  );

  const growthScore = normalizeScore(
    Math.max(0, frequency.growthPercent),
    100
  );

  const baselineScore = normalizeScore(
    Math.max(0, zScore),
    3
  );

  const reporterDiversityScore =
    reporterDiversity.diversityRatio * 100;

  const timeConcentrationScore =
    timeConcentration * 100;

  const locationConcentrationScore =
    locationConcentration * 100;

  const signalScore =
    calculateSignalScore({
      frequencyScore,
      growthScore,
      baselineScore,
      reporterDiversityScore,
      timeConcentrationScore,
      locationConcentrationScore,
    });

  const severity =
    getSeverity(signalScore);

  return {
    clusterId: cluster.id,
    title: cluster.title,
    signalScore,
    severity,

    metrics: {
      frequency: frequency.totalCount,
      recentReports: frequency.recentCount,
      previousReports: frequency.previousCount,
      growthPercent: frequency.growthPercent,

      baselineMean: baseline.mean,
      baselineStandardDeviation:
        baseline.standardDeviation,

      zScore: Number(
        zScore.toFixed(2)
      ),

      uniqueReporters:
        reporterDiversity.uniqueReporters,

      reporterDiversity:
        reporterDiversity.diversityRatio,

      timeConcentration,
      locationConcentration,
    },

    evidence: {
      categories: cluster.categories,
      locations: cluster.locations,
      relatedReports: reports,
    },

    explanation: {
      frequency:
        `${frequency.totalCount} related report(s) detected.`,

      growth:
        `${frequency.growthPercent}% change compared with the previous period.`,

      reporters:
        `${reporterDiversity.uniqueReporters} unique reporter(s) contributed to this issue.`,

      location:
        `${Math.round(
          locationConcentration * 100
        )}% of reports are concentrated in the same location.`,

      time:
        `${Math.round(
          timeConcentration * 100
        )}% of reports occurred within the same hour.`,
    },
  };
};

const generateSignals = (clusters) => {
  return clusters.map(buildSignal);
};

module.exports = {
  normalizeScore,
  getDailyCounts,
  buildSignal,
  generateSignals,
};