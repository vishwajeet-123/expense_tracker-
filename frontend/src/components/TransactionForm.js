import React, { useState } from "react";
import API from "../api";

function TransactionForm({ refresh }) {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/transactions", form);
    refresh(); // reload data
    setForm({ type: "expense", amount: "", category: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <select onChange={(e) => setForm({...form, type: e.target.value})}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({...form, amount: e.target.value})}
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({...form, category: e.target.value})}
      />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({...form, description: e.target.value})}
      />

      <button>Add Transaction</button>
    </form>
  );
}

export default TransactionForm;