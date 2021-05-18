import { RangeCheck } from '../constants';

const mapColors = (vitalCheck, list) => {
  let vitalInfoStats = vitalCheck;
  const { current } = list[1];
  let color = [];
  function between(x, valueRange) {
    const { min, max } = valueRange;
    return x >= min && x <= max;
  }

  current.map((currentValue) => {
    if (list[0] === 'bloodPressure') {
      vitalInfoStats = vitalCheck[currentValue?.label];
    }
    if (between(currentValue?.value, vitalInfoStats?.Elevated)) {
      color.push('#e5881b');
    } else if (between(currentValue?.value, vitalInfoStats?.Normal)) {
      color.push('#5EB16A');
    } else if (
      vitalInfoStats.High?.max >= currentValue?.value ||
      between(currentValue?.value, vitalInfoStats?.High)
    ) {
      color.push('#eb2f2f');
    } else if (vitalInfoStats.Normal?.min >= currentValue?.value) {
      color.push('#5EB16A');
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
