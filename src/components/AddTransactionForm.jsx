import React, { useState } from "react";

function AddTransactionForm({postTransaction}) {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    amount: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function submitForm(e){
    e.preventDefault();
    const transactionToPost = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    postTransaction(transactionToPost);
    setFormData({
      date: "",
      description: "",
      category: "",
      amount: ""
    });
  }

  return (
    <div className="ui segment">
      <form className="ui form" onSubmit={(e)=>{submitForm(e)}}>
        <div className="inline fields">
          <label htmlFor="date-input">Date</label>
          <input id="date-input" type="date" name="date" aria-label="date" value={formData.date} onChange={handleChange} />
          <label htmlFor="description-input">Description</label>
          <input id="description-input" type="text" name="description" placeholder="Description" aria-label="description" value={formData.description} onChange={handleChange} />
          <label htmlFor="category-input">Category</label>
          <input id="category-input" type="text" name="category" placeholder="Category" aria-label="category" value={formData.category} onChange={handleChange} />
          <label htmlFor="amount-input">Amount</label>
          <input id="amount-input" type="number" name="amount" placeholder="Amount" step="0.01" aria-label="amount" value={formData.amount} onChange={handleChange} />
        </div>
        <button className="ui button" type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;
