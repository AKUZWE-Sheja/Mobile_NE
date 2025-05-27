import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../components/InputField';
import Sanitization from '../utils/Sanitization';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const BudgetScreen = () => {
  const [budget, setBudget] = useState('');
  const [currentBudget, setCurrentBudget] = useState(null);
  const [errors, setErrors] = useState({});

  const loadBudget = async () => {
    try {
      const budgetData = await AsyncStorage.getItem('budget');
      if (budgetData) {
        const parsed = JSON.parse(budgetData);
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        if (parsed.period === currentMonth) {
          setCurrentBudget(parsed.amount);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load budget. Please try again.');
    }
  };

  const validate = () => {
    const newErrors = {};
    const sanitizedBudget = Sanitization.sanitizeNumber(budget);
    if (!sanitizedBudget) {
      newErrors.budget = 'Enter a valid positive amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSetBudget = async () => {
    if (!validate()) {
      Alert.alert('Error', errors.budget);
      return;
    }
    try {
      const budgetData = {
        amount: Sanitization.sanitizeNumber(budget),
        period: new Date().toISOString().slice(0, 7), // YYYY-MM
      };
      await AsyncStorage.setItem('budget', JSON.stringify(budgetData));
      setCurrentBudget(budgetData.amount);
      setBudget('');
      Alert.alert('Success', `Budget set to RWF ${budgetData.amount} for ${budgetData.period}.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save budget. Please try again.');
    }
  };

  useEffect(() => {
    loadBudget();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Set Monthly Budget</Text>
      </View>
      <View style={styles.formContainer}>
        {currentBudget && (
          <Text style={styles.currentBudgetText}>
            Current Budget: RWF {currentBudget} for {new Date().toISOString().slice(0, 7)}
          </Text>
        )}
        <InputField
          label="Budget Amount (RWF)"
          value={budget}
          onChangeText={setBudget}
          placeholder="e.g., 50000"
          keyboardType="numeric"
          error={errors.budget}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleSetBudget}
        >
          <Text style={styles.buttonText}>Set Budget</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  formContainer: {
    padding: SIZES.lg,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    margin: SIZES.md,
    ...SHADOWS.medium,
  },
  currentBudgetText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  button: {
    borderRadius: SIZES.sm,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.md,
    ...SHADOWS.small,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
});

export default BudgetScreen;


