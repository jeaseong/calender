import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import CalenderButton from '../components/CalenderButton';
import CalendarDay from '../components/CalendarDay';

import {
  getCurDate,
  makeCalendarDate,
  convertToMonth,
  makeDateKey,
  isSameDate,
  isNotCurMonth,
  getPrevDate,
  getNextDate,
} from '../utils/date';

import { WEEK, CALENDAR_PADDING } from '../utils/constant';

const { width: windowWidth } = Dimensions.get('window');

interface DateType {
  month: number;
  day: number;
  year: number;
}

interface HeaderProps {
  curDate: DateType;
  onPressPrev: () => void;
  onPressNext: () => void;
}

interface CalendarProps {
  onClickDay: (cur: DateType) => void;
  isClick: DateType;
  curDate: DateType;
}

interface RenderCalendarProps {
  curDate: DateType;
}

interface CalendarsProps {
  date: DateType;
  onPressPrev: () => void;
  onPressNext: () => void;
}

const Header = (props: HeaderProps) => {
  const { curDate, onPressPrev, onPressNext } = props;
  return (
    <View style={styles.header}>
      <CalenderButton onPress={onPressPrev}>&lt;</CalenderButton>
      <Text>
        {convertToMonth(curDate.month)} {curDate.year}
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
  const { onClickDay, isClick, curDate } = props;

  const calendar = useMemo(
    () =>
      makeCalendarDate({
        year: curDate.year,
        month: curDate.month,
      }),
    [curDate],
  );

  const renderDates = (item: DateType) => {
    return (
      <CalendarDay
        onPress={() => onClickDay(item)}
        style={[isSameDate(isClick, item) && styles.border]}
        isCur={isNotCurMonth(item.month, curDate.month)}
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

  const RenderCalendar = (props: RenderCalendarProps) => {
    const { curDate } = props;

    const onClickDay = (cur: { year: number; month: number; day: number }) => {
      setIsClick(cur);
    };

    const calendarProps = {
      onClickDay,
      isClick,
      curDate,
    };

    return <Calendar {...calendarProps} />;
  };

  return (
    <View style={styles.carousel}>
      <RenderCalendar curDate={prevDate} />
      <RenderCalendar curDate={date} />
      <RenderCalendar curDate={nextDate} />
    </View>
  );
};

const MonthCalender = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [layoutWidth, setLayoutWidth] = useState(windowWidth);
  const curDate = getCurDate();
  const [date, setDate] = useState(curDate);

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
        setDate(prevMonth);
      } else if (xValue === maxLayoutFloor) {
        scrollToMiddleCalendar();
        setDate(nextMonth);
      }
    }
  };

  const calendarsProp = {
    date,
    onPressNext,
    onPressPrev,
  };
  const headerProps = {
    curDate: date,
    onPressNext,
    onPressPrev,
  };

  return (
    <SafeAreaView
      style={[styles.container]}
      onLayout={(e) => {
        setLayoutWidth(e.nativeEvent.layout.width);
        scrollToMiddleCalendar();
      }}
    >
      <Header {...headerProps} />
      <Week />

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

const CalendarScreen = () => {
  return <MonthCalender />;
};

const styles = StyleSheet.create({
  container: {
    height: 420,
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

export default CalendarScreen;
