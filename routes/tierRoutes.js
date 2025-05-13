import express from "express";
import Tier from "../models/Tier.js";
import User from "../models/User.js";
import { jwtAuthMiddleware } from "../jwt/jwt.js";

const router = express.Router();

// Create Tier
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, startPrice, endPrice, startDate, endDate } = req.body;

    const tier = await Tier.create({
      name,
      startPrice,
      endPrice,
      startDate,
      endDate,
      user: user._id,
    });

    res.status(201).json(tier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create tier", error: err.message });
  }
});

export default router;
