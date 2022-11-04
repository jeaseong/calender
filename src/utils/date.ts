interface DateType {
  year: number;
  month: number;
}

interface DayType extends DateType {
  day: number;
}

export const getFirstDayInMonth = ({ year, month }: DateType) => {
  return new Date(year, month - 1, 1).getDay();
};

export const getDayLengthInMonth = ({ year, month }: DateType) => {
  return new Date(year, month - 1, 1).getDate();
};

export const getWeekLengthInMonth = ({ year, month }: DateType) => {
  const dayLength = getDayLengthInMonth({ year, month });
  const firstDay = getFirstDayInMonth({ year, month });
  return Math.ceil((dayLength - (6 - firstDay + 1)) / 7) + 1;
};

export const getCurDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return { year, month, day };
};

export const convertToMonth = (month: number) => {
  switch (month) {
    case 0:
      return 'January';
    case 1:
      return 'February';
    case 2:
      return 'March';
    case 3:
      return 'April';
    case 4:
      return 'May';
    case 5:
      return 'June';
    case 6:
      return 'July';
    case 7:
      return 'August';
    case 8:
      return 'September';
    case 9:
      return 'October';
    case 10:
      return 'November';
    case 11:
      return 'December';
  }
};

export const makeDateKey = ({ month, day }: { month: number; day: number }) => {
  return `${convertToMonth(month)}-${day}`;
};

export const makeCalendarDate = ({ year, month }: DateType) => {
  const prevDate = new Date(year, month, 0).getDate();
  const prevDay = new Date(year, month, 0).getDay();

  const nextDate = new Date(year, month + 1, 0).getDate();
  const nextDay = new Date(year, month + 1, 0).getDay();

  const prev = [];
  if (prevDay !== 6) {
    for (let i = 0; i < prevDay + 1; i++) {
      const date = {
        year,
        month: month - 1,
        day: prevDate - i,
      };
      prev.unshift(date);
    }
  }

  const next = [];
  for (let i = 1; i < 7 - nextDay; i++) {
    if (i === 0) {
      return next;
    }
    const date = {
      year,
      month: month + 1,
      day: i,
    };
    next.push(date);
  }

  const total = [];
  for (let i = 1; i < nextDate + 1; i++) {
    const date = {
      year,
      month,
      day: i,
    };
    total.push(date);
  }
  return prev.concat(total, next);
};

export const isSameDate = (cur: DayType, target: DayType) => {
  return (
    cur.day === target.day &&
    cur.month === target.month &&
    cur.year === target.year
  );
};

export const isNotCurMonth = (cur: number, target: number) => {
  return cur !== target;
};
