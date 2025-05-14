
import express from "express";
import Tier from "../model/tier.js";
import User from "../model/user.js";
import { jwtAuthMiddleware } from "../utils/jwt.js";

const tierRoutes = express.Router();

// Create Tier and link to user
tierRoutes.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, price, startDate, endDate } = req.body;

    const tier = await Tier.create({
      name,
      price,
      startDate,
      endDate,
      user: user._id,
    });

    user.tier.push(tier._id);
    await user.save();

    res.status(201).json(tier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create tier", error: err.message });
  }
});

// Get all tiers for logged-in user
tierRoutes.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).populate("tier");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.tier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tiers", error: err.message });
  }
});

// Delete a specific tier
tierRoutes.delete("/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the tier belongs to the user
    if (!user.tier.includes(req.params.id)) {
      return res.status(403).json({ message: "Unauthorized to delete this tier" });
    }

    const deletedTier = await Tier.findByIdAndDelete(req.params.id);
    if (!deletedTier) return res.status(404).json({ message: "Tier not found" });

    user.tier = user.tier.filter(tid => tid.toString() !== req.params.id);
    await user.save();

    res.status(200).json({ message: "Tier deleted successfully", deletedTier });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete tier", error: err.message });
  }
});

export default tierRoutes;
