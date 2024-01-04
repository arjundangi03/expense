const { default: mongoose } = require("mongoose");

const budgetSchema = mongoose.Schema(
  {
    amount: Number,
    month: String,
    year: String,
    createdBy: String,
  },
  {
    timestamps: true,
  }
);

const BudgetModel = mongoose.model("budget", budgetSchema);
module.exports = BudgetModel;
