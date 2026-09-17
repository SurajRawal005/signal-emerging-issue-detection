const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "by",
  "for",
  "from",
  "has",
  "have",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "were",
  "with",
  "during",
  "there",
  "their",
  "they",
  "them",
  "then",
  "than",
]);

const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !STOP_WORDS.has(word));
};

const preprocessReports = (reports) => {
  return reports.map((report) => {
    const text = [
      report.title,
      report.description,
      report.category,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      ...report,
      tokens: tokenize(text),
    };
  });
};

const calculateTF = (tokens) => {
  const termFrequency = {};

  for (const token of tokens) {
    termFrequency[token] =
      (termFrequency[token] || 0) + 1;
  }

  const totalTerms = tokens.length;

  if (totalTerms === 0) {
    return {};
  }

  for (const term of Object.keys(termFrequency)) {
    termFrequency[term] =
      termFrequency[term] / totalTerms;
  }

  return termFrequency;
};

const calculateIDF = (documents) => {
  const documentCount = documents.length;
  const documentFrequency = {};

  for (const document of documents) {
    const uniqueTerms = new Set(document);

    for (const term of uniqueTerms) {
      documentFrequency[term] =
        (documentFrequency[term] || 0) + 1;
    }
  }

  const idf = {};

  for (const term of Object.keys(documentFrequency)) {
    idf[term] =
      Math.log(
        documentCount /
          (1 + documentFrequency[term])
      ) + 1;
  }

  return idf;
};

const calculateTFIDF = (tokens, idf) => {
  const tf = calculateTF(tokens);
  const tfidf = {};

  for (const term of Object.keys(tf)) {
    tfidf[term] =
      tf[term] * (idf[term] || 0);
  }

  return tfidf;
};

const cosineSimilarity = (vectorA, vectorB) => {
  const terms = new Set([
    ...Object.keys(vectorA),
    ...Object.keys(vectorB),
  ]);

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const term of terms) {
    const valueA = vectorA[term] || 0;
    const valueB = vectorB[term] || 0;

    dotProduct += valueA * valueB;
    magnitudeA += valueA * valueA;
    magnitudeB += valueB * valueB;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return (
    dotProduct /
    (Math.sqrt(magnitudeA) *
      Math.sqrt(magnitudeB))
  );
};

const buildSimilarityGraph = (
  reports,
  threshold = 0.25
) => {
  const graph = new Map();

  for (const report of reports) {
    graph.set(report.id, []);
  }

  for (let i = 0; i < reports.length; i++) {
    for (let j = i + 1; j < reports.length; j++) {
      const similarity = cosineSimilarity(
        reports[i].tfidf,
        reports[j].tfidf
      );

      if (similarity >= threshold) {
        graph.get(reports[i].id).push({
          id: reports[j].id,
          similarity,
        });

        graph.get(reports[j].id).push({
          id: reports[i].id,
          similarity,
        });
      }
    }
  }

  return graph;
};

const findConnectedComponents = (graph) => {
  const visited = new Set();
  const components = [];

  for (const node of graph.keys()) {
    if (visited.has(node)) {
      continue;
    }

    const component = [];
    const queue = [node];

    visited.add(node);

    while (queue.length > 0) {
      const current = queue.shift();

      component.push(current);

      const neighbors = graph.get(current) || [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          queue.push(neighbor.id);
        }
      }
    }

    components.push(component);
  }

  return components;
};

const generateClusterTitle = (reports) => {
  const wordFrequency = {};

  for (const report of reports) {
    for (const token of report.tokens) {
      wordFrequency[token] =
        (wordFrequency[token] || 0) + 1;
    }
  }

  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word);

  if (sortedWords.length === 0) {
    return "Unknown issue";
  }

  return sortedWords
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

const analyzeReports = (reports) => {
  if (!reports || reports.length === 0) {
    return {
      totalReports: 0,
      totalClusters: 0,
      clusters: [],
    };
  }

  const processedReports =
    preprocessReports(reports);

  const documents = processedReports.map(
    (report) => report.tokens
  );

  const idf = calculateIDF(documents);

  const reportsWithVectors =
    processedReports.map((report) => ({
      ...report,
      tfidf: calculateTFIDF(
        report.tokens,
        idf
      ),
    }));

  const graph = buildSimilarityGraph(
    reportsWithVectors,
    0.25
  );

  const components =
    findConnectedComponents(graph);

  const clusters = components.map(
    (component, index) => {
      const clusterReports =
        component.map((id) =>
          reportsWithVectors.find(
            (report) => report.id === id
          )
        );

      const similarities = [];

      for (const report of clusterReports) {
        const neighbors =
          graph.get(report.id) || [];

        for (const neighbor of neighbors) {
          if (
            component.includes(neighbor.id)
          ) {
            similarities.push(
              neighbor.similarity
            );
          }
        }
      }

      const averageSimilarity =
        similarities.length > 0
          ? similarities.reduce(
              (sum, value) => sum + value,
              0
            ) / similarities.length
          : 1;

      const uniqueReporters = new Set(
        clusterReports.map(
          (report) => report.reported_by
        )
      ).size;

      const categories = [
        ...new Set(
          clusterReports.map(
            (report) => report.category
          )
        ),
      ];

      const locations = [
        ...new Set(
          clusterReports
            .map(
              (report) => report.location
            )
            .filter(Boolean)
        ),
      ];

      return {
        id: index + 1,
        title: generateClusterTitle(
          clusterReports
        ),
        reportCount: clusterReports.length,
        averageSimilarity:
          Number(
            averageSimilarity.toFixed(3)
          ),
        uniqueReporters,
        categories,
        locations,
        reports: clusterReports.map(
          (report) => ({
            id: report.id,
            title: report.title,
            description:
              report.description,
            category:
              report.category,
            location:
              report.location,
            severity:
              report.severity,
            reported_by:
              report.reported_by,
            created_at:
              report.created_at,
          })
        ),
      };
    }
  );

  return {
    totalReports: reports.length,
    totalClusters: clusters.length,
    clusters,
  };
};

module.exports = {
  tokenize,
  preprocessReports,
  calculateTF,
  calculateIDF,
  calculateTFIDF,
  cosineSimilarity,
  buildSimilarityGraph,
  findConnectedComponents,
  analyzeReports,
};