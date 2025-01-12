import React, { useState, useEffect } from 'react';
    import CategoryManager from './components/CategoryManager';
    import Dashboard from './components/Dashboard';
    import TransactionInput from './components/TransactionInput';
    import TransactionList from './components/TransactionList';
    import formatIndianNumber from './utils/formatIndianNumber';

    function App() {
      const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('transactions');
        return saved ? JSON.parse(saved) : [];
      });
      const [expenseCategories, setExpenseCategories] = useState(() => {
        const saved = localStorage.getItem('expenseCategories');
        return saved ? JSON.parse(saved) : ['Food', 'Transportation', 'Utilities'];
      });
      const [incomeCategories, setIncomeCategories] = useState(() => {
        const saved = localStorage.getItem('incomeCategories');
        return saved ? JSON.parse(saved) : ['Salary', 'Freelance', 'Other'];
      });
      const [activeTab, setActiveTab] = useState('home');

      useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
      }, [transactions]);

      useEffect(() => {
        localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories));
      }, [expenseCategories]);

      useEffect(() => {
        localStorage.setItem('incomeCategories', JSON.stringify(incomeCategories));
      }, [incomeCategories]);

      const addTransaction = (newTransaction) => {
        setTransactions([...transactions, newTransaction]);
      };

      const updateTransaction = (index, updatedTransaction) => {
        const updatedTransactions = [...transactions];
        updatedTransactions[index] = updatedTransaction;
        setTransactions(updatedTransactions);
      };

      const deleteTransaction = (index) => {
        const updatedTransactions = transactions.filter((_, i) => i !== index);
        setTransactions(updatedTransactions);
      };


      const addCategory = (newCategory, type) => {
        if (type === 'expense') {
          if (!expenseCategories.includes(newCategory)) {
            setExpenseCategories([...expenseCategories, newCategory]);
          }
        } else if (type === 'income') {
          if (!incomeCategories.includes(newCategory)) {
            setIncomeCategories([...incomeCategories, newCategory]);
          }
        }
      };

      const calculateBalance = () => {
        let balance = 0;
        transactions.forEach((transaction) => {
          if (transaction.type === 'income' || transaction.type === 'debt') {
            balance += transaction.amount;
          } else if (transaction.type === 'expense' || transaction.type === 'debt-repayment') {
            balance -= transaction.amount;
          }
        });
        return balance;
      };

      return (
        <div className="container">
          <h1>Personal Finance Manager</h1>
          <div className="tab-container">
            <div className="tab-buttons">
              <button
                className={activeTab === 'home' ? 'active' : ''}
                onClick={() => setActiveTab('home')}
              >
                Home
              </button>
              <button
                className={activeTab === 'transactions' ? 'active' : ''}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </button>
              <button
                className={activeTab === 'categories' ? 'active' : ''}
                onClick={() => setActiveTab('categories')}
              >
                Categories
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'home' && (
                <>
                  <Dashboard
                    expenses={transactions.filter((t) => t.type === 'expense')}
                  />
                  <h2>Balance: {formatIndianNumber(calculateBalance())}</h2>
                </>
              )}
              {activeTab === 'transactions' && (
                <TransactionList
                  transactions={transactions}
                  addTransaction={addTransaction}
                  categories={{ expense: expenseCategories, income: incomeCategories }}
                  calculateBalance={calculateBalance}
                  updateTransaction={updateTransaction}
                  deleteTransaction={deleteTransaction}
                />
              )}
              {activeTab === 'categories' && (
                <CategoryManager addCategory={addCategory} categories={{ expense: expenseCategories, income: incomeCategories }} />
              )}
            </div>
          </div>
        </div>
      );
    }

    export default App;
