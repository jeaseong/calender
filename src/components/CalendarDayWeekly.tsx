import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextProps,
  ViewStyle,
  StyleProp,
  Dimensions,
} from 'react-native';

const { width: windowWidth } = Dimensions.get('window');

interface Props extends TextProps {
  style?: StyleProp<ViewStyle>;
  isCur?: boolean;
}

const CalendarDayWeekly = ({
  children,
  onPress = () => {},
  style,
  isCur,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn}>
      <Text style={[styles.text, isCur && styles.isNotCur, style]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { width: windowWidth / 7, padding: 9 },

  text: {
    fontSize: 16,
    lineHeight: 30,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  isNotCur: {},
});

export default CalendarDayWeekly;
