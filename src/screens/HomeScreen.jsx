import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { Search, Plus, LogOut, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS, BORDERS } from '../constants/theme';
import { getExpenses, deleteExpense } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ExpenseCard from '../components/ExpenseCard';
import InputField from '../components/InputField';
import Sanitization from '../utils/Sanitization';
import BudgetUtils from '../utils/BudgetUtils';

// The main screen where users see and manage all their expenses
const HomeScreen = ({ navigation, route }) => {
  // Auth context for logout
  const { logout } = useAuth();

  // State for all expenses, filtered expenses, search, loading, and refreshing
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch expenses from the API
  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
      setFilteredExpenses(data);
    } catch (error) {
      console.error('Fetch expenses failed:', error);
      Alert.alert('Error', 'Failed to load expenses. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchExpenses();
  };

  // Delete an expense and update the list
  const handleDelete = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId);
      setExpenses(updatedExpenses);
      setFilteredExpenses(
        updatedExpenses.filter((expense) =>
          Sanitization.sanitizeSearchQuery(
            `${expense.description || ''} ${expense.category || ''}`
          ).includes(Sanitization.sanitizeSearchQuery(searchQuery))
        )
      );
      // Check if budget notifications need to be triggered
      await BudgetUtils.checkBudgetAndNotify('All');
    } catch (error) {
      console.error('Delete expense failed:', error);
      Alert.alert('Error', 'Failed to delete expense. Please try again.');
    }
  };

  // Filter expenses based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    const sanitizedQuery = Sanitization.sanitizeSearchQuery(query);
    if (!sanitizedQuery) {
      setFilteredExpenses(expenses);
      return;
    }
    const filtered = expenses.filter((expense) =>
      Sanitization.sanitizeSearchQuery(
        `${expense.description || ''} ${expense.category || ''}`
      ).includes(sanitizedQuery)
    );
    setFilteredExpenses(filtered);
  };

  // Clear the search box and reset the list
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredExpenses(expenses);
  };

  // Logout with a friendly confirmation
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Load expenses on mount and when coming back from other screens
  useEffect(() => {
    fetchExpenses();
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.refresh) {
        fetchExpenses();
        navigation.setParams({ refresh: false });
      }
    });
    return unsubscribe;
  }, [navigation, route.params]);

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
      {/* Gradient header with title and action buttons */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Your Expenses</Text>
          <View style={styles.headerActions}>
            {/* Add new expense button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Add Expense')}
            >
              <Plus size={24} color={COLORS.card} />
            </TouchableOpacity>
            {/* Logout button */}
            <TouchableOpacity onPress={handleLogout}>
              <LogOut size={24} color={COLORS.card} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <InputField
          label=""
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search expenses..."
          keyboardType="default"
          icon={<Search size={20} color={COLORS.textLight} />}
          containerStyle={styles.searchInput}
        />
        {/* Show clear button only if there's a search query */}
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>
      {/* List of expenses */}
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
        // Show a friendly message if there are no expenses
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No expenses match your search' : 'No expenses found'}
            </Text>
            {/* Encourage users to add their first expense */}
            {!searchQuery && (
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => navigation.navigate('Add Expense')}
              >
                <Text style={styles.addFirstButtonText}>Add Your First Expense</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
};

// Styles for a modern, clean look
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SIZES.xxl,
    paddingBottom: SIZES.xl,
    paddingHorizontal: SIZES.xl,
    ...SHADOWS.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.card,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.lg,
  },
  addButton: {
    backgroundColor: COLORS.success,
    width: 40,
    height: 40,
    borderRadius: BORDERS.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.xs,
  },
  clearButton: {
    padding: SIZES.sm,
    marginLeft: SIZES.sm,
  },
  searchContainer: {
    padding: SIZES.lg,
    backgroundColor: COLORS.card,
    marginTop: -SIZES.lg,
    borderTopLeftRadius: BORDERS.radius.xl,
    borderTopRightRadius: BORDERS.radius.xl,
    ...SHADOWS.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    marginBottom: 0,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SIZES.lg,
    paddingTop: SIZES.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xxl,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  addFirstButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDERS.radius.md,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    ...SHADOWS.sm,
  },
  addFirstButtonText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.card,
  },
});

export default HomeScreen;