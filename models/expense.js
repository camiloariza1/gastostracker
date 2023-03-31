const { Schema, model } = require('mongoose');

const ExpensesSchema = new Schema({
  monto: {
    type: Number,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  asunto: {
    type: String,
    required: true,
  },
});

const Expense = model('Expense', ExpensesSchema);

module.exports = Expense;
