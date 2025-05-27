import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, PlusCircle, Calendar, Wallet, PieChart } from 'lucide-react-native';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import ExpenseDetailsScreen from '../screens/ExpenseDetailsScreen';
import DailyExpensesScreen from '../screens/DailyExpensesScreen';
import BudgetScreen from '../screens/BudgetScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'All') {
          return <Home size={size} color={color} />;
        } else if (route.name === 'Add Expense') {
          return <PlusCircle size={size} color={color} />;
        } else if (route.name === 'Daily') {
          return <Calendar size={size} color={color} />;
        } else if (route.name === 'Budget') {
          return <Wallet size={size} color={color} />;
        } else if (route.name === 'Dashboard') {
          return <PieChart size={size} color={color} />;
        }
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textLight,
      tabBarStyle: {
        backgroundColor: COLORS.card,
        borderTopWidth: 0,
        ...SHADOWS.small,
      },
      tabBarLabelStyle: {
        fontFamily: FONTS.medium,
        fontSize: 12,
      },
    })}
  >
    <Tab.Screen
      name="All"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Add Expense"
      component={CreateExpenseScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Daily"
      component={DailyExpensesScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Budget"
      component={BudgetScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExpenseDetails"
        component={ExpenseDetailsScreen}
        options={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: FONTS.bold,
          },
          headerTitle: 'Expense Details',
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;