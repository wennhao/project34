const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables from .env file

// Database connection settings
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

// Create a new Express application
const app = express();
const port = 8001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Keeping track of PIN attempts in memory for simplicity. In a production environment, this should be stored in a persistent store.
const pinAttempts = {};

app.post('/api/accountinfo', async (req, res) => {
  const { target } = req.query; // Read target from query parameters
  const { uid, pincode } = req.body; // Read uid and pincode from JSON body

  console.log("Received on server - Target:", target, "PIN:", pincode, "UID:", uid); // Log what is received

  // Validate input parameters
  if (!target || !uid || !pincode) {
    return res.status(400).json({ success: false, message: "Missing required parameters" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT g.voornaam, g.achternaam, a.saldo, b.pincode, b.blocked
      FROM account a
      INNER JOIN bankpassen b ON a.bankpas_id = b.bankpas_id
      INNER JOIN gebruiker g ON a.gebruiker_id = g.gebruiker_id
      WHERE a.rekening_nummer = ? AND b.uid = ?
    `, [target, uid]);

    console.log("Query result:", rows); // Log the results of the query

    if (rows.length > 0) {
      const account = rows[0];
      if (account.blocked) {
        return res.status(401).json({ success: false, message: "Unauthorized: Card is blocked" });
      }
      if (account.pincode === pincode) {
        res.status(200).json({
          firstname: account.voornaam,
          lastname: account.achternaam,
          balance: account.saldo
        });
      } else {
        // Track PIN attempts
        if (!pinAttempts[uid]) {
          pinAttempts[uid] = 3;
        }

        pinAttempts[uid]--;

        if (pinAttempts[uid] > 0) {
          return res.status(401).json({
            attempts_remaining: pinAttempts[uid]
          });
        } else {
          return res.status(403).json({ success: false, message: "Card blocked" });
        }
      }
    } else {
      res.status(404).json({ success: false, message: "Account not found" });
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Server Health Check endpoint
app.get('/api/noob/health', (req, res) => {
  res.json({ status: "OK" });
});

// Server withdraw endpoint
app.post('/api/withdraw', async (req, res) => {
  const { target } = req.query; // Read target from query parameters
  const { uid, pincode, amount } = req.body; // Read uid, pincode, and amount from JSON body

  // Log the received parameters
  console.log("Received on server - Target:", target, "PIN:", pincode, "UID:", uid, "Amount:", amount);

  // Validate input parameters
  if (!target || !uid || !pincode || amount === undefined) {
    return res.status(400).json({ success: false, message: "Missing required parameters" });
  }

  if (amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid withdrawal amount" });
  }

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    const [account] = await connection.execute(
      `SELECT a.saldo, a.account_id, b.pincode, b.blocked
       FROM account a
       INNER JOIN bankpassen b ON a.bankpas_id = b.bankpas_id
       WHERE a.rekening_nummer = ? AND b.uid = ?`,
      [target, uid]
    );

    // Log the query result
    console.log('Query result:', account);

    if (account.length > 0) {
      const accountInfo = account[0];
      if (accountInfo.blocked) {
        return res.status(401).json({ success: false, message: "Unauthorized: Card is blocked" });
      }
      if (accountInfo.pincode === pincode) {
        if (accountInfo.saldo >= amount) {
          const newBalance = accountInfo.saldo - amount;
          await connection.execute(
            `UPDATE account SET saldo = ? WHERE account_id = ?`,
            [newBalance, accountInfo.account_id]
          );
          res.status(200).json({ success: true });
        } else {
          res.status(412).json({ success: false, message: "No Balance" });
        }
      } else {
        return res.status(403).json({ success: false, message: "Forbidden: Incorrect PIN" });
      }
    } else {
      res.status(404).json({ success: false, message: "Account not found" });
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    if (connection) await connection.end();
  }
});

app.post('/api/checkaccount', async (req, res) => {
  const { iban, uid } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count, b.blocked
       FROM account a
       INNER JOIN bankpassen b ON a.bankpas_id = b.bankpas_id
       WHERE a.rekening_nummer = ? AND b.uid = ?`,
      [iban, uid]
    );

    await connection.end();

    if (rows[0].count > 0) {
      res.json({
        success: true,
        message: 'IBAN and UID exist.',
        blocked: rows[0].blocked
      });
    } else {
      res.status(404).json({ success: false, message: 'IBAN or UID does not exist.' });
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/blockcard', async (req, res) => {
  const { uid } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      `UPDATE bankpassen SET blocked = TRUE WHERE uid = ?`,
      [uid]
    );

    await connection.end();

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Card blocked successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'UID not found.' });
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://145.24.223.51:${port}`);
});
