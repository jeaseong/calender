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
  isNotCurMonth,
  getPrevDate,
  getNextDate,
} from '../../utils/date';

import { DateType, CalendarMonthlyProps } from './Calendar.type';
import CalendarDayWeekly from '../../components/CalendarDayWeekly';

const { width: windowWidth } = Dimensions.get('window');

const CalendarWeeklyScreen = (props: CalendarMonthlyProps) => {
  const { date, onChangeDate } = props;

  const weeklyDate = makeCalendarDate({ year: date.year, month: date.month });
  const length = weeklyDate.length;
  const flatListRef = useRef<FlatList>();

  const onReachEnd = () => {
    const next = getNextDate(date);
    onChangeDate(next);
  };

  const onEndMove = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const widthFromStart = e.nativeEvent.contentOffset.x;
    if (widthFromStart < windowWidth) {
      const prev = getPrevDate(date);
      onChangeDate(prev);

      flatListRef.current.scrollToIndex({
        animated: false,
        index: length - 1,
      });
    }
  };
  const renderDates = (item: DateType) => {
    return (
      <CalendarDayWeekly
        isCur={isNotCurMonth(item.month, date.month)}
        key={makeDateKey({
          year: item.year,
          month: item.month,
          day: item.day,
        })}
      >
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
      onEndReachedThreshold={0.01}
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
