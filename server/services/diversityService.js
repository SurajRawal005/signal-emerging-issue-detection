const calculateReporterDiversity = (reports) => {
  if (reports.length === 0) {
    return {
      uniqueReporters: 0,
      diversityRatio: 0,
    };
  }

  const uniqueReporters = new Set(
    reports.map((report) => report.reported_by)
  ).size;

  const diversityRatio =
    uniqueReporters / reports.length;

  return {
    uniqueReporters,
    diversityRatio: Number(
      diversityRatio.toFixed(2)
    ),
  };
};

module.exports = {
  calculateReporterDiversity,
};