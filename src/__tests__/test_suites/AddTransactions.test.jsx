import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../components/App';

describe('Add Transactions', () => {
  const mockTransactions = [
    {
      "id": "1",
      "date": "2019-12-01",
      "description": "Paycheck from Bob's Burgers",
      "category": "Income",
      "amount": 1000
    },
    {
      "id": "2",
      "date": "2019-12-01",
      "description": "South by Southwest Quinoa Bowl at Fresh & Co",
      "category": "Food",
      "amount": -10.55
    }
  ];

  const newTransaction = {
    "date": "2019-12-20",
    "description": "Pizza Night",
    "category": "Food",
    "amount": -15.99
  };

  beforeEach(() => {
    global.setFetchResponse(mockTransactions);
  });

  it('should add a new transaction to the frontend when form is submitted', async () => {
    global.fetch = vi.fn((url, options) => {
      if (options && options.method === 'POST') {
        return Promise.resolve({
          json: () => Promise.resolve({ ...newTransaction, "id": "3" }),
          ok: true,
          status: 200
        });
      } else {
        return Promise.resolve({
          json: () => Promise.resolve(mockTransactions),
          ok: true,
          status: 200
        });
      }
    });

    render(<App />);
    
    // Wait for initial transactions to load
    const initialItems = await screen.findAllByTestId('transaction-item');
    expect(initialItems).toHaveLength(2);

    // Fill in form fields using userEvent
    const dateInput = screen.getByLabelText(/date/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const categoryInput = screen.getByLabelText(/category/i);
    const amountInput = screen.getByLabelText(/amount/i);

    await userEvent.type(dateInput, newTransaction.date);
    await userEvent.type(descriptionInput, newTransaction.description);
    await userEvent.type(categoryInput, newTransaction.category);
    await userEvent.type(amountInput, String(newTransaction.amount));

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add transaction/i });
    await userEvent.click(submitButton);

    // Wait for new transaction to appear
    await waitFor(() => {
      const items = screen.getAllByTestId('transaction-item');
      expect(items).toHaveLength(3);
    });
  });

  it('should make a POST request with transaction data', async () => {
    global.fetch = vi.fn((url, options) => {
      if (options && options.method === 'POST') {
        return Promise.resolve({
          json: () => Promise.resolve({ ...newTransaction, "id": "3" }),
          ok: true,
          status: 200
        });
      } else {
        return Promise.resolve({
          json: () => Promise.resolve(mockTransactions),
          ok: true,
          status: 200
        });
      }
    });

    render(<App />);
    
    // Wait for initial load
    await screen.findAllByTestId('transaction-item');

    // Fill form
    const dateInput = screen.getByLabelText(/date/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const categoryInput = screen.getByLabelText(/category/i);
    const amountInput = screen.getByLabelText(/amount/i);

    await userEvent.type(dateInput, newTransaction.date);
    await userEvent.type(descriptionInput, newTransaction.description);
    await userEvent.type(categoryInput, newTransaction.category);
    await userEvent.type(amountInput, String(newTransaction.amount));

    // Submit
    const submitButton = screen.getByRole('button', { name: /add transaction/i });
    await userEvent.click(submitButton);

    // Verify POST request was made
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:6001/transactions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTransaction)
        })
      );
    });
  });
});
