import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { getExpenses } from '../services/api';
import BudgetUtils from '../utils/BudgetUtils';
import Sanitization from '../utils/Sanitization';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [budget, setBudget] = useState(null);
  const [username, setUsername] = useState('');

  const colors = [
    COLORS.primary, COLORS.success, COLORS.error,
    '#FFA500', '#800080', COLORS.textLight
  ];

  const parseAmount = (amount) => {
    const numericValue = Number(String(amount).replace(/[^0-9.]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  useEffect(() => {
  fetchData();
  AsyncStorage.getItem('username').then(name => {
    if (name) setUsername(name.split('@')[0]);
  });
}, []);

  const fetchData = async () => {
    try {
      const budgetData = await AsyncStorage.getItem('budget');
      const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
      if (budgetData) {
        const parsed = JSON.parse(budgetData);
        if (parsed.period === currentPeriod) {
          setBudget(parsed.amount);
        } else {
          setBudget(null);
        }
      }

      const expenses = await getExpenses();
      const periodExpenses = expenses.filter(
        (expense) => expense.createdAt && expense.createdAt.slice(0, 7) === currentPeriod
      );

      const spending = periodExpenses.reduce((sum, expense) => {
        const amount = parseAmount(expense.amount);
        return sum + amount;
      }, 0);
      setTotalSpending(spending);

      const categoryMap = periodExpenses.reduce((acc, expense) => {
        const category = Sanitization.isNonEmptyString(expense.category) ? expense.category : 'Undefined';
        const amount = parseAmount(expense.amount);
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {});

      const sortedCategories = Object.entries(categoryMap)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [name, value], index) => {
          if (index < 5) acc[name] = value;
          else acc['Others'] = (acc['Others'] || 0) + value;
          return acc;
        }, {});

      const data = Object.entries(sortedCategories).map(([name, value], index) => ({
        name: `${name === 'Undefined' ? 'RWF -empty-' : name}`,
        population: value > 0 ? value : 1,
        color: colors[index % colors.length],
        legendFontColor: COLORS.text,
        legendFontSize: 14,
      }));

      setChartData(data.length ? data : [{
        name: 'RWF 0.0 -empty-',
        population: 1,
        color: COLORS.textLight,
        legendFontColor: COLORS.text,
        legendFontSize: 14,
      }]);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getInsight = () => {
    if (!budget) return null;
    const percentage = (totalSpending / budget) * 100;

    if (percentage > 100) {
      return (
        <Text style={styles.feedbackText}>
          You've exceeded your budget by RWF {(totalSpending - budget).toLocaleString()}. While this happens to the best of us, consider reviewing where your largest expenses go. 🌱 Prioritizing essentials and setting gentle limits can help you realign with your financial goals.
        </Text>
      );
    } else {
      return (
        <Text style={styles.feedbackText}>
          You're within your budget — excellent! 🎯 You have RWF {(budget - totalSpending).toLocaleString()} left this month. Keep nurturing this habit — it plants seeds for a secure and vibrant future ✨.
        </Text>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Spending Dashboard</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Spending by Category</Text>
        <PieChart
          data={chartData}
          width={screenWidth - SIZES.lg * 2}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => COLORS.text,
            style: { borderRadius: 16 },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 0]}
          absolute
          hasLegend={true}
          style={{
            marginVertical: SIZES.sm,
            paddingRight: SIZES.lg,
          }}
        />

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Total Spending: RWF {(totalSpending ?? 0).toLocaleString()}
          </Text>
          {budget != null && (
  <Text style={styles.summaryText}>
    Budget: RWF {(budget ?? 0).toLocaleString()} ({budget ? ((totalSpending / budget) * 100).toFixed(1) : 0}% used)
  </Text>
)}
        </View>

        {budget && (
          <View style={[
            styles.feedback,
            {
              borderLeftColor: (totalSpending > budget) ? COLORS.error : COLORS.success,
            }
          ]}>
            {/* Greet the user if we have their username */}
            {username ? (
              <Text style={styles.greetingText}>Hey {username.split('@')[0]},</Text>
            ) : null}
            <Text style={styles.feedbackTitle}>💡 Insight</Text>
            {getInsight()}
          </View>
        )}
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.lg,
    margin: SIZES.lg,
    ...SHADOWS.medium,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  summary: {
    marginTop: SIZES.md,
  },
  summaryText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  feedback: {
    backgroundColor: COLORS.card,
    borderLeftWidth: 4,
    padding: SIZES.md,
    marginTop: SIZES.md,
    borderRadius: SIZES.sm,
  },
  feedbackTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    lineHeight: 20,
  },
});

export default DashboardScreen;
