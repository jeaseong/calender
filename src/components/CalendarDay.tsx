import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextProps,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface Props extends TextProps {
  style?: StyleProp<ViewStyle>;
  isCur: boolean;
}

const CalendarDay = ({ children, onPress = () => {}, style, isCur }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn}>
      <Text style={[styles.text, isCur && styles.isNotCur, style]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { width: '14.2%', height: 50, padding: 9 },
  text: {
    fontSize: 16,
    lineHeight: 30,
    textAlign: 'center',
  },
  isNotCur: {
    color: '#C9C9C9',
  },
});

export default CalendarDay;
