import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import CalenderButton from '../components/CalenderButton';
import CalendarDay from '../components/CalendarDay';

import {
  getCurDate,
  makeCalendarDate,
  convertToMonth,
  makeDateKey,
  isSameDate,
  isNotCurMonth,
} from '../utils/date';
import { validHeight } from '../utils/utils';
import { WEEK } from '../utils/constant';

interface DateType {
  month: number;
  day: number;
  year: number;
}

interface HeaderProps {
  date: DateType;
  onPressPrev: () => void;
  onPressNext: () => void;
}

interface CalendarProps {
  onClickDay: (cur: DateType) => void;
  changeDate: () => void;
  isClick: DateType;
  date: DateType;
}

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

const Week = () => {
  return (
    <View style={styles.week}>
      {WEEK.map((item) => (
        <Text key={item.day}>{item.day}</Text>
      ))}
    </View>
  );
};

const Calendar = (props: CalendarProps) => {
  const [layoutHeight, setLayoutHeight] = useState(250);
  const { onClickDay, isClick, date, changeDate } = props;

  const isWeekCalendar = useSharedValue(false);
  const calendarHeight = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    setLayoutHeight(height);
  };

  const calendar = makeCalendarDate({ year: date.year, month: date.month });
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height:
        calendarHeight.value <= 250
          ? withTiming(calendarHeight.value, { duration: 100 })
          : 250,
    };
  }, []);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      console.log(calendarHeight.value);
    })
    .onChange((e) => {
      calendarHeight.value += e.changeY;
    })
    .onEnd(() => {});

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View onLayout={onLayout} style={[styles.days, animatedStyles]}>
        {calendar.map((item) => (
          <CalendarDay
            onPress={() => onClickDay(item)}
            style={[isSameDate(isClick, item) && styles.border]}
            isCur={isNotCurMonth(item.month, date.month)}
            key={makeDateKey({
              year: item.year,
              month: item.month,
              day: item.day,
            })}
          >
            {item.day}
          </CalendarDay>
        ))}
      </Animated.View>
    </GestureDetector>
  );
};

const CalenderScreen = () => {
  const curDate = getCurDate();
  const [date, setDate] = useState(curDate);
  const [isClick, setIsClick] = useState<DateType>({
    year: 0,
    month: 0,
    day: 0,
  });

  const onClickDay = (cur: { year: number; month: number; day: number }) => {
    setIsClick(cur);
  };

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

  const changeDate = () => {
    setDate((cur) => ({ ...cur, month: cur.month + 1 }));
  };

  const headerProps = {
    date,
    onPressNext,
    onPressPrev,
  };

  const calendarProps = {
    onClickDay,
    isClick,
    date,
    changeDate,
  };

  return (
    <View style={styles.container}>
      <Header {...headerProps} />
      <Week />
      <Calendar {...calendarProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  sun: {
    color: 'red',
  },
  say: {
    color: 'blue',
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  border: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: 'blue',
  },
  check: {
    color: 'blue',
  },
});

export default CalenderScreen;
