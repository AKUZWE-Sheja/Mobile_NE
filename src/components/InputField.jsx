import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES, BORDERS, SHADOWS } from '../constants/theme';
import { Eye, EyeOff } from 'lucide-react-native';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType,
  secureTextEntry,
  icon,
  containerStyle,
  ...props
}) => {
  const [isSecure, setIsSecure] = React.useState(secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, error && styles.errorContainer]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLighter}
          keyboardType={keyboardType}
          secureTextEntry={isSecure}
          selectionColor={COLORS.primaryLight}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsSecure(!isSecure)}
          >
            {isSecure ? (
              <EyeOff size={20} color={COLORS.textLight} />
            ) : (
              <Eye size={20} color={COLORS.textLight} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 0,
    // borderColor: COLORS.border,
    borderRadius: BORDERS.radius.md,
    paddingHorizontal: SIZES.sm,
    ...SHADOWS.xs,
  },
  input: {
    flex: 1,
    paddingVertical: SIZES.sm,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    minHeight: 48,
  },
  inputWithIcon: {
    marginLeft: SIZES.sm,
  },
  iconContainer: {
    justifyContent: 'center',
  },
  eyeIcon: {
    padding: SIZES.xs,
    marginLeft: SIZES.xs,
  },
  errorContainer: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginTop: SIZES.xs,
    marginLeft: SIZES.xs,
  },
});

export default InputField;