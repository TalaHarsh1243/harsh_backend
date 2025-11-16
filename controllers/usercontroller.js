
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//  user registration
exports.register = (req, res) => {
    const { name, email, password, role, phone, city, country } = req.body;

    // basic validation
    if (!email || !password || !name) {
        return res.status(400).json({ message: "All fields required" });
    }

    // hash the password 
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;

        const sql = `INSERT INTO users (name, email, password, role, phone, city, country)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [name, email, hashedPassword, role, phone, city, country], (err) => {
            if (err) return res.json(err);
            res.json({ message: "Registration successful" });
        });
    });
};

// user login
exports.login = (req, res) => {
    const { email, password } = req.body;

    // check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, data) => {
        if (err || data.length === 0) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        // verify password
        bcrypt.compare(password, data[0].password, (err, result) => {
            if (!result) {
                return res.status(400).json({ message: "Invalid Password" });
            }

            // create token for session
            const token = jwt.sign(
                { id: data[0].id, role: data[0].role },
                "secret123",
                { expiresIn: "1d" }
            );

            res.json({
                message: "Login Successful",
                token
            });
        });
    });
};

// get all users - admin only
exports.listUsers = (req, res) => {
    // only admin can see all users
    if (req.user.role !== "Admin") {
        return res.status(403).json({ message: "Access Denied (Admin only)" });
    }

    const search = req.query.search || "";
    const country = req.query.country || "";

    let sql = "SELECT * FROM users WHERE 1=1";

    // add search filter if provided
    if (search) {
        sql += ` AND (name LIKE '%${search}%' OR email LIKE '%${search}%')`;
    }
    
    // filter by country if needed
    if (country) {
        sql += ` AND country = '${country}'`;
    }

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        res.json(data);
    });
};

// get user details
exports.userDetails = (req, res) => {
    const userId = req.params.id;

    // users can only view their profile like admin
    if (req.user.role !== "Admin" && req.user.id != userId) {
        return res.status(403).json({ message: "Access Denied" });
    }

    db.query("SELECT * FROM users WHERE id=?", [userId], (err, data) => {
        if (err) return res.json(err);
        res.json(data[0]);
    });
};
