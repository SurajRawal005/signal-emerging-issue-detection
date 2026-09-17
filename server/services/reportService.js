const pool = require("../config/db");

const createReport = async ({
  title,
  description,
  category,
  location,
  severity,
  reportedBy,
}) => {
  const [result] = await pool.execute(
    `INSERT INTO reports
      (title, description, category, location, severity, reported_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      title,
      description,
      category,
      location || null,
      severity || "LOW",
      reportedBy,
    ]
  );

  const [reports] = await pool.execute(
    `SELECT
      r.id,
      r.title,
      r.description,
      r.category,
      r.location,
      r.severity,
      r.status,
      r.reported_by,
      r.created_at,
      r.updated_at,
      u.name AS reporter_name,
      u.email AS reporter_email
     FROM reports r
     JOIN users u ON r.reported_by = u.id
     WHERE r.id = ?`,
    [result.insertId]
  );

  return reports[0];
};

const getAllReports = async () => {
  const [reports] = await pool.execute(
    `SELECT
      r.id,
      r.title,
      r.description,
      r.category,
      r.location,
      r.severity,
      r.status,
      r.reported_by,
      r.created_at,
      r.updated_at,
      u.name AS reporter_name,
      u.email AS reporter_email
     FROM reports r
     JOIN users u ON r.reported_by = u.id
     ORDER BY r.created_at DESC`
  );

  return reports;
};

const getReportsByUser = async (userId) => {
  const [reports] = await pool.execute(
    `SELECT
      id,
      title,
      description,
      category,
      location,
      severity,
      status,
      reported_by,
      created_at,
      updated_at
     FROM reports
     WHERE reported_by = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  return reports;
};

const getReportById = async (reportId) => {
  const [reports] = await pool.execute(
    `SELECT
      r.id,
      r.title,
      r.description,
      r.category,
      r.location,
      r.severity,
      r.status,
      r.reported_by,
      r.created_at,
      r.updated_at,
      u.name AS reporter_name,
      u.email AS reporter_email
     FROM reports r
     JOIN users u ON r.reported_by = u.id
     WHERE r.id = ?`,
    [reportId]
  );

  return reports[0] || null;
};

const updateReport = async (
  reportId,
  { title, description, category, location, severity, status }
) => {
  const [result] = await pool.execute(
    `UPDATE reports
     SET
       title = ?,
       description = ?,
       category = ?,
       location = ?,
       severity = ?,
       status = ?
     WHERE id = ?`,
    [
      title,
      description,
      category,
      location || null,
      severity,
      status,
      reportId,
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getReportById(reportId);
};

const deleteReport = async (reportId) => {
  const [result] = await pool.execute(
    "DELETE FROM reports WHERE id = ?",
    [reportId]
  );

  return result.affectedRows > 0;
};

module.exports = {
  createReport,
  getAllReports,
  getReportsByUser,
  getReportById,
  updateReport,
  deleteReport,
};