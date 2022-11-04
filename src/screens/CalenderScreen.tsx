import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  calendar: DateType[];
  onClickDay: (cur: DateType) => void;
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
        <Text>{item.day}</Text>
      ))}
    </View>
  );
};

const Calendar = (props: CalendarProps) => {
  const { calendar, onClickDay, isClick, date } = props;
  return (
    <View style={styles.days}>
      {calendar.map((item) => (
        <CalendarDay
          onPress={() => onClickDay(item)}
          style={[isSameDate(isClick, item) && styles.border]}
          isCur={isNotCurMonth(item.month, date.month)}
          key={makeDateKey({ month: item.month, day: item.day })}
        >
          {item.day}
        </CalendarDay>
      ))}
    </View>
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
  const calendar = makeCalendarDate({ year: date.year, month: date.month });

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

  const headerProps = {
    date,
    onPressNext,
    onPressPrev,
  };

  const calendarProps = {
    calendar,
    onClickDay,
    isClick,
    date,
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
  },
  border: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: 'blue',
  },
});

export default CalenderScreen;
