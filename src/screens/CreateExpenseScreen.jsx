import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import InputField from '../components/InputField';
import { createExpense } from '../services/api';
import Sanitization from '../utils/Sanitization';
import BudgetUtils from '../utils/BudgetUtils';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

// This screen lets you add a new expense to your list
const CreateExpenseScreen = ({ navigation }) => {
  // State for the form fields and errors
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});

  // Validate the form before submitting
  const validate = () => {
    const newErrors = {};
    if (!Sanitization.isNonEmptyString(description)) newErrors.description = 'Description is required';
    const sanitizedAmount = Sanitization.sanitizeNumber(amount);
    if (!sanitizedAmount) newErrors.amount = 'Enter a valid positive amount';
    // Category is optional, so no validation needed!
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle the "Create Expense" button press
  const handleCreate = async () => {
    if (!validate()) {
      Alert.alert('Error', errors.description || errors.amount || 'Please correct the errors.');
      return;
    }
    try {
      // Prepare the expense data to send to the backend
      const expenseData = {
        description: Sanitization.trimString(description),
        amount: Sanitization.sanitizeNumber(amount),
        category: Sanitization.isNonEmptyString(category) ? Sanitization.trimString(category) : '',
        createdAt: new Date().toISOString(),
      };
      // Actually create the expense
      const response = await createExpense(expenseData);
      console.log('Expense created:', response); // Debug log
      // Show a success message and go back to the list
      Alert.alert('Success', 'Expense created successfully', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('All', { refresh: true }); // Signal refresh
          },
        },
      ]);
      // Reset the form fields
      setDescription('');
      setAmount('');
      setCategory('');
      // Check if a budget notification needs to be sent
      await BudgetUtils.checkBudgetAndNotify('CreateExpense');
    } catch (error) {
      console.error('Failed to create expense:', error.message); // Debug log
      Alert.alert('Error', 'Failed to create expense. Please check your network and try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add New Expense</Text>
        {/* Description input */}
        <InputField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="e.g., Groceries"
          error={errors.description}
        />
        {/* Amount input */}
        <InputField
          label="Amount (RWF)"
          value={amount}
          onChangeText={setAmount}
          placeholder="e.g., 10000"
          keyboardType="numeric"
          error={errors.amount}
        />
        {/* Category input (optional) */}
        <InputField
          label="Category"
          value={category}
          onChangeText={setCategory}
          placeholder="e.g., Food (optional)"
          error={errors.category}
        />
        {/* Button to create the expense */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleCreate}
        >
          <Text style={styles.buttonText}>Create Expense</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles for a clean, modern look
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SIZES.lg,
  },
  formContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.lg,
    marginHorizontal: SIZES.md,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.lg,
    textAlign: 'center',
  },
  button: {
    borderRadius: SIZES.sm,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.md,
    ...SHADOWS.sm,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
});

export default CreateExpenseScreen;