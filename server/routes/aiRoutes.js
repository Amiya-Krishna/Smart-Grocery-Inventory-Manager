import express from "express";
import { predictUsage } from "../services/prediction.js";

const router = express.Router();

router.post("/predict", async (req, res) => {
  const { history } = req.body;

  const result = await predictUsage(history);

  res.json(result);
});

export default router;