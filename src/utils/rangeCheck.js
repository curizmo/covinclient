import { RangeCheck, COLOR_CODE } from '../constants';

const mapColors = (vitalCheck, list) => {
  let vitalInfoStats = vitalCheck;
  const { current } = list[1];
  let color = [];
  function between(x, valueRange) {
    const { min, max } = valueRange || {};
    return x >= min && x <= max;
  }

  current.map((currentValue) => {
    if (list[0] === 'Blood Pressure') {
      vitalInfoStats = vitalCheck[currentValue?.label];
    }
    if (between(currentValue?.value, vitalInfoStats?.Elevated)) {
      color.push(COLOR_CODE.moderateRisk);
    } else if (between(currentValue?.value, vitalInfoStats?.Normal)) {
      color.push(COLOR_CODE.mildRisk);
    } else if (
      vitalInfoStats?.High?.max >= currentValue?.value ||
      between(currentValue?.value, vitalInfoStats?.High)
    ) {
      color.push(COLOR_CODE.highRisk);
    } else if (vitalInfoStats?.Normal?.min >= currentValue?.value) {
      color.push(COLOR_CODE.mildRisk);
    }
    return null;
  });
  return color;
};

const rangeColor = (list) => {
  let vitalCheck = RangeCheck[list[0]];
  const mapRangeToVitals = mapColors(vitalCheck, list);
  return mapRangeToVitals;
};

export const rangeCheck = (list) => {
  const rangeColorState = rangeColor(list);
  return rangeColorState;
};
