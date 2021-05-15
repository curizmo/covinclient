var preferences = [
  {
    key: 'showAxisY',
    default: true,
    description: 'Show/Hide Y axis',
    type: 'boolean',
    category: 'axis',
    tags: ['axis', 'yaxis', 'color'],
  },
  {
    key: 'showAxisX',
    default: true,
    description: 'Show/Hide X axis',
    type: 'boolean',
    category: 'axis',
    tags: ['axis', 'xaxis', 'color'],
  },
  {
    key: 'axisXLines',
    default: false,
    description: 'Show X Axis Lines',
    type: 'boolean',
    category: 'axis',
    tags: ['axis', 'xaxis', 'color'],
  },
  {
    key: 'dashedYAxis',
    default: false,
    description: 'Controls the YAxis line to be dashed on normal line',
    type: 'boolean',
    category: 'axis',
    tags: ['axis', 'yaxis'],
  },
  {
    key: 'xAxisFontSize',
    default: undefined,
    description: 'X axis font-size',
    type: 'pixels',
    category: 'axis',
    tags: ['axis', 'yaxis'],
  },
  {
    key: 'yAxisFontSize',
    default: undefined,
    description: 'Y axis font-size',
    type: 'pixels',
    category: 'axis',
    tags: ['axis', 'yaxis'],
  },
  {
    key: 'yAxisDomainFactor',
    default: 1,
    type: 'float',
    description: 'Controls the y axis top padding of the chart.',
    range: [1, 5],
    category: 'axis',
    tags: ['axis', 'yaxis'],
  },
  {
    key: 'xScalePaddingOuter',
    default: 0,
    description: 'Controls the x axis left/right padding of the chart.',
    type: 'number',
    category: 'axis',
    tags: ['axis', 'xaxis'],
  },
  // {
  //   key: 'xAxisTitle',
  //   default: undefined,
  //   description: 'X-axis title',
  //   type: 'string',
  //   category: 'axis',
  //   tags: ['axis', 'xaxis'],
  // },
  // {
  //   key: 'yAxisTitle',
  //   default: undefined,
  //   description: 'Y-axis title',
  //   type: 'string',
  //   category: 'axis',
  //   tags: ['axis', 'xaxis'],
  // },
  {
    key: 'xAxisMinLabelLength',
    default: undefined,
    description: 'Controls the min no of characters on the X-axis labels',
    note: 'xAxisMinLabelLength, if specified, takes preference over xAxisMaxLabelLength',
    type: 'number',
    category: 'axis',
    tags: ['axis', 'xaxis'],
  },
  {
    key: 'xAxisMaxLabelLength',
    default: undefined,
    description: 'Controls the max no of characters on the X-axis labels',
    note: 'xAxisMinLabelLength, if specified, takes preference over xAxisMaxLabelLength',
    type: 'number',
    category: 'axis',
    tags: ['axis', 'xaxis'],
  },
  {
    key: 'yAxisColor',
    default: undefined,
    description: 'Changes the color of Y-axis labels',
    type: 'string',
    category: 'axis',
    tags: ['axis', 'yaxis'],
  },
  {
    key: 'xAxisColor',
    default: undefined,
    description: 'Changes the color of X-axis labels',
    type: 'string',
    category: 'axis',
    tags: ['axis', 'xaxis', 'color'],
  },
  // {
  //   key: 'yAxisMaxLabelLength',
  //   default: undefined,
  //   description: 'Controls the max no of characters on the Y-axis labels',
  //   type: 'number',
  //   category: 'axis',
  //   tags: ['axis', 'yaxis'],
  // },
  {
    key: 'minRangeMultiplier',
    default: 1,
    type: 'number',
    description:
      'Controls the min value Range of the graph (used when -ve value ranges are realtively small).',
    category: 'axis',
    tags: ['axis', 'yaxis'],
  },
  {
    key: 'maxRangeMultiplier',
    default: 1,
    type: 'number',
    description:
      'Controls the max value Range of the graph (used when +ve value ranges are relatively small) .',
    category: 'axis',
    tags: ['axis', 'yaxis'],
  },
];

preferences.forEach(function (pref) {
  if (pref.category == undefined) {
    pref.category = 'axis';
  }
});

var preferences$1 = [
  {
    key: 'arcFontSize',
    default: undefined,
    description: 'fontsize within the arc',
    type: 'pixels',
    category: 'radial',
    tags: [''],
  },
  {
    key: 'innerRadiusAsFactor',
    default: undefined,
    description: 'calculates inner radius as a factor of radius',
    range: [0, 1],
    category: 'radial',
    tags: ['radius'],
  },
  {
    key: 'radiusFactor',
    default: undefined,
    description:
      'evaluates the change factor against the radii of the outer circle',
    type: 'number',
    category: 'radial',
    tags: [],
  },
  {
    key: 'radius',
    default: undefined,
    description: 'Evaluates overall radius',
    type: 'number',
    category: 'radial',
    tags: ['radius'],
  },
  {
    key: 'barWidth',
    default: undefined,
    description: 'Evaluates width of the arc',
    type: 'number',
    category: 'radial',
    tags: [],
  },
  {
    key: 'showBackground',
    default: true,
    description: 'show/hide background rings for radial graphs ',
    type: 'boolean',
    category: 'radial',
    tags: [],
  },
];

preferences$1.forEach(function (pref) {
  if (pref.category == undefined) {
    pref.category = 'radial';
  }
});

var preferences$2 = [
  {
    key: 'hideCenterValue',
    default: false,
    description: 'Center value display ',
    type: 'boolean',
    category: 'centerValue',
    tags: ['centerValue'],
  },
  {
    key: 'centerValueFontSize',
    default: null,
    description: 'fontsize of the center value ',
    type: 'pixels',
    category: 'centerValue',
    tags: ['centerValue'],
  },
  {
    key: 'offsetCenterY',
    default: null,
    description: 'Move center Y by fraction of Height',
    type: 'pixels',
    category: 'centerValue',
    tags: ['centerValue'],
  },
  {
    key: 'offsetCenterX',
    default: null,
    description: 'Move center X by fraction of Width ',
    type: 'pixels',
    category: 'centerValue',
    tags: ['centerValue'],
  },
  // {
  //   key: 'centerValueMaxLength',
  //   default: null,
  //   description: 'Controls the display of values on the slice',
  //   type: 'pixels',
  //   category: 'fontSize',
  //   tags: ['slice'],
  // },
  {
    key: 'subTextMaxLength',
    default: null,
    description: 'Evaluates subText length',
    type: 'pixels',
    category: 'centerValue',
    tags: ['centerValue'],
  },
  {
    key: 'subtextFontSize',
    default: null,
    description: 'Evaluates subText font size ',
    type: 'pixels',
    category: 'centerValue',
    tags: ['centerValue'],
  },
];

preferences$2.forEach(function (pref) {
  if (pref.category == null) {
    pref.category = 'centerValue';
  }
});

var preferences$3 = [
  {
    key: 'legendsMaxLength',
    default: null,
    description: 'Controls the max characters for legends',
    type: 'number',
    category: 'legends',
    tags: ['slice'],
  },
  {
    key: 'showLegends',
    default: false,
    description: 'Show/hide legends',
    type: 'boolean',
    category: 'legends',
    tags: [],
  },
  {
    key: 'formatLegendLabels',
    default: false,
    description:
      'Format the legend labels if labels are number to add suffix and prefix also Only added for choropleth for now',
    type: 'boolean',
    category: 'legends',
    tags: [],
  },
];

preferences$3.forEach(function (pref) {
  if (pref.category == null) {
    pref.category = 'legends';
  }
});

var preferences$4 = [
  {
    key: 'width',
    default: null,
    description: 'Width of the Chart',
    type: 'pixels',
    category: 'general',
    tags: ['dimensions'],
  },
  {
    key: 'height',
    default: null,
    description: 'Heigth of the Chart',
    type: 'pixels',
    category: 'general',
    tags: ['dimensions'],
  },
  {
    key: 'fontSize',
    default: null,
    description: 'font-size',
    type: 'pixels',
    category: 'general',
    tags: [],
  },
  {
    key: 'normalize',
    default: false,
    description: 'Reduce the data',
    type: 'boolean',
    category: 'general',
    tags: ['normalization'],
  },
  {
    key: 'normalizationFactor',
    default: null,
    description: 'Reduce the data to a certain number',
    type: 'number',
    category: 'general',
    tags: ['normalization'],
  },
];

preferences$4.forEach(function (pref) {
  if (pref.category == null) {
    pref.category = 'general';
  }
});

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var preferences$5 = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences),
  toConsumableArray(preferences$3),
  [
    {
      key: 'curve',
      default: 'curveLinear',
      type: 'enum',
      description: 'Curve Interpolation',
      enum: ['curveCardinal', 'curveNatural', 'curveLinear'],
      category: 'style',
      tags: ['axis', 'curve', 'interpolation'],
    },
    {
      key: 'highlightedStrokeWidthSize',
      default: null,
      type: 'number',
      description: 'Highlighted stroke width size',
      category: 'style',
      tags: [''],
    },
    {
      key: 'backgroundOpacity',
      default: true,
      type: 'number',
      description: 'set background opacity of chart',
      category: 'style',
      tags: [''],
    },
    {
      key: 'isStacked',
      default: false,
      type: 'boolean',
      description: 'arrange the chart in stacks (valid for CMAreaStacked)',
      category: 'style',
      tags: [''],
    },
    {
      key: 'medianArea',
      default: false,
      type: 'boolean',
      description: 'show the median line (valid for CMArea)',
      category: 'median',
      tags: [''],
    },
    {
      key: 'medianValue',
      default: null,
      type: 'number',
      description: 'show the median value (valid only for CMArea)',
      category: 'median',
      tags: [''],
    },
    {
      key: 'medianColor',
      default: null,
      type: 'color',
      description: 'show the median value (valid only for CMArea)',
      category: 'median',
      tags: ['median', 'color'],
    },
    {
      key: 'showCircleOnLines',
      default: true,
      description:
        'Toggles Line display with circle over intersecting points in  column graph',
      type: 'boolean',
      category: 'style',
      tags: [''],
    },
    {
      key: 'circleGroupRadius',
      default: 'auto',
      type: 'number',
      description: 'radius of group circle',
      category: 'style',
      tags: ['axis,line'],
    },
    {
      key: 'tooltipCircleRadii',
      default: null,
      type: 'number',
      description: 'tooltip circle radius on mouse hover',
      category: 'tooltip',
      tags: [''],
    },
    {
      key: 'tooltipCircleRadiiStrokeWidth',
      default: null,
      type: 'number',
      description: 'tooltip circle stroke radius',
      category: 'tooltip',
      tags: [''],
    },
    {
      key: 'showTooltip',
      default: true,
      type: 'boolean',
      description: 'show tooltip',
      category: 'tooltip',
      tags: [''],
    },
    {
      key: 'showTooltipCircleOnLines',
      default: false,
      type: 'boolean',
      description: 'show tooltip circles on mouse hover',
      category: 'tooltip',
      tags: [''],
    },
  ],
);

var preferences$6 = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences$1),
  toConsumableArray(preferences$2),
  toConsumableArray(preferences$3),
  [
    {
      key: 'showSliceLabel',
      default: false,
      description: 'Controls the display of values on the slice',
      type: 'boolean',
      category: 'radial',
      tags: ['slice'],
    },
    {
      key: 'outerArcRadius',
      default: false,
      description: 'Controls the inner circle hide or display',
      type: 'boolean',
      category: 'radial',
      tags: ['background'],
    },
  ],
);

var preferences$7 = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences$1),
  toConsumableArray(preferences$2),
  toConsumableArray(preferences$3),
  [
    {
      key: 'arcAngle',
      default: 45,
      type: 'int',
      range: [0, 90],
      description: 'Gauge Arc angle (in degrees)',
      category: 'arc',
      tags: [''],
    },
    {
      key: 'innerRadius',
      default: undefined,
      description: 'evaluates inner radius',
      type: 'number',
      category: 'radial',
      tags: ['radius'],
    },
    {
      key: 'showSliceLabel',
      default: true,
      description: 'Controls the display of values on the slice',
      type: 'boolean',
      category: 'radial',
      tags: ['slice'],
    },
  ],
);

var customPreferences = [
  {
    key: 'innerRadius',
    default: undefined,
    description: 'evaluates inner radius',
    type: 'number',
    category: 'radial',
    tags: ['radius'],
  },
  {
    key: 'showSliceLabel',
    default: true,
    description: 'Controls the display of values on the slice',
    type: 'boolean',
    category: 'radial',
    tags: ['slice'],
  },
];

var preferences$8 = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences$1),
  toConsumableArray(preferences$2),
  customPreferences,
  toConsumableArray(preferences$3),
);

var preferences$9 = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences),
  toConsumableArray(preferences$3),
  [
    {
      key: 'showLine',
      default: true,
      type: 'boolean',
      description: 'show the line',
      category: 'line',
      tags: [''],
    },
    {
      key: 'showCircleOnLines',
      default: true,
      type: 'boolean',
      description: 'circles on line',
      category: 'circle',
      tags: [''],
    },
    {
      key: 'circleGroupRadius',
      default: 'auto',
      type: 'number',
      description: 'radius of group circle',
      category: 'circle',
      tags: [''],
    },
    {
      key: 'lineColor',
      default: 'auto',
      type: 'string',
      description: 'line color change for a single line',
      category: 'color',
      tags: ['red', 'blue'],
    },
  ],
);

var preferences$a = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences$1),
  toConsumableArray(preferences$2),
  [
    {
      key: 'arcAngle',
      default: 45,
      type: 'int',
      range: [0, 90],
      description: 'Gauge Arc angle (in degrees)',
      category: 'arc',
      tags: [''],
    },
    {
      key: 'gaugeMeterTheme',
      default: 1,
      type: 'enum',
      enum: [1, 2],
      description: 'gauge theme change',
      category: 'theme',
      tags: [''],
    },
  ],
);

var preferences$b = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences),
  toConsumableArray(preferences$3),
  [
    // {
    //   key: 'valueFontFamily',
    //   default: 'sans-serif',
    //   type: 'enum',
    //   description: 'Controls the fontSize of the value on top of Column',
    //   enum: ['Rubik', 'Roboto'],
    //   category: 'style',
    //   tags: ['axis', 'yaxis', 'value'],
    // },
    {
      key: 'paddingBetweenBars',
      default: 0,
      description:
        'Controls the gap between two consequtive Bars/Columns,value ranges bw 0-0.9',
      type: 'float',
      range: [0, 0.9],
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'percentageBased',
      default: false,
      description:
        'Converts the visualisation percentage based than default data based',
      type: 'boolean',
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'showValues',
      default: null,
      description: 'Toggles the display of values on top of Columns',
      type: 'boolean',
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'valueFontSize',
      default: null,
      description: 'Controls the fontSize of the value on top of Column',
      type: 'pixels',
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'valueColor',
      default: null,
      description: 'Controls the color of the value on top of column',
      type: 'string',
      category: 'axis',
      tags: ['axis', 'yaxis', 'color'],
    },
    {
      key: 'circleColour',
      default: null,
      description:
        'Controls the color of the circle on line with Column(works only if showLine is activated)',
      type: 'string',
      category: 'circle',
      tags: ['axis', 'yaxis', 'color'],
    },
    {
      key: 'showLine',
      default: false,
      description:
        'Toggles Line display over column graph(Works only CMColumn)',
      type: 'boolean',
      category: 'axis',
      tags: ['axis', 'yaxis', 'line'],
    },
    {
      key: 'showCircleOnLines',
      default: true,
      description:
        'Toggles Line display with circle over intersecting points in  column graph',
      type: 'boolean',
      category: 'circle',
      tags: [''],
    },
    {
      key: 'circleGroupRadius',
      default: 'auto',
      type: 'number',
      description: 'radius of group circle',
      category: 'circle',
      tags: ['axis,line'],
    },
  ],
);

var preferences$c = [].concat(toConsumableArray(preferences$4), [
  {
    key: 'showValues',
    default: false,
    description: 'Toggles the display of values ',
    type: 'boolean',
    category: 'Value',
    tags: [''],
  },
  {
    key: 'showLabelGroup',
    default: false,
    description: 'Toggles the display of Labels',
    type: 'boolean',
    category: 'Label',
    tags: [''],
  },
  {
    key: 'valueFontSize',
    default: null,
    description: 'Controls the fontSize of the value',
    type: 'pixels',
    category: 'Value',
    tags: [''],
  },
  {
    key: 'labelFontSize',
    default: null,
    description: 'Controls the fontSize of the value',
    type: 'pixels',
    category: 'Label',
    tags: [''],
  },
  {
    key: 'valueColor',
    default: null,
    description: 'Controls the color of the value',
    type: 'string',
    category: 'Value',
    tags: ['color'],
  },
]);

var preferences$d = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences$1),
  toConsumableArray(preferences$2),
  toConsumableArray(preferences$3),
  [
    {
      key: 'maxValue',
      default: 100,
      description:
        'assigns the max-value based on which the percentage will be calculated',
      type: 'number',
      category: 'data',
      tags: [],
    },
    {
      key: 'opacity',
      default: 1,
      type: 'float',
      description: 'Controls the opacity of the rings',
      range: [0.01, 1],
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'arcAngle',
      default: 0.01,
      type: 'int',
      range: [0.01, 90],
      description: 'Gauge Arc angle (in degrees)',
      category: 'arc',
      tags: [''],
    },
    {
      key: 'innerRadius',
      default: undefined,
      description: 'evaluates inner radius',
      type: 'number',
      category: 'radial',
      tags: ['radius'],
    },
  ],
);

var preferences$e = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences$1),
  toConsumableArray(preferences$2),
  toConsumableArray(preferences$3),
  [
    {
      key: 'maxValue',
      default: 100,
      description:
        'assigns the max-value based on which the percentage will be calculated',
      type: 'number',
      category: 'data',
      tags: [],
    },
    {
      key: 'opacity',
      default: 1,
      type: 'float',
      description: 'Controls the  color opacity of the rings.',
      range: [0.01, 1],
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'arcAngle',
      default: 45,
      type: 'int',
      range: [0, 90],
      description: 'Gauge Arc angle (in degrees)',
      category: 'arc',
      tags: [''],
    },
    {
      key: 'innerRadius',
      default: undefined,
      description: 'evaluates inner radius',
      type: 'number',
      category: 'radial',
      tags: ['radius'],
    },
  ],
);

var preferences$f = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences$3),
  [
    {
      key: 'showValues',
      default: false,
      description: 'Toggles the display of values on top of Bar',
      type: 'boolean',
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'valueFontSize',
      default: null,
      description: 'changes the font-size of values',
      type: 'pixels',
      category: 'general',
      tags: [],
    },
    {
      key: 'showLabelGroup',
      default: true,
      description: 'Toggles the display of lables',
      type: 'boolean',
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'labelFontSize',
      default: null,
      description: 'changes the font-size of labels',
      type: 'pixels',
      category: 'general',
      tags: [],
    },
    {
      key: 'yScalePaddingOuter',
      default: null,
      description: 'controls the outer padding of yscale',
      type: 'pixels',
      category: 'axis',
      tags: [''],
    },
    {
      key: 'xAxisDomainFactor',
      default: 1,
      type: 'float',
      description: 'Controls the x axis top padding of the chart.',
      range: [1, 5],
      category: 'axis',
      tags: ['axis', 'xaxis'],
    },
  ],
);

var preferences$g = [
  {
    key: 'wordPadding',
    default: 2,
    type: 'float',
    description: 'Padding between the words',
    range: [1, 10],
    category: 'padding',
    tags: ['fontsize'],
  },
  {
    key: 'minFontSize',
    default: 'null',
    type: 'float',
    description: 'minimum fontSize of the words',
    range: [8, 15],
    category: 'fontsize',
    tags: ['fontsize'],
  },
  {
    key: 'maxFontSize',
    default: 'null',
    type: 'float',
    description: 'maximum fontSize of the words',
    range: [10, 60],
    category: 'fontsize',
    tags: ['fontsize'],
  },
];

var preferences$h = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences$3),
  [
    {
      key: 'showLabelGroup',
      default: true,
      description: 'Toggles the display of labels',
      type: 'boolean',
      category: 'general',
      tags: [''],
    },
    {
      key: 'showValues',
      default: false,
      description: 'Toggles the display of values on top of bars',
      type: 'boolean',
      category: 'general',
      tags: [''],
    },
    {
      key: 'yScalePaddingOuter',
      default: null,
      description: 'controls the outer padding of yscale',
      type: 'pixels',
      category: 'axis',
      tags: [''],
    },
    {
      key: 'valueFontSize',
      default: null,
      description: 'Controls the fontSize of the values',
      type: 'pixels',
      category: 'axis',
      tags: [''],
    },
    {
      key: 'labelFontSize',
      default: null,
      description: 'Controls the fontSize of the label ',
      type: 'pixels',
      category: 'axis',
      tags: [''],
    },
    {
      key: 'xAxisDomainFactor',
      default: 1,
      type: 'float',
      description: 'Controls the x axis top padding of the chart.',
      range: [1, 5],
      category: 'axis',
      tags: ['axis', 'xaxis'],
    },
  ],
);

var preferences$i = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences),
  toConsumableArray(preferences$3),
  [
    {
      key: 'barWidth',
      default: 'null',
      type: 'pixels',
      description: 'evaluates width of the bar',
      category: 'general',
      tags: [''],
    },
    {
      key: 'showvalueGroup',
      default: false,
      description: 'Toggles the display of values on top of Columns',
      type: 'boolean',
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
  ],
);

var preferences$j = [].concat(toConsumableArray(preferences$4), [
  {
    key: 'labelFontSize',
    default: null,
    type: 'number',
    description: 'Defines the fontSize of the labels',
    category: 'style',
    tags: ['labels'],
  },
  {
    key: 'showLabels',
    default: true,
    type: 'boolean',
    description: 'Controls the show of labels on top of butterfly bars',
    category: 'style',
    tags: ['labels'],
  },
]);

var preferences$k = [].concat(toConsumableArray(preferences$4), [
  {
    key: 'labelFontSize',
    default: null,
    description: 'fontsize of the label',
    type: 'pixels',
    category: 'Circle',
    tags: [''],
  },
  {
    key: 'showLabelGroup',
    default: false,
    type: 'boolean',
    description: 'Label diaplay',
    category: 'Circle',
    tags: [''],
  },
  {
    key: 'labelColor',
    default: 'auto',
    type: 'string',
    description: 'label color change for ',
    category: 'Circle',
    tags: [''],
  },
  {
    key: 'themeColor',
    default: false,
    type: 'boolean',
    description: ' color change for a circles',
    category: 'Circle',
    tags: [''],
  },
  {
    key: 'packingCircle',
    default: true,
    type: 'boolean',
    description: ' Display packing clircle',
    category: 'Circle',
    tags: [''],
  },
  {
    key: 'colorRange',
    default: 5,
    type: 'int',
    range: [0, 50],
    description: 'Color range for circles ',
    category: 'Circle',
    tags: [''],
  },
]);

var preferences$l = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences),
  toConsumableArray(preferences$3),
  [
    {
      key: 'invertData',
      default: false,
      type: 'boolean',
      description: 'invert the data',
      category: 'format data',
      tags: ['axis'],
    },
  ],
);

var preferences$m = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences),
  toConsumableArray(preferences$3),
  [
    {
      key: 'percentageBased',
      default: false,
      description:
        'Converts the visualisation percentage based than default data based',
      type: 'boolean',
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'showValues',
      default: null,
      description: 'Toggles the display of values on top of Columns',
      type: 'boolean',
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'valueFontSize',
      default: null,
      description: 'Controls the fontSize of the value on top of Column',
      type: 'pixels',
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'valueColor',
      default: null,
      description: 'Controls the color of the value on top of column',
      type: 'string',
      category: 'axis',
      tags: ['axis', 'yaxis', 'color'],
    },
    {
      key: 'gutterspace',
      default: 'auto',
      description: 'Controls the space between bar groups',
      type: 'number',
      category: 'axis',
      tags: ['xaxis'],
    },
    {
      key: 'barShadow',
      default: true,
      description: 'shadow for the graphs',
      type: 'boolean',
      category: 'axis',
      tags: ['yaxis'],
    },
    {
      key: 'barWidthFactor',
      default: 0,
      description: 'bar width adjustment',
      type: 'float',
      range: [0, 1],
      category: 'axis',
      tags: ['1', '2'],
    },
  ],
);

var preferences$n = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences$3),
  [
    {
      key: 'legendType',
      default: 'value',
      description:
        'Percentage representation of legends only works if data is sent in percentage',
      enum: ['value', 'percentage'],
      category: 'legends',
      tags: [],
    },
    {
      key: 'showLabels',
      default: null,
      description:
        'Toggles the display of country names/code on top of countries',
      type: 'boolean',
      category: 'values',
      tags: ['names'],
    },
    {
      key: 'scale',
      default: null,
      description: 'Controls the scale of the map',
      type: 'number',
      category: 'scale',
      tags: ['scale'],
    },
    {
      key: 'scaleFactor',
      default: 0.15,
      type: 'float',
      description:
        'Controls the map scaling. its is used to slighly adjust the map scale',
      range: [0.1, 0.2],
      category: 'scale',
      tags: ['scale'],
    },
    {
      key: 'valueFontSize',
      default: null,
      description: 'Controls the fontSize of the value on the map',
      type: 'number',
      category: 'values',
      tags: ['values'],
    },
    {
      key: 'getColor',
      default: null,
      description:
        'Controls the color scheme on the map by passing a function. Just added for references',
      type: 'function',
      category: 'color',
      tags: ['values'],
    },
    {
      key: 'labelColor',
      default: null,
      description: 'Controls the fontSize of the value on the map',
      type: 'string',
      category: 'color',
      tags: ['values'],
    },
  ],
);

var preferences$o = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences),
  toConsumableArray(preferences$3),
  [
    {
      key: 'invertData',
      default: false,
      type: 'boolean',
      description: 'invert the data',
      category: 'format data',
      tags: ['axis'],
    },
    {
      key: 'positiveColor',
      default: 'auto',
      type: 'string',
      description: 'change the positive data color',
      category: 'color',
      tags: ['red', 'blue'],
    },
    {
      key: 'negativeColor',
      default: 'auto',
      type: 'string',
      description: 'change the negetive data color',
      category: 'color',
      tags: ['red', 'blue'],
    },
    {
      key: 'negativeValLegend',
      default: 'auto',
      type: 'string',
      description: 'change the negetive value data',
      category: 'legends',
      tags: ['false', 'closed'],
    },
    {
      key: 'positiveValLegend',
      default: 'auto',
      type: 'string',
      description: 'change the positive value data',
      category: 'legends',
      tags: ['true', 'open'],
    },
  ],
);

var preferences$p = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences$3),
  [
    {
      key: 'lollipopLineColor',
      default: 'auto',
      type: 'string',
      description: 'change the line color',
      category: 'color',
      tags: ['red', 'blue'],
    },
    {
      key: 'lollipopLineWidth',
      default: 'auto',
      type: 'number',
      description: 'change the width of the vertical line',
      category: 'line',
      tags: ['2', '5'],
    },
    {
      key: 'lineHeightFactor',
      default: 0,
      type: 'float',
      range: [0.15, 0.9],
      description: 'change the height',
      category: 'line',
      tags: ['0.2', '0.5'],
    },
    {
      key: 'labelColor',
      default: 'auto',
      type: 'string',
      description: 'change the label color',
      category: 'color',
      tags: ['red', 'yellow'],
    },
    {
      key: 'sideLinesColor',
      default: 'auto',
      type: 'string',
      description: 'change the color of seperation line',
      category: 'color',
      tags: ['red', 'yellow'],
    },
    {
      key: 'sideLinesWidth',
      default: 'auto',
      type: 'number',
      description: 'change the width of seperation line',
      category: 'line',
      tags: ['3', '5'],
    },
    {
      key: 'sideLinesHeight',
      default: 'auto',
      type: 'number',
      description: 'change the height of seperation line',
      category: 'line',
      tags: ['3', '5'],
    },
    {
      key: 'lollipopBaseHeight',
      default: 'auto',
      type: 'number',
      description: 'change the height of the base (or axis) of lollipop ',
      category: 'line',
      tags: ['3', '5'],
    },
    {
      key: 'subText',
      default: 'auto',
      type: 'number',
      description: 'add a subtext',
      category: 'line',
      tags: ['value', 'max'],
    },
    {
      key: 'showLollipopFactor',
      default: 'auto',
      type: 'string',
      description: 'limit the data',
      category: 'data',
      tags: ['3', '5'],
    },
  ],
);

var preferences$q = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences$3),
  [
    {
      key: 'showLabelGroup',
      default: false,
      description: 'Toggles the display of labels',
      type: 'boolean',
      category: 'Pyramid',
      tags: [''],
    },
    {
      key: 'showValues',
      default: false,
      description: 'Toggles the display of values on top of bars',
      type: 'boolean',
      category: 'Pyramid',
      tags: [''],
    },
    {
      key: 'labelFontSize',
      default: null,
      description: 'Controls the fontSize of the label ',
      type: 'pixels',
      category: 'Pyramid',
      tags: [''],
    },
    {
      key: 'labelGroupPositionFactor',
      default: 1,
      type: 'float',
      description: 'Controls the position of Label Group as a factor of width.',
      range: [0.01, 1],
      category: 'Pyramid',
      tags: [''],
    },
    {
      key: 'pyramidBaseWidthFactor',
      default: 1,
      type: 'float',
      description: 'Controls the base width of Pyramid as a factor of width.',
      range: [0.01, 1],
      category: 'Pyramid',
      tags: [''],
    },
    {
      key: 'showBandColors',
      default: false,
      type: 'boolean',
      description: 'Display label with the corresponding band color',
      category: 'Pyramid',
      tags: [''],
    },
    {
      key: 'labelColor',
      default: undefined,
      description: 'Controls the color of the labels',
      type: 'string',
      category: 'Pyramid',
      tags: ['color'],
    },
  ],
);

var preferences$r = [].concat(
  toConsumableArray(preferences$4),
  toConsumableArray(preferences),
  toConsumableArray(preferences$3),
  [
    {
      key: 'showValues',
      default: null,
      description: 'Toggles the display of values on top of Columns',
      type: 'boolean',
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'valueFontSize',
      default: null,
      description: 'Controls the fontSize of the value on top of Column',
      type: 'pixels',
      category: 'axis',
      tags: ['axis', 'yaxis'],
    },
    {
      key: 'valueColor',
      default: null,
      description: 'Controls the color of the value on top of column',
      type: 'string',
      category: 'axis',
      tags: ['axis', 'yaxis', 'color'],
    },
    {
      key: 'positiveColor',
      default: 'auto',
      type: 'string',
      description: 'change the positive data color',
      category: 'color',
      tags: ['red', 'blue'],
    },
    {
      key: 'negativeColor',
      default: 'auto',
      type: 'string',
      description: 'change the negetive data color',
      category: 'color',
      tags: ['red', 'blue'],
    },
    {
      key: 'baseColor',
      default: 'auto',
      type: 'string',
      description: 'change the Total data color',
      category: 'color',
      tags: ['red', 'blue'],
    },
  ],
);

var preferences$s = {
  CMAster: preferences$6,
  CMDonutPie: preferences$7,
  CMDonut: preferences$8,
  CMLine: preferences$9,
  CMLineStacked: preferences$9,
  CMGaugeMeter: preferences$a,
  CMTreemap: preferences$c,
  CMColumn: preferences$b,
  CMWaterfall: preferences$r,
  CMColumnStacked: preferences$b,
  CMMultipleColumns: preferences$i,
  CMConcentricRings: preferences$d,
  CMHalfRings: preferences$e,
  CMArea: preferences$5,
  CMAreaStacked: preferences$5,
  CMMultipleBar: preferences$f,
  CMBar: preferences$h,
  CMBarStacked: preferences$h,
  CMButterfly: preferences$j,
  CMClusterBubble: preferences$k,
  CMHeatMap: preferences$l,
  CMVariableColumns: preferences$m,
  CMChoropleth: preferences$n,
  CMAvailability: preferences$o,
  CMLollipop: preferences$p,
  CMPyramid: preferences$q,
  CMTagCloud: preferences$g,
};

export default preferences$s;
