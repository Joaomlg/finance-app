import moment, { Moment } from 'moment';

export const NOW = moment();

export const checkCurrentMonth = (date: Moment) => date.isSame(NOW, 'month');

export const checkCurrentYear = (date: Moment) => date.isSame(NOW, 'year');

export const formatMonthYearDate = (date: Moment) =>
  checkCurrentYear(date) ? date.format('MMMM') : date.format('MMMM YYYY');
