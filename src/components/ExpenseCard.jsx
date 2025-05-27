import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Trash2, ChevronRight } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SHADOWS, BORDERS } from '../constants/theme';

const ExpenseCard = ({ expense, onPress, onDelete }) => {
  const isOverbudget = expense.amount > (expense.budgetLimit || Infinity);

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${expense.description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(expense.id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardContent}>
        {/* Left side: category and text */}
        <View style={styles.leftContent}>
          <View style={[
            styles.categoryIcon,
            { backgroundColor: isOverbudget ? COLORS.error + '20' : COLORS.success + '20' }
          ]}>
            <Text style={[
              styles.categoryText,
              { color: isOverbudget ? COLORS.error : COLORS.success }
            ]}>
              {expense.category?.charAt(0)?.toUpperCase() || 'E'}
            </Text>
          </View>
          <View style={styles.textContent}>
            <Text style={styles.description} numberOfLines={1}>
              {expense.description || 'No description'}
            </Text>
            <Text style={styles.category}>
              {expense.category || '-empty-'}
            </Text>
          </View>
        </View>

        {/* Right side: amount and date */}
        <View style={styles.rightContent}>
          <Text style={[
  styles.amount,
  { color: isOverbudget ? COLORS.error : COLORS.text }
]}>
  RWF {(expense.amount ?? 0).toLocaleString()}
</Text>
          <Text style={styles.date}>
            {new Date(expense.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Chevron */}
        <ChevronRight size={20} color={COLORS.textLight} style={styles.chevron} />

        {/* Subtle delete button */}
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash2 size={18} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.xs,
    borderRadius: BORDERS.radius.lg,
    backgroundColor: COLORS.card,
    ...SHADOWS.sm,
  },
  cardContent: {
    padding: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDERS.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  categoryText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  textContent: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  rightContent: {
    alignItems: 'flex-end',
    marginLeft: SIZES.sm,
  },
  amount: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textLighter,
  },
  chevron: {
    marginLeft: SIZES.sm,
  },
  deleteButton: {
    marginLeft: SIZES.sm,
    padding: SIZES.sm,
    borderRadius: BORDERS.radius.sm,
    backgroundColor: COLORS.transparent,
  },
});

export default ExpenseCard;
