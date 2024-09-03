import moment, { Moment } from 'moment';

export const NOW = moment();

export const getMonthStartDay = (date: Moment) => date.startOf('month');

export const getMonthEndDay = (date: Moment) => date.endOf('month');

export const checkCurrentMonth = (date: Moment) => date.isSame(NOW, 'month');

export const checkCurrentYear = (date: Moment) => date.isSame(NOW, 'year');

export const formatMonthYearDate = (date: Moment) =>
  checkCurrentYear(date) ? date.format('MMMM') : date.format('MMMM YYYY');

export const formatDateHourFull = (date: Moment) => date.format('DD/MM/YYYY HH:mm:ss');

export const formatDate = (date: Moment) => date.format('DD [de] MMMM [de] YYYY');
