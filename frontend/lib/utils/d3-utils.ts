export const initMonthDataFrame = (year: number, keys: string[]) => {
  const frame = [];
  for (let i = 1; i < 10; i++) {
    const monthFrame = Object.assign(
      { date: `${year}-${i}-01` },
      keys.reduce((monthFrame, key) => ({ ...monthFrame, [key]: 0 }), {})
    );
    frame.push(monthFrame);
  }
  for (let i = 10; i < 13; i++) {
    const monthFrame = Object.assign(
      { date: `${year}-${i}-01` },
      keys.reduce((monthFrame, key) => ({ ...monthFrame, [key]: 0 }), {})
    );
    frame.push(monthFrame);
  }
  return frame;
};

const mergeByProperty = (target: object[], source: object[], prop: string) => {
  source.forEach((sourceElement) => {
    let targetElement = target.find((targetElement) => {
      return sourceElement[prop] === targetElement[prop];
    });
    targetElement
      ? Object.assign(targetElement, sourceElement)
      : target.push(sourceElement);
  });
};

// TODO reduce duplicate code
export const setMonthSeriesWithCount = (
  data: object[],
  xLabel: string,
  seriesKey: string,
  year: number
) => {
  const dataKeys = data.reduce((keys: string[], currentData: object[]) => {
    return [...keys, currentData[seriesKey]];
  }, [] as string[]) as string[];
  const frame = initMonthDataFrame(year, dataKeys);
  const seriesReducer = data.reduce((a, v) => {
    const date = new Date(v[xLabel]);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-01`; //get month from date
    if (!a[key]) a[key] = {};
    if (!a[key][v[seriesKey]]) a[key][v[seriesKey]] = 0;
    return {
      ...a,
      [key]: {
        ...a[key],
        [v[seriesKey]]: (a[key][v[seriesKey]] as number) + 1,
      },
    };
  }, {});
  const series = Object.entries(seriesReducer).map(([key, value], i) => {
    return Object.assign({ date: key }, { ...(value as object) });
  });
  mergeByProperty(frame, series, "date");
  return frame;
};
export const setMonthSeriesWithSum = (
  data: object[],
  xLabel: string,
  seriesKey: string,
  sumKey: string,
  year: number
) => {
  const dataKeys = data.reduce((keys: string[], currentData: object[]) => {
    return [...keys, currentData[seriesKey]];
  }, [] as string[]) as string[];
  const frame = initMonthDataFrame(year, dataKeys);
  const seriesReducer = data.reduce((a, v) => {
    const date = new Date(v[xLabel]);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-01`;
    if (!a[key]) a[key] = {};
    if (!a[key][v[seriesKey]]) a[key][v[seriesKey]] = 0;
    return {
      ...a,
      [key]: {
        ...a[key],
        [v[seriesKey]]:
          (a[key][v[seriesKey]] as number) + (v[sumKey] as number),
      },
    };
  }, {});
  const series = Object.entries(seriesReducer).map(([key, value], i) => {
    return Object.assign({ date: key }, { ...(value as object) });
  });
  mergeByProperty(frame, series, "date");
  return frame;
};
