const moment = require('moment');

export const severePreferences = {
  lineColor: '#FF3636',
  showCircleOnLines: false,
  showAxisX: false,
  showAxisY: false,
  maxRangeMultiplier: 1.5,
  showTooltip: false,
};
export const moderatePreferences = {
  lineColor: '#FFC636',
  showCircleOnLines: false,
  showAxisX: false,
  showAxisY: false,
  maxRangeMultiplier: 1.5,
  showTooltip: false,
};
export const mildPreferences = {
  lineColor: '#99BEE9',
  showCircleOnLines: false,
  showAxisX: false,
  showAxisY: false,
  maxRangeMultiplier: 1.5,
  showTooltip: false,
};

export const getDate = () => {
  var d = new Date(),
    minutes =
      d.getMinutes().toString().length === 1
        ? '0' + d.getMinutes()
        : d.getMinutes(),
    hours =
      d.getHours().toString().length === 1 ? '0' + d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am',
    months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
  return (
    d.getDate() +
    ' ' +
    months[d.getMonth()] +
    ', ' +
    d.getFullYear() +
    ' ' +
    hours +
    ':' +
    minutes +
    ' ' +
    ampm
  );
};

export const setDate = (date) => {
  return date ? moment(date).format('LL') : '';
};

export const setDateTime = (date) => {
  return date ? moment(date).format('MMMM Do YYYY, h:mm:ss a') : '';
};
