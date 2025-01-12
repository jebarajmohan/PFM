import React, { useState, useEffect } from 'react';
    import formatIndianNumber from '../utils/formatIndianNumber';

    function TransactionInput({ addTransaction, categories, initialTransaction, onCancel, onUpdate }) {
      const [description, setDescription] = useState('');
      const [amount, setAmount] = useState('');
      const [category, setCategory] = useState('');
      const [date, setDate] = useState('');
      const [time, setTime] = useState('');
      const [type, setType] = useState('expense');
      const [lender, setLender] = useState('');
      const [availableLenders, setAvailableLenders] = useState([]);
      const [outstandingDebt, setOutstandingDebt] = useState(0);

      useEffect(() => {
        if (initialTransaction) {
          setDescription(initialTransaction.description || '');
          setAmount(initialTransaction.amount || '');
          setCategory(initialTransaction.category || '');
          setDate(initialTransaction.date || '');
          setTime(initialTransaction.time || '');
          setType(initialTransaction.type || 'expense');
          setLender(initialTransaction.lender || '');
        } else {
          setDescription('');
          setAmount('');
          setCategory(categories.expense ? categories.expense[0] : '');
          setDate('');
          setTime('');
          setType('expense');
          setLender('');
        }
      }, [initialTransaction, categories]);

      useEffect(() => {
        if (type === 'debt-repayment') {
          const savedTransactions = localStorage.getItem('transactions');
          const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
          const lenders = transactions
            .filter(t => t.type === 'debt' && t.lender)
            .map(t => t.lender)
            .filter((lender, index, self) => self.indexOf(lender) === index);
          setAvailableLenders(lenders);
          if (lenders.length > 0 && !initialTransaction?.lender) {
            setLender(lenders[0]);
          }
        } else {
          setAvailableLenders([]);
          setOutstandingDebt(0);
        }
      }, [type]);

      useEffect(() => {
        if (type === 'debt-repayment' && lender) {
          const savedTransactions = localStorage.getItem('transactions');
          const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
          const debtTransactions = transactions.filter(t => t.type === 'debt' && t.lender === lender);
          const repaymentTransactions = transactions.filter(t => t.type === 'debt-repayment' && t.lender === lender);

          const totalDebt = debtTransactions.reduce((sum, t) => sum + t.amount, 0);
          const totalRepaid = repaymentTransactions.reduce((sum, t) => sum + t.amount, 0);
          setOutstandingDebt(totalDebt - totalRepaid);
        } else {
          setOutstandingDebt(0);
        }
      }, [type, lender]);


      const handleSubmit = (e) => {
        e.preventDefault();
        if (description && amount && date) {
          const transaction = {
            description,
            amount: parseFloat(amount),
            category: type === 'expense' || type === 'income' ? category : null,
            date,
            time,
            type,
            lender: type === 'debt' || type === 'debt-repayment' ? lender : null,
          };
          if (onUpdate) {
            onUpdate(transaction);
          } else {
            addTransaction(transaction);
          }
          setDescription('');
          setAmount('');
          setCategory(categories.expense ? categories.expense[0] : '');
          setDate('');
          setTime('');
          setType('expense');
          setLender('');
        }
      };

      return (
        <div>
          <h2>{initialTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Type</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="expense"
                    checked={type === 'expense'}
                    onChange={() => setType('expense')}
                  />
                  Expense
                </label>
                <label>
                  <input
                    type="radio"
                    value="income"
                    checked={type === 'income'}
                    onChange={() => setType('income')}
                  />
                  Income
                </label>
                <label>
                  <input
                    type="radio"
                    value="debt"
                    checked={type === 'debt'}
                    onChange={() => setType('debt')}
                  />
                  Debt
                </label>
                <label>
                  <input
                    type="radio"
                    value="debt-repayment"
                    checked={type === 'debt-repayment'}
                    onChange={() => setType('debt-repayment')}
                  />
                  Debt Repayment
                </label>
              </div>
            </div>
            <div className="input-group" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={type !== 'expense' && type !== 'income'}
                >
                  {type === 'expense' ? categories.expense?.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  )) : categories.income?.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            {(type === 'debt') && (
              <div className="input-group">
                <label>Lender</label>
                <input
                  type="text"
                  value={lender}
                  onChange={(e) => setLender(e.target.value)}
                  required
                />
              </div>
            )}
            {(type === 'debt-repayment') && (
              <div className="input-group">
                <label>Lender</label>
                 <select
                  value={lender}
                  onChange={(e) => setLender(e.target.value)}
                  required
                  disabled={availableLenders.length === 0}
                >
                  {availableLenders.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                {outstandingDebt > 0 && (
                  <p>Outstanding Debt: {formatIndianNumber(outstandingDebt)}</p>
                )}
              </div>
            )}
            <div className="input-group">
              <label>Date and Time</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
            <button type="submit">{initialTransaction ? 'Update Transaction' : 'Add Transaction'}</button>
            {initialTransaction && (
              <button type="button" onClick={onCancel}>Cancel</button>
            )}
          </form>
        </div>
      );
    }

    export default TransactionInput;
