import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { getExpenses } from '../services/api';
import Sanitization from './Sanitization';
import { Platform } from 'react-native';

class BudgetUtils {
  static async getMonthlySpending(period) {
    try {
      const expenses = await getExpenses();
      const filteredExpenses = expenses.filter((expense) => {
        const expensePeriod = new Date(expense.createdAt).toISOString().slice(0, 7); // YYYY-MM
        return expensePeriod === period;
      });
      return filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    } catch (error) {
      console.error('Error calculating spending:', error);
      return 0;
    }
  }

  static async checkBudgetAndNotify(context = 'General') {
    try {
      const budgetData = await AsyncStorage.getItem('budget');
      if (!budgetData) return;

      const { amount: budget, period } = JSON.parse(budgetData);
      const spending = await this.getMonthlySpending(period);
      const percentage = (spending / budget) * 100;

      if (percentage >= 90 && percentage < 100) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Budget Warning',
            body: `You've spent ${percentage.toFixed(1)}% (RWF ${spending}) of your RWF ${budget} budget for ${period}.`,
            data: { type: 'warning', context, period },
          },
          trigger: null, // Send immediately
        });
      } else if (percentage >= 100) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Budget Exceeded',
            body: `You've exceeded your RWF ${budget} budget for ${period} by RWF ${spending - budget}!`,
            data: { type: 'exceeded', context, period },
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.error('Error checking budget:', error);
    }
  }

  static async configureNotifications() {
    try {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted!');
        return;
      }

      // Configure Android notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('budget-channel', {
          name: 'Budget Notifications',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.error('Error configuring notifications:', error);
    }
  }
}

export default BudgetUtils;