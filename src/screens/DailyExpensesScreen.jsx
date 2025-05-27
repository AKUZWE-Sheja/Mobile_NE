import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { getExpenses, deleteExpense } from '../services/api';
import ExpenseCard from '../components/ExpenseCard';
import Sanitization from '../utils/Sanitization';
import BudgetUtils from '../utils/BudgetUtils';

// This screen shows your expenses for a specific day.
// You can pick a date, see what you spent, and delete items if you want.
const DailyExpensesScreen = ({ navigation }) => {
  // State for all expenses, filtered expenses, loading spinner, and date picker
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Fetch all expenses from the API and filter for the selected date
  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
      filterExpensesByDate(data, date);
      await BudgetUtils.checkBudgetAndNotify('DailyExpenses');
    } catch (error) {
      Alert.alert('Error', 'Failed to load expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter the expenses for the currently selected date
  const filterExpensesByDate = (data, selectedDate) => {
    if (!data) return;
    const formattedDate = selectedDate.toISOString().split('T')[0]; // e.g., 2025-05-27
    const filtered = data.filter((expense) => {
      const expenseDate = new Date(expense.createdAt).toISOString().split('T')[0];
      return expenseDate === formattedDate;
    });
    setFilteredExpenses(filtered);
  };

  // Handle when the user picks a new date
  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      filterExpensesByDate(expenses, selectedDate);
    }
  };

  // Delete an expense and update the list for the current date
  const handleDelete = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId);
      setExpenses(updatedExpenses);
      filterExpensesByDate(updatedExpenses, date);
      Alert.alert('Success', 'Expense deleted successfully.');
      await BudgetUtils.checkBudgetAndNotify('DailyExpenses');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete expense. Please try again.');
    }
  };

  // Load expenses when the screen mounts
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Show a spinner while loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with the screen title */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Daily Expenses</Text>
      </View>
      {/* Date picker section */}
      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <Calendar size={20} color={COLORS.text} />
          <Text style={styles.dateText}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {/* Show the date picker when needed */}
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
      {/* List of expenses for the selected day */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            onPress={() => navigation.navigate('ExpenseDetails', { expenseId: item.id })}
            onDelete={handleDelete}
          />
        )}
        // Friendly message if there are no expenses for the day
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No expenses found for {date.toLocaleDateString()}.
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

// Styles for a clean, modern look
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SIZES.lg,
    ...SHADOWS.small,
  },
  headerText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#fff',
  },
  dateContainer: {
    padding: SIZES.md,
    backgroundColor: COLORS.card,
    ...SHADOWS.small,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.sm,
    padding: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: SIZES.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SIZES.md,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SIZES.lg,
  },
});

export default DailyExpensesScreen;