const express = require("express");
const app = express();
app.use(express.json());
const db = require("./db");
const port = 3000;

const Observable = require("./Observable");

// Subscriber imports
const logSubscriber = require("./subscribers/logSubscriber");
const notifySubscriber = require("./subscribers/notifySubscriber");
const emailSubscriber = require("./subscribers/emailSubscriber");
const databaseLogSubscriber = require("./subscribers/databaseLogSubscriber");

// Create an Observable instance
const observable = new Observable();

// Register subscribers
observable.subscribe(logSubscriber);
observable.subscribe(notifySubscriber);
observable.subscribe(emailSubscriber);
observable.subscribe(databaseLogSubscriber);

// POST /: Create a resource and notify subscribers
app.post("/", (req, res) => {
	const { name, createdAt } = req.body;

	// Validate input
	if (!name || !createdAt) {
		return res.status(400).json({ message: "Name and createdAt are required" });
	}

	const newData = { name, createdAt };

	// Save resource to the database
	db.run(
		`INSERT INTO resources (name, createdAt) VALUES (?, ?)`,
		[name, createdAt],
		(err) => {
			if (err) {
				console.error("Error saving to database:", err.message);
				return res.status(500).json({ message: "Error saving to database" });
			}

			// Notify all subscribers
			observable.notify(newData);

			// Respond to the client
			res.status(201).json({ message: "Resource created", data: newData });
		}
	);
});

// GET /: Retrieve all stored resources
app.get("/", (req, res) => {
	db.all(`SELECT * FROM resources`, [], (err, rows) => {
		if (err) {
			console.error("Error fetching resources:", err.message);
			return res.status(500).json({ message: "Error fetching resources" });
		}
		res.json({ data: rows });
	});
});

// Start the server
app.listen(port, () => {
	console.log(`Running here ... http://localhost:${port}/`);
});
