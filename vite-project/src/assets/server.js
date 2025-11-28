const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express().json());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kursy'
});
app.post('/users/:id/course', (req, res) => {
    const userId = req.params.id;
    const { courseId } = req.body;
  
    const sql = 'UPDATE USERS SET COURSE_ID = ? WHERE ID = ?';
    db.query(sql, [courseId, userId], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Course assigned successfully', result });
    });
  });