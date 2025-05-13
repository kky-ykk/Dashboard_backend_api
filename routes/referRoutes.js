import express from "express";
import Referal from "../models/Referal.js";

const router = express.Router();

router.put("/increase", async (req, res) => {
  try {
    const referDoc = await Referal.findOne();
    if (!referDoc) return res.status(404).json({ message: "Referral document not found" });

    referDoc.refer = referDoc.refer * 1.9;
    await referDoc.save();

    res.json({ updatedRefer: referDoc.refer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to increase refer", error: err.message });
  }
});

export default router;
