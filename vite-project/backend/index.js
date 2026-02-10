import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const db = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'KursyDev',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());
app.use(express.json());

function signToken(user) {
  return jwt.sign({ id: user.ID, name: user.Name, surname: user.Surname }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES
  });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Brak tokena' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Nieprawidlowy token' });
  }
}

async function getCategories() {
  const [rows] = await db.query(
    `SELECT c.ID as CategoryID, c.Name as CategoryName, s.ID as SubcategoryID, s.Name as SubcategoryName
     FROM Categories c
     LEFT JOIN CategoriesSubcategories cs ON c.ID = cs.CategoryID
     LEFT JOIN Subcategories s ON s.ID = cs.SubcategoryID
     ORDER BY c.ID, s.ID`
  );

  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.CategoryID)) {
      map.set(r.CategoryID, { id: r.CategoryID, name: r.CategoryName, subcategories: [] });
    }
    if (r.SubcategoryID) {
      map.get(r.CategoryID).subcategories.push({ id: r.SubcategoryID, name: r.SubcategoryName });
    }
  }
  return Array.from(map.values());
}

async function getCourses() {
  const [rows] = await db.query(
    `SELECT c.ID, c.Title, c.Description, c.Image, c.Price,
            cat.Name as CategoryName, sub.Name as SubcategoryName
     FROM Courses c
     LEFT JOIN CoursesSubcategories cs ON c.ID = cs.CourseID
     LEFT JOIN Categories cat ON cs.CategoryID = cat.ID
     LEFT JOIN Subcategories sub ON cs.SubcategoryID = sub.ID
     ORDER BY c.ID`
  );

  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.ID)) {
      map.set(r.ID, {
        id: r.ID,
        title: r.Title,
        description: r.Description,
        image: r.Image,
        price: Number(r.Price),
        category: r.CategoryName || null,
        subcategories: []
      });
    }
    if (r.SubcategoryName) {
      map.get(r.ID).subcategories.push(r.SubcategoryName);
    }
  }
  return Array.from(map.values());
}

async function getBasket(userId) {
  const [rows] = await db.query(
    `SELECT c.ID, c.Title, c.Description, c.Image, c.Price,
            cat.Name as CategoryName, sub.Name as SubcategoryName
     FROM Basket b
     JOIN Courses c ON b.CourseID = c.ID
     LEFT JOIN CoursesSubcategories cs ON c.ID = cs.CourseID
     LEFT JOIN Categories cat ON cs.CategoryID = cat.ID
     LEFT JOIN Subcategories sub ON cs.SubcategoryID = sub.ID
     WHERE b.UserID = ?
     ORDER BY c.ID`,
    [userId]
  );

  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.ID)) {
      map.set(r.ID, {
        id: r.ID,
        title: r.Title,
        description: r.Description,
        image: r.Image,
        price: Number(r.Price),
        category: r.CategoryName || null,
        subcategories: []
      });
    }
    if (r.SubcategoryName) {
      map.get(r.ID).subcategories.push(r.SubcategoryName);
    }
  }
  return Array.from(map.values());
}

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/categories', async (_req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Blad serwera' });
  }
});

app.get('/courses', async (_req, res) => {
  try {
    const courses = await getCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Blad serwera' });
  }
});

app.post('/auth/register', async (req, res) => {
  const { name, surname, password } = req.body || {};
  if (!name || !surname || !password) {
    return res.status(400).json({ message: 'Brak wymaganych danych' });
  }

  try {
    const [exists] = await db.query(
      'SELECT ID FROM Users WHERE Name = ? AND Surname = ? LIMIT 1',
      [name, surname]
    );

    if (exists.length > 0) {
      return res.status(409).json({ message: 'Uzytkownik juz istnieje' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO Users (Name, Surname, Password) VALUES (?, ?, ?)',
      [name, surname, hash]
    );

    const user = { ID: result.insertId, Name: name, Surname: surname };
    const token = signToken(user);

    res.json({ token, user: { id: user.ID, name: user.Name, surname: user.Surname } });
  } catch (err) {
    res.status(500).json({ message: 'Blad serwera' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { name, surname, password } = req.body || {};
  if (!name || !surname || !password) {
    return res.status(400).json({ message: 'Brak wymaganych danych' });
  }

  try {
    const [rows] = await db.query(
      'SELECT ID, Name, Surname, Password FROM Users WHERE Name = ? AND Surname = ? LIMIT 1',
      [name, surname]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Nieprawidlowe dane' });
    }

    const user = rows[0];
    let ok = false;

    if (user.Password && user.Password.startsWith('$2')) {
      ok = await bcrypt.compare(password, user.Password);
    } else {
      ok = password === user.Password;
    }

    if (!ok) {
      return res.status(401).json({ message: 'Nieprawidlowe dane' });
    }

    const token = signToken(user);
    res.json({ token, user: { id: user.ID, name: user.Name, surname: user.Surname } });
  } catch (err) {
    res.status(500).json({ message: 'Blad serwera' });
  }
});

app.get('/auth/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

app.get('/basket', authMiddleware, async (req, res) => {
  try {
    const items = await getBasket(req.user.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Blad serwera' });
  }
});

app.post('/basket', authMiddleware, async (req, res) => {
  const { courseId } = req.body || {};
  if (!courseId) return res.status(400).json({ message: 'Brak courseId' });

  try {
    await db.query(
      'INSERT IGNORE INTO Basket (UserID, CourseID) VALUES (?, ?)',
      [req.user.id, courseId]
    );
    const items = await getBasket(req.user.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Blad serwera' });
  }
});

app.delete('/basket/:courseId', authMiddleware, async (req, res) => {
  const courseId = Number(req.params.courseId);
  if (!courseId) return res.status(400).json({ message: 'Brak courseId' });

  try {
    await db.query(
      'DELETE FROM Basket WHERE UserID = ? AND CourseID = ?',
      [req.user.id, courseId]
    );
    const items = await getBasket(req.user.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Blad serwera' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend dziala na porcie ${PORT}`);
});
