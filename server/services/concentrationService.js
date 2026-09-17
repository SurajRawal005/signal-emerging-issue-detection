const calculateTimeConcentration = (reports) => {
  if (reports.length === 0) {
    return 0;
  }

  const hourCounts = {};

  for (const report of reports) {
    const date = new Date(report.created_at);
    const hour = date.getHours();

    hourCounts[hour] =
      (hourCounts[hour] || 0) + 1;
  }

  const maxReportsInHour = Math.max(
    ...Object.values(hourCounts)
  );

  return Number(
    (maxReportsInHour / reports.length).toFixed(2)
  );
};

const calculateLocationConcentration = (reports) => {
  const reportsWithLocation = reports.filter(
    (report) => report.location
  );

  if (reportsWithLocation.length === 0) {
    return 0;
  }

  const locationCounts = {};

  for (const report of reportsWithLocation) {
    const location = report.location.trim().toLowerCase();

    locationCounts[location] =
      (locationCounts[location] || 0) + 1;
  }

  const maxReportsAtLocation = Math.max(
    ...Object.values(locationCounts)
  );

  return Number(
    (
      maxReportsAtLocation /
      reportsWithLocation.length
    ).toFixed(2)
  );
};

module.exports = {
  calculateTimeConcentration,
  calculateLocationConcentration,
};