const { default: mongoose } = require("mongoose");

const expenseSchema = mongoose.Schema(
  {
    title: String,
    category: String,
    amount: Number,
    date:String,
    createdBy: String,
  },
  {
    timestamps: true,
  }
);

const ExpenseModel = mongoose.model("expenses", expenseSchema);
module.exports = ExpenseModel;
