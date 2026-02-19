import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../components/App';

describe('Search and Sort Transactions', () => {
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
    },
    {
      "id": "3",
      "date": "2019-12-02",
      "description": "South by Southwest Quinoa Bowl at Fresh & Co",
      "category": "Food",
      "amount": -10.55
    },
    {
      "id": "4",
      "date": "2019-12-04",
      "description": "Sunglasses, Urban Outfitters",
      "category": "Fashion",
      "amount": -24.99
    },
    {
      "id": "5",
      "date": "2019-12-06",
      "description": "Venmo, Alice Pays you for Burrito",
      "category": "Food",
      "amount": 8.75
    },
    {
      "id": "6",
      "date": "2019-12-06",
      "description": "Chipotle",
      "category": "Food",
      "amount": -17.59
    }
  ];

  beforeEach(() => {
    global.setFetchResponse(mockTransactions);
  });

  it('should trigger change event when search input is updated', async () => {
    render(<App />);

    // Wait for transactions to load
    await screen.findAllByTestId('transaction-item');

    // Find search input
    const searchInput = screen.getByLabelText(/search/i);
    
    // Verify it exists and is empty
    expect(searchInput).toHaveValue('');

    // Trigger change event
    await userEvent.type(searchInput, 'Paycheck');

    // Verify the input value changed
    expect(searchInput).toHaveValue('Paycheck');
  });

  it('should filter transactions based on search term', async () => {
    render(<App />);

    // Wait for all transactions to load
    await screen.findAllByTestId('transaction-item');
    const allItems = screen.getAllByTestId('transaction-item');
    expect(allItems).toHaveLength(6);

    // Search for "Paycheck"
    const searchInput = screen.getByLabelText(/search/i);
    await userEvent.type(searchInput, 'Paycheck');

    // Should only show 1 transaction with "Paycheck" in description
    await waitFor(() => {
      const filteredItems = screen.getAllByTestId('transaction-item');
      expect(filteredItems).toHaveLength(1);
      expect(filteredItems[0]).toHaveTextContent('Paycheck');
    });
  });

  it('should filter transactions based on search in description', async () => {
    render(<App />);

    // Wait for all transactions to load
    await screen.findAllByTestId('transaction-item');

    // Search for "Quinoa"
    const searchInput = screen.getByLabelText(/search/i);
    await userEvent.type(searchInput, 'Quinoa');

    // Should show 2 transactions with "Quinoa" in description
    await waitFor(() => {
      const filteredItems = screen.getAllByTestId('transaction-item');
      expect(filteredItems).toHaveLength(2);
    });
  });

  it('should update page when search is cleared', async () => {
    render(<App />);

    // Wait for all transactions to load
    await screen.findAllByTestId('transaction-item');

    // Search for something
    const searchInput = screen.getByLabelText(/search/i);
    await userEvent.type(searchInput, 'Paycheck');

    // Verify filtered
    await waitFor(() => {
      const filteredItems = screen.getAllByTestId('transaction-item');
      expect(filteredItems).toHaveLength(1);
    });

    // Clear search
    await userEvent.clear(searchInput);

    // Should show all transactions again
    await waitFor(() => {
      const allItems = screen.getAllByTestId('transaction-item');
      expect(allItems).toHaveLength(6);
    });
  });
});
