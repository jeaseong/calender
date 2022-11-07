import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import CalendarDay from '../../components/CalendarDay';

import {
  makeCalendarDate,
  makeDateKey,
  isSameDate,
  isNotCurMonth,
  getPrevDate,
  getNextDate,
} from '../../utils/date';

import { CALENDAR_PADDING } from '../../utils/constant';

import {
  CalendarProps,
  CalendarsProps,
  DateType,
  CalendarMonthlyProps,
} from './Calendar.type';

const { width: windowWidth } = Dimensions.get('window');

const Calendar = (props: CalendarProps) => {
  const { onClickDay, isClick, date } = props;

  const calendar = useMemo(
    () =>
      makeCalendarDate({
        year: date.year,
        month: date.month,
      }),
    [date],
  );

  const renderDates = (item: DateType) => {
    return (
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
    );
  };

  return (
    <FlatList
      contentContainerStyle={styles.days}
      data={calendar}
      numColumns={7}
      renderItem={({ item }) => renderDates(item)}
      keyExtractor={(item) =>
        makeDateKey({
          year: item.year,
          month: item.month,
          day: item.day,
        })
      }
      scrollEnabled={false}
    />
  );
};

const Calendars = (props: CalendarsProps) => {
  const { date } = props;

  const prevDate = getPrevDate(date);
  const nextDate = getNextDate(date);

  const [isClick, setIsClick] = useState<DateType>({
    year: 0,
    month: 0,
    day: 0,
  });

  // 여기서 스와이프 방향에 따라서 플래그를 설정해서 함수를 호출하면 되지 않을까 MonthCalendar를 호출할지 WeeklyCalendar를 호출할지

  const RenderCalendar = (props: CalendarsProps) => {
    const { date: curDate } = props;

    const onClickDay = (cur: { year: number; month: number; day: number }) => {
      setIsClick(cur);
    };

    const calendarProps = {
      onClickDay,
      isClick,
      date: curDate,
    };

    return <Calendar {...calendarProps} />;
  };

  return (
    <View style={styles.carousel}>
      <RenderCalendar date={prevDate} />
      <RenderCalendar date={date} />
      <RenderCalendar date={nextDate} />
    </View>
  );
};

const CalendarMonthlyScreen = (props: CalendarMonthlyProps) => {
  const { date, onChangeDate } = props;
  const scrollRef = useRef<ScrollView>(null);
  const [layoutWidth, setLayoutWidth] = useState(windowWidth);

  const scrollToMiddleCalendar = () => {
    scrollRef.current?.scrollTo({
      x: layoutWidth - CALENDAR_PADDING,
      animated: false,
    });
  };

  const scrollEffect = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xValue = Math.ceil(e.nativeEvent.contentOffset.x);
    const maxLayoutFloor = Math.floor(layoutWidth - CALENDAR_PADDING) * 2;
    const prevMonth = getPrevDate(date);
    const nextMonth = getNextDate(date);

    if (!layoutWidth || layoutWidth === 1) {
      return;
    }
    if (scrollRef && scrollRef.current) {
      if (xValue === 0) {
        scrollToMiddleCalendar();
        onChangeDate(prevMonth);
      } else if (xValue === maxLayoutFloor) {
        scrollToMiddleCalendar();
        onChangeDate(nextMonth);
      }
    }
  };

  const calendarsProp = {
    date,
  };

  return (
    <SafeAreaView
      style={[styles.container]}
      onLayout={(e) => {
        setLayoutWidth(e.nativeEvent.layout.width);
        scrollToMiddleCalendar();
      }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        contentOffset={{ x: layoutWidth, y: 0 }}
        ref={scrollRef}
        onMomentumScrollEnd={scrollEffect}
        showsHorizontalScrollIndicator={false}
      >
        <Calendars {...calendarsProp} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
    paddingHorizontal: 20,
  },
  scrollView: {},
  carousel: {
    flexDirection: 'row',
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
  days: {
    width: windowWidth - CALENDAR_PADDING,
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

export default CalendarMonthlyScreen;
