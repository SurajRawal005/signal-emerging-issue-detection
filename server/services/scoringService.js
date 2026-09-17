const calculateSignalScore = ({
  frequencyScore,
  growthScore,
  baselineScore,
  reporterDiversityScore,
  timeConcentrationScore,
  locationConcentrationScore,
}) => {
  const score =
    frequencyScore * 0.20 +
    growthScore * 0.25 +
    baselineScore * 0.20 +
    reporterDiversityScore * 0.15 +
    timeConcentrationScore * 0.10 +
    locationConcentrationScore * 0.10;

  return Number(
    Math.min(100, Math.max(0, score)).toFixed(2)
  );
};

const getSeverity = (score) => {
  if (score >= 80) {
    return "CRITICAL";
  }

  if (score >= 60) {
    return "HIGH";
  }

  if (score >= 40) {
    return "MEDIUM";
  }

  return "LOW";
};

module.exports = {
  calculateSignalScore,
  getSeverity,
};