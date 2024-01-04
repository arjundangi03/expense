const express = require("express");
const authentication = require("../middlewares/authentication.middleware");
const ExpenseModel = require("../models/expense.model");
const UserModel = require("../models/user.mode");
const BudgetModel = require("../models/budget.model");
const expenseRouter = express.Router();

expenseRouter.post("/add", authentication, async (req, res) => {
  const input = req.body;
  const userId = req.userId;
  try {
    const newBid = await ExpenseModel.create({ ...input, createdBy: userId });

    res.send({ message: "new Expense added", data: newBid });
  } catch (error) {
    console.log(error);
    res.send({ message: "internal error" });
  }
});

expenseRouter.get("/all", authentication, async (req, res) => {
  const userId = req.userId;
  const { filter, month, year } = req.query;
  console.log(month, year);
  const firstDayOfMonth = new Date(year, month - 1, 1); // Month is 0-based in JavaScript Date
  const lastDayOfMonth = new Date(year, month, 0);
  let filterObj = {
    createdBy: userId,
    date: {
      $gte: firstDayOfMonth.toISOString(),
      $lt: lastDayOfMonth.toISOString(),
    },
  };
  if (filter != "all") {
    filterObj["category"] = filter;
  }

  try {
    const filteredExpenses = await ExpenseModel.find(filterObj).sort({
      date: -1,
    });
    const allExpenses = await ExpenseModel.find({
      createdBy: userId,
      date: {
        $gte: firstDayOfMonth.toISOString(),
        $lt: lastDayOfMonth.toISOString(),
      },
    });

    const budgetLimit = await BudgetModel.findOne({
      createdBy: userId,
      month,
      year,
    });
    
    const totalAmount = filteredExpenses.reduce((sum, doc) => sum + doc.amount, 0);

    const categoryTotals = {
      rent: 0,
      entertainment: 0,
      food: 0,
      transportation: 0,
    };

    // Iterate over the data array and update totals

    allExpenses.forEach((item) => {
      const { category, amount } = item;
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    res.send({ filteredExpenses, totalAmount, categoryTotals,budgetLimit });
  } catch (error) {
    console.log(error);
    res.send({ message: "internal error" });
  }
});
expenseRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const allExpenses = await ExpenseModel.deleteOne({ _id: id });

    res.send({ message: "Deleted" });
  } catch (error) {
    console.log(error);
    res.send({ message: "internal error" });
  }
});

expenseRouter.post("/budget", authentication, async (req, res) => {
  const { amount, month, year } = req.body;
  const userId = req.userId;

  try {
    const existingBudget = await BudgetModel.findOne({
      createdBy: userId,
      month,
      year,
    });
    if (existingBudget) {
      existingBudget.amount = amount;
      existingBudget.save();

      return res.send({ message: "Budget updated",budget:existingBudget });
    }

    const newBudget = await BudgetModel.create({
      amount,
      month,
      year,
      createdBy: userId,
    });
    res.send({ message: "Budget Added",budget:newBudget });
  } catch (error) {
    console.log(error);
    res.send({ message: "internal error" });
  }
});

module.exports = expenseRouter;
