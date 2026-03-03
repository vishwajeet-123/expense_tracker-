const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// 🔹 Add Transaction
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { type, amount, category, date, description } = req.body;

        const newTransaction = new Transaction({
            userId: req.user,
            type,
            amount,
            category,
            date,
            description
        });

        await newTransaction.save();

        res.status(201).json(newTransaction);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 Get All Transactions (For Logged-in User Only)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.user
        }).sort({ date: -1 });

        res.json(transactions);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 Delete Transaction
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user
        });

        res.json({ message: "Transaction deleted" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const mongoose = require("mongoose");

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const userId = new mongoose.Types.ObjectId(req.user);

    const transactions = await Transaction.find({
      userId: userId,
      date: { $gte: startDate, $lt: endDate }
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = {};

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;

        if (!categoryMap[t.category]) {
          categoryMap[t.category] = 0;
        }
        categoryMap[t.category] += t.amount;
      }
    });

    const categorySummary = Object.keys(categoryMap).map((key) => ({
      _id: key,
      total: categoryMap[key]
    }));

    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance,
      categorySummary
    });

  } catch (error) {
    console.log("SUMMARY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;