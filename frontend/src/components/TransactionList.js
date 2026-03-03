import React from "react";
import API from "../api";

function TransactionList({ transactions, refresh }) {

  const handleDelete = async (id) => {
    await API.delete(`/transactions/${id}`);
    refresh();
  };

  return (
    <div>
      {transactions.map((t) => (
        <div key={t._id}>
          <strong>{t.type.toUpperCase()}</strong> - ₹{t.amount} - {t.category}
          <button onClick={() => handleDelete(t._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;