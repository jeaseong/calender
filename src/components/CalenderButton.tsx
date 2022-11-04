import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

const CalenderButton = ({
  children,
  onPress = () => {},
}: TouchableOpacityProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {},
  text: {
    fontSize: 30,
    color: 'blue',
  },
});

export default CalenderButton;
