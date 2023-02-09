import moment, { Moment } from 'moment';

export const NOW = moment();

export const isCurrentMonth = (date: Moment) => date.isSame(NOW, 'month');

export const isCurrentYear = (date: Moment) => date.isSame(NOW, 'year');

export const formatMonthYearDate = (date: Moment) =>
  isCurrentYear(date) ? date.format('MMMM') : date.format('MMMM YYYY');
