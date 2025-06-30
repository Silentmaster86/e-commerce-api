const db = require('../config/db');

// GET /users – Admin only
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
};

// GET /users/:id – Own profile or admin
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (req.user.userId != id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  try {
    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
};

// PUT /users/:id – Update own profile or admin
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (req.user.userId != id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  try {
    let query = `UPDATE users SET `;
    const values = [];
    let index = 1;

    if (name) {
      query += `name = $${index++}, `;
      values.push(name);
    }

    if (email) {
      query += `email = $${index++}, `;
      values.push(email);
    }

    if (password) {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash(password, 10);
      query += `password_hash = $${index++}, `;
      values.push(hash);
    }

    query = query.replace(/,\s*$/, ''); // Remove trailing comma
    query += ` WHERE id = $${index} RETURNING id, name, email, role`;
    values.push(id);

    const result = await db.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
};

// DELETE /users/:id – Delete own account or admin
const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    if (req.user.userId != id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
  
    try {
      const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id, name, email', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found or already deleted' });
      }
  
      res.json({ message: 'User deleted', user: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete user', details: err.message });
    }
  };

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
