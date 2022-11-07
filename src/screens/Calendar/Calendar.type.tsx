export interface DateType {
  month: number;
  day: number;
  year: number;
}

export interface CalendarProps {
  onClickDay: (cur: DateType) => void;
  isClick: DateType;
  date: DateType;
}

export interface CalendarsProps {
  date: DateType;
}

export interface HeaderProps extends CalendarsProps {
  onPressPrev: () => void;
  onPressNext: () => void;
}

export interface CalendarMonthlyProps extends CalendarsProps {
  onChangeDate: (newDate: DateType) => void;
}
