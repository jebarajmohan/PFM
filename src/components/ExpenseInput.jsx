import React, { useState } from 'react';

    function ExpenseInput({ addExpense, categories }) {
      const [description, setDescription] = useState('');
      const [amount, setAmount] = useState('');
      const [category, setCategory] = useState(categories[0] || '');
      const [date, setDate] = useState('');
      const [time, setTime] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        if (description && amount && category && date) {
          addExpense({
            description,
            amount: parseFloat(amount),
            category,
            date,
            time,
          });
          setDescription('');
          setAmount('');
          setDate('');
          setTime('');
        }
      };

      return (
        <div>
          <h2>Add Expense</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Time (Optional)</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <button type="submit">Add Expense</button>
          </form>
        </div>
      );
    }

    export default ExpenseInput;
