interface DateType {
  year: number;
  month: number;
}

interface DayType extends DateType {
  day: number;
}

type Weely = {
  year: number;
  month: number;
  position: 'prev' | 'next';
};

export const getCurDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return { year, month, day };
};

export const getPrevDate = (date: DayType) => {
  if (date.month === 0) {
    return { year: date.year - 1, month: 11, day: date.day };
  }
  return { year: date.year, month: date.month - 1, day: date.day };
};

export const getNextDate = (date: DayType) => {
  if (date.month === 11) {
    return { year: date.year + 1, month: 0, day: date.day };
  }
  return { year: date.year, month: date.month + 1, day: date.day };
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

export const makeDateKey = ({ year, month, day }: DayType) => {
  return `${year}${convertToMonth(month)}${day}`;
};

// export const makeWeeklyCalendarDate = (
//   date: DayType,
//   arr: DayType[],
// ): DayType[] => {
//   if (arr.length === 14) {
//     return arr;
//   }
//   for (let i = 0; i < 7; i++) {
//     arr.push({ ...date });
//   }
//   return makeWeeklyCalendarDate(arr.slice(-1)[0], arr);
// };

const addDay = (date: DayType, d: number) => {
  const { year, month, day } = date;
  const curLastDate = new Date(year, month + 1, 0).getDate();
  if (day + d > curLastDate) {
    const dd = day + d - curLastDate;
    const mm = month === 11 ? 0 : month + 1;
    const yy = month === 11 ? year + 1 : year;
    return { year: yy, month: mm, day: dd };
  }
  return { year, month, day: day + d };
};

const subDay = (date: DayType, d: number) => {
  const { year, month, day } = date;
  const prevDate = new Date(year, month, 0).getDate();
  if (day === 1) {
    const dd = prevDate + (day - d);
    const mm = month === 0 ? 11 : month - 1;
    const yy = month === 0 ? year - 1 : year;
    return { year: yy, month: mm, day: dd };
  }
  return { year, month, day: day - d };
};

const makeWeeklyCalendarNextTwoDate = (last: DayType) => {
  const next = [];
  for (let i = 1; i <= 14; i++) {
    const date = addDay(last, i);
    next.push(date);
  }
  return next;
};

const makeWeeklyCalendarPrevTwoDate = (first: DayType) => {
  const prev = [];
  for (let i = 1; i <= 14; i++) {
    const date = subDay(first, i);
    prev.unshift(date);
  }
  return prev;
};

export const makeWeeklyCalendarDate = ({ year, month, position }: Weely) => {
  const monthDate = makeCalendarDate({ year, month });
  const first = monthDate[0];
  const last = monthDate[monthDate.length - 1];
  const nextWeekDate = makeWeeklyCalendarNextTwoDate(last);
  const prevWeekDate = makeWeeklyCalendarPrevTwoDate(first);
  return position === 'next'
    ? monthDate.concat(nextWeekDate)
    : prevWeekDate.concat(monthDate);
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
