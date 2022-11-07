import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { convertToMonth, getCurDate } from '../../utils/date';
import CalendarMonthlyScreen from './CalendarMonthlyScreen';

import CalenderButton from '../../components/CalenderButton';
import CalendarWeeklyScreen from './CalendarWeeklyScreen';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { WEEK, MONTHLY, WEEKLY } from '../../utils/constant';

import { DateType, HeaderProps } from './Calendar.type';

const Week = () => {
  return (
    <View style={styles.week}>
      {WEEK.map((item) => (
        <Text key={item.day}>{item.day}</Text>
      ))}
    </View>
  );
};

const Header = (props: HeaderProps) => {
  const { date, onPressPrev, onPressNext } = props;
  return (
    <View style={styles.header}>
      <CalenderButton onPress={onPressPrev}>&lt;</CalenderButton>
      <Text>
        {convertToMonth(date.month)} {date.year}
      </Text>
      <CalenderButton onPress={onPressNext}>&gt;</CalenderButton>
    </View>
  );
};

const CalendarScreen = () => {
  const curDate = getCurDate();
  const [date, setDate] = useState(curDate);
  const [bit, setBit] = useState(true);

  const offsetHeight = useSharedValue(320);

  const mode = useSharedValue(true);
  const offsetMode = useDerivedValue(() => {
    return mode.value;
  }, [mode]);

  const onPressNext = () => {
    setDate((cur) => {
      if (cur.month === 11) {
        return {
          ...cur,
          year: cur.year + 1,
          month: 0,
        };
      }
      return {
        ...cur,
        month: cur.month + 1,
      };
    });
  };

  const onPressPrev = () => {
    setDate((cur) => {
      if (cur.month === 0) {
        return {
          ...cur,
          year: cur.year - 1,
          month: 11,
        };
      }
      return {
        ...cur,
        month: cur.month - 1,
      };
    });
  };

  const onChangeDate = (newDate: DateType) => {
    setDate(newDate);
  };

  const calendarProps = {
    date,
    onChangeDate,
  };
  const headerProps = {
    date,
    onPressNext,
    onPressPrev,
  };

  const gesture = Gesture.Pan()
    .onChange((e) => {
      if (e.changeY) {
        offsetHeight.value += e.changeY;
      }
    })
    .onEnd((e) => {
      if (e.translationY < 0) {
        offsetHeight.value = 50;
        mode.value = WEEKLY;
      } else {
        offsetHeight.value = 320;
        mode.value = MONTHLY;
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(offsetHeight.value, {
        duration: 700,
      }),
    };
  });

  const RenderCalendar = ({ bit }: { bit: any }) => {
    return bit ? (
      <CalendarMonthlyScreen {...calendarProps} />
    ) : (
      <CalendarWeeklyScreen {...calendarProps} />
    );
  };
  return (
    <View>
      <Header {...headerProps} />
      <Week />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.change, animatedStyle]}>
          <RenderCalendar bit={offsetMode.value} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
    paddingHorizontal: 20,
  },

  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  change: {
    borderColor: 'black',
    borderBottomWidth: 1,
    height: 320,
    overflow: 'hidden',
  },
});

export default CalendarScreen;
