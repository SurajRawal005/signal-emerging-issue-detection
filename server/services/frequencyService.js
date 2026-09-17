const getReportDate = (report) => {
  return new Date(report.created_at);
};

const getFrequency = (reports) => {
  return reports.length;
};

const getRecentReports = (reports, days = 7) => {
  const now = new Date();

  const cutoff = new Date(
    now.getTime() -
      days * 24 * 60 * 60 * 1000
  );

  return reports.filter(
    (report) =>
      getReportDate(report) >= cutoff
  );
};

const getPreviousReports = (
  reports,
  days = 7
) => {
  const now = new Date();

  const recentCutoff = new Date(
    now.getTime() -
      days * 24 * 60 * 60 * 1000
  );

  const previousCutoff = new Date(
    now.getTime() -
      days * 2 * 24 * 60 * 60 * 1000
  );

  return reports.filter((report) => {
    const date = getReportDate(report);

    return (
      date >= previousCutoff &&
      date < recentCutoff
    );
  });
};

const getHistoricalReports = (
  reports,
  historicalDays = 35,
  recentDays = 7
) => {
  const now = new Date();

  const recentCutoff = new Date(
    now.getTime() -
      recentDays * 24 * 60 * 60 * 1000
  );

  const historicalCutoff = new Date(
    now.getTime() -
      historicalDays * 24 * 60 * 60 * 1000
  );

  return reports.filter((report) => {
    const date = getReportDate(report);

    return (
      date >= historicalCutoff &&
      date < recentCutoff
    );
  });
};

const calculateGrowth = (
  recentCount,
  previousCount
) => {
  if (previousCount === 0) {
    return 0;
  }

  return (
    ((recentCount - previousCount) /
      previousCount) *
    100
  );
};

const analyzeFrequency = (reports) => {
  const recentReports =
    getRecentReports(reports);

  const previousReports =
    getPreviousReports(reports);

  return {
    totalCount: getFrequency(reports),
    recentCount: recentReports.length,
    previousCount: previousReports.length,
    growthPercent: Number(
      calculateGrowth(
        recentReports.length,
        previousReports.length
      ).toFixed(2)
    ),
  };
};

module.exports = {
  getFrequency,
  getRecentReports,
  getPreviousReports,
  getHistoricalReports,
  calculateGrowth,
  analyzeFrequency,
};