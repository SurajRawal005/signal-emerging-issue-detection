const bcrypt = require("bcrypt");
const pool = require("../config/db");

const registerUser = async (name, email, password, role = "REPORTER") => {
  const [existingUsers] = await pool.execute(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existingUsers.length > 0) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, hashedPassword, role]
  );

  const [users] = await pool.execute(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE id = ?`,
    [result.insertId]
  );

  return users[0];
};

const loginUser = async (email, password) => {
  const [users] = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = users[0];

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
};

module.exports = {
  registerUser,
  loginUser,
};