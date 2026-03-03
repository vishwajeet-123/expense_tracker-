import React, { useEffect, useState } from "react";
import API from "../api";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import SummaryChart from "../components/SummaryChart";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);

  // ✅ Dynamic Month & Year
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    try {
      const tRes = await API.get("/transactions");
      setTransactions(tRes.data);

      const sRes = await API.get(
        `/transactions/summary?month=${month}&year=${year}`
      );
      setSummary(sRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ✅ Re-fetch when month or year changes
  useEffect(() => {
    fetchData();
  }, [month, year]);

  if (!summary) return <div>Loading...</div>;

  return (
    <div>
      <h2>Total Income: ₹{summary.totalIncome}</h2>
      <h2>Total Expense: ₹{summary.totalExpense}</h2>
      <h2>Balance: ₹{summary.balance}</h2>

      {/* ✅ Month Selector */}
      <div>
        <label>Select Month: </label>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <label>Select Year: </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>

      <TransactionForm refresh={fetchData} />
      <TransactionList transactions={transactions} refresh={fetchData} />

      <h3>Expense Breakdown</h3>
      <SummaryChart categorySummary={summary.categorySummary} />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;