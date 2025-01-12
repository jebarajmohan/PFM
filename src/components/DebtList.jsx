import React, { useState } from 'react';
    import TransactionInput from './TransactionInput';
    import formatIndianNumber from '../utils/formatIndianNumber';

    function DebtList({ debts, addDebt, calculateBalance, updateDebt, deleteDebt }) {
      const [editDebtIndex, setEditDebtIndex] = useState(null);

      const handleEdit = (index) => {
        setEditDebtIndex(index);
         window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      const handleCancelEdit = () => {
        setEditDebtIndex(null);
      };

      const handleUpdate = (updatedDebt) => {
        updateDebt(editDebtIndex, updatedDebt);
        setEditDebtIndex(null);
      };

      const handleDelete = (index) => {
        deleteDebt(index);
      };

      const handleExportCSV = () => {
        const csvRows = [];
        const headers = ['Type', 'Lender', 'Description', 'Amount', 'Date', 'Time'];
        csvRows.push(headers.join(','));

        debts.forEach(debt => {
          const values = [
            debt.type,
            debt.lender || '',
            debt.description,
            debt.amount,
            debt.date,
            debt.time || ''
          ];
          csvRows.push(values.join(','));
        });

        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'debts.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };

      return (
        <div>
          {editDebtIndex !== null ? (
            <TransactionInput
              initialTransaction={debts[editDebtIndex]}
              categories={{}}
              onCancel={handleCancelEdit}
              onUpdate={handleUpdate}
            />
          ) : (
            <TransactionInput addTransaction={addDebt} categories={{}} />
          )}
          <h2>Debts</h2>
          {debts.length === 0 ? (
            <p>No debts added yet.</p>
          ) : (
            <table style={{fontSize: '0.9em'}}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Lender</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date & Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {debts.map((debt, index) => {
                  return (
                    <tr key={index}>
                      <td>{debt.type}</td>
                      <td>{debt.lender || '-'}</td>
                      <td>{debt.description}</td>
                      <td>{formatIndianNumber(debt.amount)}</td>
                      <td>
                        {debt.date} {debt.time || ''}
                      </td>
                      <td>
                        <button onClick={() => handleEdit(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }} title="Edit">✏️</button>
                        <button onClick={() => handleDelete(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }} title="Delete">🗑️</button>
                      </td>
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

    export default DebtList;
