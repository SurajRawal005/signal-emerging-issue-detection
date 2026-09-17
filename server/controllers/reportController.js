const {
  createReport,
  getAllReports,
  getReportsByUser,
  getReportById,
  updateReport,
  deleteReport,
} = require("../services/reportService");
const {analyzeReports} = require("../services/detectionService");
const {generateSignals} = require("../services/signalService");

const create = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      severity,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description and category are required",
      });
    }

    const report = await createReport({
      title,
      description,
      category,
      location,
      severity,
      reportedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const reports = await getAllReports();

    res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMine = async (req, res) => {
  try {
    const reports = await getReportsByUser(req.user.id);

    res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const report = await getReportById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const existingReport = await getReportById(req.params.id);

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const isOwner = existingReport.reported_by === req.user.id;
    const isAdminOrAnalyst =
      req.user.role === "ADMIN" || req.user.role === "ANALYST";

    if (!isOwner && !isAdminOrAnalyst) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this report",
      });
    }

    const {
      title,
      description,
      category,
      location,
      severity,
      status,
    } = req.body;

    const report = await updateReport(req.params.id, {
      title: title || existingReport.title,
      description: description || existingReport.description,
      category: category || existingReport.category,
      location:
        location !== undefined
          ? location
          : existingReport.location,
      severity: severity || existingReport.severity,
      status: status || existingReport.status,
    });

    res.json({
      success: true,
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const existingReport = await getReportById(req.params.id);

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const isOwner = existingReport.reported_by === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this report",
      });
    }

    await deleteReport(req.params.id);

    res.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const analyze = async (req, res) => {
  try {
    const reports = await getAllReports();

    const analysis = analyzeReports(reports);

    const signals = generateSignals(
      analysis.clusters
    );

    res.json({
      success: true,
      analysis: {
        ...analysis,
        signals,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze reports",
    });
  }
};

module.exports = {
  create,
  getAll,
  getMine,
  getOne,
  update,
  remove,
  analyze
};