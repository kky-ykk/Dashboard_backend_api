import express from "express";
import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

const router = express.Router();

// Auto-create default user if not present
const DEFAULT_EMAIL = "admin@gmail.com";
const DEFAULT_PASSWORD = "12345";

(async () => {
    const userExists = await User.findOne({ email: DEFAULT_EMAIL });
    if (!userExists) {
        const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);
        await User.create({ email: DEFAULT_EMAIL, password: hashed });
        console.log("Default user created:", DEFAULT_EMAIL);
    }
})();

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.email);
    res.json({ token });
});

export default router;
