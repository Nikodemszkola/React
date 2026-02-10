require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const { DatabaseConnection } = require('./database');

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

const cors = require('cors');
app.use(cors());


// ----------------------
//     STRIPE WEBHOOK
// ----------------------

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Obsługa zdarzenia płatności
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // userId przekazujemy w metadata
    const userId = session.metadata.userId;

    try {
      // Pobieramy kursy z koszyka użytkownika
      const basketItems = await db.query(
        `SELECT CourseID FROM Basket WHERE UserID = ?`,
        [userId]
      );

      // Dodajemy każdy kurs do MyCourses
      for (const item of basketItems) {
        await db.query(
          `INSERT IGNORE INTO MyCourses (UserID, CourseID) VALUES (?, ?)`,
          [userId, item.CourseID]
        );
      }

      // Czyścimy koszyk
      await db.query(
        `DELETE FROM Basket WHERE UserID = ?`,
        [userId]
      );

      console.log(`Zakup zakończony! Kursy dodane dla userId=${userId}`);
    } catch (err) {
      console.error("Błąd podczas finalizacji zakupu:", err);
    }
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata?.userId;

    if (!userId) {
      console.error("Brak userId w metadata — nie przypisuję kursów.");
      return res.json({ received: true });
    }

    try {
      const basketItems = await db.query(
        `SELECT CourseID FROM Basket WHERE UserID = ?`,
        [userId]
      );

      for (const item of basketItems) {
        await db.query(
          `INSERT IGNORE INTO MyCourses (UserID, CourseID) VALUES (?, ?)`,
          [userId, item.CourseID]
        );
      }

      await db.query(
        `DELETE FROM Basket WHERE UserID = ?`,
        [userId]
      );

      console.log(`Zakup zakończony! Kursy dodane dla userId=${userId}`);
    } catch (err) {
      console.error("Błąd podczas finalizacji zakupu:", err);
    }
  }



  res.json({ received: true });
});




//app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

const db = new DatabaseConnection();

// Prosta pamięć na access tokeny (testowo, w RAM)
let accessTokens = [];

// ----------------------
//   POMOCNICZE FUNKCJE
// ----------------------
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
}

function authenticateTokenMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // { id, email }
    next();
  });
}


// ----------------------
//        AUTH
// ----------------------

// TESTOWE LOGOWANIE – tylko po "name", bez hasła, bez bazy
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email i hasło są wymagane." });
  }

  try {
    const users = await db.query(
      `SELECT * FROM Users WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: "Nieprawidłowy email lub hasło." });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Nieprawidłowy email lub hasło." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Błąd podczas logowania." });
  }
});


app.delete('/logout', (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ error: 'Brak pola "token" w body.' });
  }

  accessTokens = accessTokens.filter(t => t !== token);
  res.json(accessTokens);
});

// ----------------------
//       COURSES
// ----------------------

// Wszystkie kursy z bazy
app.get('/courses', async (req, res) => {
  try {
    const rows = await db.query(
      `SELECT ID AS id, Title AS title, Description AS description, Image AS image, Price AS price
       FROM Courses`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Błąd podczas pobierania kursów.' });
  }
});

// ----------------------
//     CATEGORIES
// ----------------------

// Kategorie + podkategorie w strukturze jak na froncie
app.get('/categories', async (req, res) => {
  try {
    const categories = await db.query(
      `SELECT ID, Name
       FROM Categories`
    );

    const subcategories = await db.query(
      `SELECT 
          cs.CategoryID,
          s.ID,
          s.Name
        FROM CategoriesSubcategories cs
        JOIN Subcategories s ON cs.SubcategoryID = s.ID`
    );

    const result = categories.map(cat => {
      const subs = subcategories
        .filter(s => s.CategoryID === cat.ID)
        .map(s => ({
          id: s.ID,
          name: s.Name
        }));

      return {
        id: cat.ID,
        name: cat.Name,
        subcategories: subs
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Błąd podczas pobierania kategorii.' });
  }
});

// ----------------------
//        BASKET
// ----------------------

// Pobierz koszyk użytkownika
app.get('/basket/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const rows = await db.query(
      `SELECT 
          c.ID AS id,
          c.Title AS title,
          c.Description AS description,
          c.Image AS image,
          c.Price AS price
       FROM Basket b
       JOIN Courses c ON b.CourseID = c.ID
       WHERE b.UserID = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching basket:", err);
    res.status(500).json({ error: "Błąd podczas pobierania koszyka." });
  }
});

// Dodaj kurs do koszyka
app.post('/basket/:userId/add', async (req, res) => {
  const userId = req.params.userId;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: "Brak courseId w body." });
  }

  try {
    await db.query(
      `INSERT IGNORE INTO Basket (UserID, CourseID) VALUES (?, ?)`,
      [userId, courseId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error adding to basket:", err);
    res.status(500).json({ error: "Błąd podczas dodawania do koszyka." });
  }
});

// Usuń kurs z koszyka
app.delete('/basket/:userId/remove/:courseId', async (req, res) => {
  const userId = req.params.userId;
  const courseId = req.params.courseId;

  try {
    await db.query(
      `DELETE FROM Basket WHERE UserID = ? AND CourseID = ?`,
      [userId, courseId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error removing from basket:", err);
    res.status(500).json({ error: "Błąd podczas usuwania z koszyka." });
  }
});

app.post('/create-checkout-session/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const basketItems = await db.query(
      `SELECT c.ID, c.Title, c.Price
       FROM Basket b
       JOIN Courses c ON b.CourseID = c.ID
       WHERE b.UserID = ?`,
      [userId]
    );

    if (basketItems.length === 0) {
      return res.status(400).json({ error: "Koszyk jest pusty." });
    }

    const lineItems = basketItems.map(item => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.Title,
        },
        unit_amount: Math.round(Number(item.Price) * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      metadata: {
        userId: userId
      },
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/koszyk`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: "Błąd podczas tworzenia sesji płatności." });
  }
});



// ----------------------
//     MY COURSES
// ----------------------

app.get('/my-courses/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const rows = await db.query(
      `SELECT 
          c.ID AS id,
          c.Title AS title,
          c.Description AS description,
          c.Image AS image,
          c.Price AS price
       FROM MyCourses mc
       JOIN Courses c ON mc.CourseID = c.ID
       WHERE mc.UserID = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching my courses:", err);
    res.status(500).json({ error: "Błąd podczas pobierania kursów użytkownika." });
  }
});

app.post('/buy/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: "Brak courseId w body." });
  }

  try {
    await db.query(
      `INSERT IGNORE INTO MyCourses (UserID, CourseID) VALUES (?, ?)`,
      [userId, courseId]
    );

    // po zakupie usuwamy kurs z koszyka
    await db.query(
      `DELETE FROM Basket WHERE UserID = ? AND CourseID = ?`,
      [userId, courseId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error buying course:", err);
    res.status(500).json({ error: "Błąd podczas zakupu kursu." });
  }
});

const bcrypt = require('bcrypt');

// ----------------------
//        REGISTER
// ----------------------
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane." });
  }

  try {
    // sprawdź czy email istnieje
    const existing = await db.query(
      `SELECT id FROM Users WHERE email = ?`,
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email jest już zajęty." });
    }

    // hash hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // zapisz użytkownika
    const result = await db.query(
      `INSERT INTO Users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    );

    const userId = result.insertId;

    // generuj JWT
    const token = jwt.sign(
      { id: userId, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ token, user: { id: userId, name, email } });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Błąd podczas rejestracji." });
  }
});


// ----------------------
//        LOGIN
// ----------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email i hasło są wymagane." });
  }

  try {
    // znajdź użytkownika
    const users = await db.query(
      `SELECT * FROM Users WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: "Nieprawidłowy email lub hasło." });
    }

    const user = users[0];

    // sprawdź hasło
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Nieprawidłowy email lub hasło." });
    }

    // generuj JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Błąd podczas logowania." });
  }
});




// ----------------------
//   TESTOWY ENDPOINT
// ----------------------
app.get('/me', authenticateTokenMiddleware, (req, res) => {
  res.json({ user: req.user });
});




// ----------------------
//      START SERWERA
// ----------------------
const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
