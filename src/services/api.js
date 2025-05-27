import axios from 'axios';

const API_BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1';

export const loginUser = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: { username },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};

export const createExpense = async (expenseData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/expenses`, expenseData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create expense');
  }
};

export const getExpenses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch expenses');
  }
};

export const getExpense = async (expenseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses/${expenseId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch expense details');
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/expenses/${expenseId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete expense');
  }
};