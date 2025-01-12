import React, { useState } from 'react';
    import TransactionInput from './TransactionInput';
    import formatIndianNumber from '../utils/formatIndianNumber';

    function TransactionList({ transactions, addTransaction, categories, calculateBalance, updateTransaction, deleteTransaction }) {
      const [editTransactionIndex, setEditTransactionIndex] = useState(null);
      const [filterType, setFilterType] = useState('all');

      const handleEdit = (index) => {
        setEditTransactionIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      const handleCancelEdit = () => {
        setEditTransactionIndex(null);
      };

      const handleUpdate = (updatedTransaction) => {
        updateTransaction(editTransactionIndex, updatedTransaction);
        setEditTransactionIndex(null);
      };

      const handleDelete = (index) => {
        deleteTransaction(index);
      };

      const handleExportCSV = () => {
        const csvRows = [];
        const headers = ['Type', 'Category', 'Description', 'Amount', 'Date', 'Time', 'Lender'];
        csvRows.push(headers.join(','));

        transactions.forEach(transaction => {
          const values = [
            transaction.type,
            transaction.category || '',
            transaction.description,
            transaction.amount,
            transaction.date,
            transaction.time || '',
            transaction.lender || ''
          ];
          csvRows.push(values.join(','));
        });

        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'transactions.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };

      const filteredTransactions = filterType === 'all' ? transactions : transactions.filter(t => t.type === filterType);

      return (
        <div>
          {editTransactionIndex !== null ? (
            <TransactionInput
              initialTransaction={transactions[editTransactionIndex]}
              categories={categories}
              onCancel={handleCancelEdit}
              onUpdate={handleUpdate}
            />
          ) : (
            <TransactionInput addTransaction={addTransaction} categories={categories} />
          )}
          <h2>Transactions</h2>
           <div className="input-group">
              <label>Filter by Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                 <option value="debt">Debt</option>
                 <option value="debt-repayment">Debt Repayment</option>
              </select>
            </div>
          {filteredTransactions.length === 0 ? (
            <p>No transactions added yet.</p>
          ) : (
            <table style={{fontSize: '0.9em'}}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date & Time</th>
                  <th>Balance</th>
                  <th>Actions</th>
                  <th>Lender</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => {
                  const transactionBalance = transactions
                    .slice(0, index + 1)
                    .reduce((balance, t) => {
                      if (t.type === 'income' || t.type === 'debt') {
                        return balance + t.amount;
                      } else if (t.type === 'expense' || t.type === 'debt-repayment') {
                        return balance - t.amount;
                      }
                      return balance;
                    }, 0);

                  return (
                    <tr key={index}>
                      <td>{transaction.type}</td>
                      <td>{transaction.category || '-'}</td>
                      <td>{transaction.description}</td>
                      <td>{formatIndianNumber(transaction.amount)}</td>
                      <td>
                        {transaction.date} {transaction.time || ''}
                      </td>
                      <td>{formatIndianNumber(transactionBalance)}</td>
                      <td>
                        <button onClick={() => handleEdit(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }} title="Edit">✏️</button>
                        <button onClick={() => handleDelete(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }} title="Delete">🗑️</button>
                      </td>
                      <td>{transaction.lender || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
           <button style={{marginTop: '20px'}} onClick={handleExportCSV}>Export to CSV</button>
        </div>
      );
    }

    export default TransactionList;
