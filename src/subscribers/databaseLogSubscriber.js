const db = require("../db");

module.exports = (data) => {
	db.run(
		`INSERT INTO resources (name, createdAt) VALUES (?, ?)`,
		[data.name, data.createdAt],
		(err) => {
			if (err) {
				console.error("Database logging error:", err.message);
			} else {
				console.log("Resource saved to database:", data);
			}
		}
	);
};
