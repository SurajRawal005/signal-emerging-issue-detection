const {
  tokenize,
  calculateTF,
  calculateIDF,
  calculateTFIDF,
  cosineSimilarity,
  buildSimilarityGraph,
  findConnectedComponents,
  analyzeReports,
} = require("../services/detectionService");

describe("Detection Service", () => {
  test("tokenize removes stop words and punctuation", () => {
    const result = tokenize(
      "The network is failing in Block A!"
    );

    expect(result).toEqual([
      "network",
      "failing",
      "block",
    ]);
  });

  test("calculateTF calculates term frequency", () => {
    const result = calculateTF([
      "network",
      "network",
      "outage",
    ]);

    expect(result.network).toBeCloseTo(2 / 3);
    expect(result.outage).toBeCloseTo(1 / 3);
  });

  test("calculateIDF gives rarer terms higher importance", () => {
    const documents = [
      ["network", "outage"],
      ["network", "internet"],
      ["parking", "gate"],
    ];

    const result = calculateIDF(documents);

    expect(result.parking).toBeGreaterThan(
      result.network
    );
  });

  test("calculateTFIDF creates a weighted vector", () => {
    const documents = [
      ["network", "outage"],
      ["network", "internet"],
    ];

    const idf = calculateIDF(documents);

    const result = calculateTFIDF(
      ["network", "outage"],
      idf
    );

    expect(result.network).toBeDefined();
    expect(result.outage).toBeDefined();
  });

  test("cosine similarity is 1 for identical vectors", () => {
    const vector = {
      network: 0.5,
      outage: 0.5,
    };

    expect(
      cosineSimilarity(vector, vector)
    ).toBeCloseTo(1);
  });

  test("cosine similarity is 0 for unrelated vectors", () => {
    expect(
      cosineSimilarity(
        { network: 1 },
        { parking: 1 }
      )
    ).toBe(0);
  });

  test("similarity graph connects related reports", () => {
    const reports = [
      {
        id: 1,
        tfidf: { network: 1 },
      },
      {
        id: 2,
        tfidf: { network: 1 },
      },
      {
        id: 3,
        tfidf: { parking: 1 },
      },
    ];

    const graph = buildSimilarityGraph(
      reports,
      0.25
    );

    expect(graph.get(1)).toHaveLength(1);
    expect(graph.get(1)[0].id).toBe(2);
    expect(graph.get(3)).toHaveLength(0);
  });

  test("connected components identify clusters", () => {
    const graph = new Map([
      [1, [{ id: 2, similarity: 0.8 }]],
      [2, [{ id: 1, similarity: 0.8 }]],
      [3, []],
    ]);

    const components =
      findConnectedComponents(graph);

    expect(components).toHaveLength(2);

    expect(
      components.some(
        (component) =>
          component.includes(1) &&
          component.includes(2)
      )
    ).toBe(true);
  });

  test("analyzeReports creates clusters", () => {
    const reports = [
      {
        id: 1,
        title: "Network outage",
        description:
          "Network connection is failing",
        category: "Network",
        location: "Block A",
        severity: "HIGH",
        reported_by: 1,
        created_at:
          "2026-09-16T04:00:00Z",
      },
      {
        id: 2,
        title: "Internet failing",
        description:
          "Network connection keeps dropping",
        category: "Network",
        location: "Block A",
        severity: "MEDIUM",
        reported_by: 2,
        created_at:
          "2026-09-16T04:05:00Z",
      },
      {
        id: 3,
        title: "Parking gate",
        description:
          "Parking gate is not opening",
        category: "Facilities",
        location: "Main Gate",
        severity: "LOW",
        reported_by: 3,
        created_at:
          "2026-09-16T04:10:00Z",
      },
    ];

    const result = analyzeReports(reports);

    expect(result.totalReports).toBe(3);
    expect(result.totalClusters).toBeGreaterThan(0);
    expect(result.clusters.length).toBeGreaterThan(0);
  });
});