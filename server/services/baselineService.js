const calculateMean = (values) => {
  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce((sum, value) => sum + value, 0) /
    values.length
  );
};

const calculateStandardDeviation = (values) => {
  if (values.length === 0) {
    return 0;
  }

  const mean = calculateMean(values);

  const variance =
    values.reduce(
      (sum, value) =>
        sum + Math.pow(value - mean, 2),
      0
    ) / values.length;

  return Math.sqrt(variance);
};

const calculateZScore = (
  currentValue,
  mean,
  standardDeviation
) => {
  if (standardDeviation === 0) {
    if (mean === 0) {
      return currentValue > 0 ? 3 : 0;
    }

    if (currentValue <= mean) {
      return 0;
    }

    return Math.min(
      3,
      currentValue / mean
    );
  }

  return (
    (currentValue - mean) /
    standardDeviation
  );
};
const calculateBaseline = (historicalCounts) => {
  const mean = calculateMean(historicalCounts);

  const standardDeviation =
    calculateStandardDeviation(
      historicalCounts
    );

  return {
    mean: Number(mean.toFixed(2)),
    standardDeviation: Number(
      standardDeviation.toFixed(2)
    ),
  };
};

module.exports = {
  calculateMean,
  calculateStandardDeviation,
  calculateZScore,
  calculateBaseline,
};