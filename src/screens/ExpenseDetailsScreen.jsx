import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Edit2, Trash2, ArrowLeft, DollarSign, Tag, Calendar, FileText } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SHADOWS, BORDERS } from '../constants/theme';
import { getExpense, deleteExpense } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const ExpenseDetailsScreen = ({ navigation, route }) => {
  const { expenseId } = route.params;
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const data = await getExpense(expenseId);
        setExpense(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load expense details.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [expenseId]);

  const handleDelete = async () => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${expense?.description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteExpense(expenseId);
              navigation.goBack();
              Alert.alert('Success', 'Expense deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Expense not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.card} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Details</Text>
        <View style={{ width: 24 }} /> // Spacer for alignment
      </LinearGradient> */}

      <View style={styles.card}>
        <View style={styles.detailItem}>
          <View style={styles.iconContainer}>
            <FileText size={20} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{expense.description}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailItem}>
          <View style={styles.iconContainer}>
            <DollarSign size={20} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={[styles.detailValue, styles.amountText]}>
              RWF {expense.amount.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailItem}>
          <View style={styles.iconContainer}>
            <Tag size={20} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>
              {expense.category || 'Uncategorized'}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailItem}>
          <View style={styles.iconContainer}>
            <Calendar size={20} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {new Date(expense.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color={COLORS.card} />
          ) : (
            <>
              <Trash2 size={20} color={COLORS.card} />
              <Text style={styles.actionButtonText}>Delete</Text>
            </>
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SIZES.xxl,
    paddingBottom: SIZES.lg,
    paddingHorizontal: SIZES.lg,
    ...SHADOWS.sm,
  },
  backButton: {
    padding: SIZES.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.card,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SIZES.xxl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDERS.radius.lg,
    margin: SIZES.lg,
    padding: SIZES.lg,
    ...SHADOWS.md,
  },
  detailItem: {
    flexDirection: 'row',
    marginVertical: SIZES.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDERS.radius.round,
    backgroundColor: COLORS.primaryLighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    marginBottom: SIZES.xs,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  amountText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: BORDERS.radius.md,
    marginHorizontal: SIZES.xs,
    ...SHADOWS.xs,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: COLORS.card,
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginLeft: SIZES.xs,
  },
});

export default ExpenseDetailsScreen;