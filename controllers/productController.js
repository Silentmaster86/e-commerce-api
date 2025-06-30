const db = require('../config/db');

// CREATE product
const createProduct = async (req, res) => {
  const { name, description, price, stock, image_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
};

// READ all products
const getAllProducts = async (req, res) => {
  const { category } = req.query;

  try {
    let query = 'SELECT * FROM products';
    let values = [];

    if (category) {
      query += ' WHERE category_id = $1';
      values.push(category);
    }

    query += ' ORDER BY id';

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
};


// READ single product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image_url } = req.body;
  try {
    const result = await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, stock = $4, image_url = $5 
       WHERE id = $6 
       RETURNING *`,
      [name, description, price, stock, image_url, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted', product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
