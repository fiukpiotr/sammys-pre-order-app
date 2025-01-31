const express = require("express");
const fs = require("fs");
const cors = require("cors");


const app = express();
const PORT = 3000;
const DB_FILE = "db.json";

app.use(cors({
  origin: "https://sammys-pre-order-app.vercel.app",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));

app.use(express.json());

// Funkcja pomocnicza: Odczyt danych z db.json
const readDatabase = () => {
  if (!fs.existsSync(DB_FILE)) return {};
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
};

// Funkcja pomocnicza: Zapis danych do db.json
const writeDatabase = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Pobieranie zamówień dla danego dnia
app.get("/orders/:date", (req, res) => {
  const db = readDatabase();
  const date = req.params.date;

  if (!db[date]) {
    db[date] = [];
    writeDatabase(db); 
  }

  res.json(db[date]);
});


// Dodawanie nowego zamówienia
app.post("/orders/:date", (req, res) => {
  const db = readDatabase();
  const date = req.params.date;
  const newOrder = req.body;

  if (!db[date]) db[date] = [];
  db[date].push(newOrder);

  writeDatabase(db);
  res.json({ message: "Order added successfully", order: newOrder });
});

// Edycja zamówienia
app.put("/orders/:date/:index", (req, res) => {
  const db = readDatabase();
  const date = req.params.date;
  const index = parseInt(req.params.index);
  
  if (!db[date] || !db[date][index]) {
    return res.status(404).json({ message: "Order not found" });
  }

  db[date][index] = req.body;
  writeDatabase(db);
  res.json({ message: "Order updated successfully" });
});

// Usuwanie zamówienia
app.delete("/orders/:date/:index", (req, res) => {
  const db = readDatabase();
  const date = req.params.date;
  const index = parseInt(req.params.index);

  if (!db[date] || !db[date][index]) {
    return res.status(404).json({ message: "Order not found" });
  }

  db[date].splice(index, 1);
  writeDatabase(db);
  res.json({ message: "Order deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
