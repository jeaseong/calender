import React, { memo, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { convertToMonth, getCurDate } from '../../utils/date';
import CalendarMonthlyScreen from './CalendarMonthlyScreen';

import CalenderButton from '../../components/CalenderButton';
import CalendarWeeklyScreen from './CalendarWeeklyScreen';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
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
  const [mode, setMode] = useState(true);
  console.log(mode);

  const offsetHeight = useSharedValue(320);

  const offsetMode = useSharedValue(true);

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

  const onChageWeekly = () => {
    setMode(false);
  };

  const onChageMonthly = () => {
    setMode(true);
  };

  const calendarProps = useMemo(
    () => ({
      date,
      onChangeDate,
    }),
    [date],
  );
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
        runOnJS(onChageWeekly)();
      } else {
        offsetHeight.value = 320;
        runOnJS(onChageMonthly)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(offsetHeight.value, {
        duration: 700,
      }),
    };
  });

  // 이렇게 넘기면 왜 렌더링이 일어날까..
  // const RenderCalendar = memo(({ bit }: { bit: any }) => {
  //   return bit ? (
  //     <CalendarMonthlyScreen {...calendarProps} />
  //   ) : (
  //     <CalendarWeeklyScreen {...calendarProps} />
  //   );
  // });

  return (
    <View>
      <Header {...headerProps} />
      <Week />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.change, animatedStyle]}>
          {mode ? (
            <CalendarMonthlyScreen {...calendarProps} />
          ) : (
            <CalendarWeeklyScreen {...calendarProps} />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
  },

  week: {
    flexDirection: 'row',

    justifyContent: 'space-around',
    paddingHorizontal: 20,
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
