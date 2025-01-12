import React, { useState } from 'react';

    function CategoryManager({ addCategory, categories }) {
      const [newCategory, setNewCategory] = useState('');
      const [type, setType] = useState('expense');

      const handleSubmit = (e) => {
        e.preventDefault();
        if (newCategory) {
          addCategory(newCategory, type);
          setNewCategory('');
        }
      };

      return (
        <div>
          <h2>Manage Categories</h2>
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
              </div>
            </div>
            <div className="input-group">
              <label>New Category</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
            </div>
            <button type="submit">Add Category</button>
          </form>
          <div>
            <h3>Current Categories</h3>
            <h4>Expense Categories</h4>
            <ul>
              {categories.expense.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
            <h4>Income Categories</h4>
             <ul>
              {categories.income.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    export default CategoryManager;
