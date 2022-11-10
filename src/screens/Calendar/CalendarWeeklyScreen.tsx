import React, { useRef, useState } from 'react';
import {
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import {
  makeWeeklyCalendarDate,
  makeDateKey,
  isNotCurMonth,
  getPrevDate,
  getNextDate,
} from '../../utils/date';

import { DateType, CalendarMonthlyProps } from './Calendar.type';
import CalendarDayWeekly from '../../components/CalendarDayWeekly';

const { width: windowWidth } = Dimensions.get('window');

type PositionType = 'prev' | 'next';

const CalendarWeeklyScreen = (props: CalendarMonthlyProps) => {
  const { date, onChangeDate } = props;

  const [position, setPosition] = useState<PositionType>('prev');

  const weeklyDate = makeWeeklyCalendarDate({
    year: date.year,
    month: date.month,
    position,
  });

  const flatListRef = useRef<FlatList>();

  const onReachEnd = () => {
    const next = getNextDate(date);
    setPosition('prev');
    onChangeDate(next);
  };

  const onEndMove = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const widthFromStart = e.nativeEvent.contentOffset.x;
    if (widthFromStart < windowWidth) {
      const prev = getPrevDate(date);
      setPosition('prev');
      onChangeDate(prev);

      flatListRef.current.scrollToIndex({
        animated: false,
        index: 35,
      });
    }
  };
  const renderDates = (item: DateType) => {
    const isCurMonth = isNotCurMonth(item.month, date.month);
    const key = makeDateKey({
      year: item.year,
      month: item.month,
      day: item.day,
    });
    return (
      <CalendarDayWeekly isCur={isCurMonth} key={key}>
        {item.day}
      </CalendarDayWeekly>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={weeklyDate}
      initialScrollIndex={14}
      horizontal
      pagingEnabled
      bounces
      showsHorizontalScrollIndicator={false}
      onEndReached={onReachEnd}
      // onEndReachedThreshold={0.01}
      onMomentumScrollEnd={onEndMove}
      getItemLayout={(_, index) => ({
        length: windowWidth / 7,
        offset: (windowWidth / 7) * index,
        index,
      })}
      renderItem={({ item }) => renderDates(item)}
    />
  );
};

export default CalendarWeeklyScreen;
