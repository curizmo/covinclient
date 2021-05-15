const RangeCheck = {
  temperature: {
    High: { min: 104, max: 109.9 },
    Elevated: { min: 100, max: 103.9 },
    Normal: { min: 95, max: 99 },
  },
  oxygenLevel: {
    Normal: { min: 95, max: 100 },
    Elevated: { min: 90, max: 92 },
    High: { min: 0, max: 90 },
  },
  pulseRate: {
    High: { min: 100, max: 120 },
    Elevated: { min: 0, max: 60 },
    Normal: { min: 60, max: 100 },
  },
  bloodPressure: {
    lowBloodPressure: {
      Normal: { min: 0, max: 120 },
      Elevated: { min: 120, max: 139 },
      High: { min: 140, max: 180 },
    },
    highBloodPressure: {
      Normal: { min: 0, max: 80 },
      Elevated: { min: 80, max: 89 },
      High: { min: 90, max: 130 },
    },
  },
  respiratoryRate: {
    Normal: { min: 0, max: 10 },
    Elevated: { min: 11, max: 16 },
    High: { min: 17, max: 24 },
  },
};

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

const rangeCheck = (list) => {
  const rangeColorState = rangeColor(list);
  return rangeColorState;
};

export default rangeCheck;
