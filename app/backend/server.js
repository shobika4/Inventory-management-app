const express = require('express');
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'MySQL@2003',
  database: 'excel_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  const connection = await pool.getConnection();
  await connection.query(`
    CREATE TABLE IF NOT EXISTS excel_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      productName VARCHAR(255),
      deliveryDate DATE,
      customerDetails VARCHAR(255)
    )
  `);
  connection.release();
})();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('excelFile');

app.use(cors());
app.use(express.json());

// Upload endpoint
app.post('/upload', upload, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const excelData = excelToJson({
      source: req.file.buffer,
      header: { rows: 1 },
      columnToKey: {
        A: 'productName',
        B: 'deliveryDate',
        C: 'customerDetails',
      },
    });

    const sheetData = excelData.Sheet1;

    for (const row of sheetData) {
      await connection.execute(
        'INSERT INTO excel_table (productName, deliveryDate, customerDetails) VALUES (?, ?, ?)',
        [row.productName, row.deliveryDate, row.customerDetails]
      );
    }

    connection.release();
    res.status(200).json({ message: 'Excel data uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all products endpoint
app.get('/excel-data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM excel_table');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add product endpoint
app.post('/add-product', async (req, res) => {
  try {
    const { productName, deliveryDate, customerDetails } = req.body;
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO excel_table (productName, deliveryDate, customerDetails) VALUES (?, ?, ?)',
      [productName, deliveryDate, customerDetails]
    );
    connection.release();
    res.status(200).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product endpoint
app.delete('/delete-product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM excel_table WHERE id = ?', [id]);
    connection.release();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
