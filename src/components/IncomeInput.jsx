import React, { useState } from 'react';

    function IncomeInput({ addIncome }) {
      const [description, setDescription] = useState('');
      const [amount, setAmount] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        if (description && amount) {
          addIncome({
            description,
            amount: parseFloat(amount),
            date: new Date().toISOString(),
          });
          setDescription('');
          setAmount('');
        }
      };

      return (
        <div>
          <h2>Add Income</h2>
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
            <button type="submit">Add Income</button>
          </form>
        </div>
      );
    }

    export default IncomeInput;
