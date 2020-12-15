import React from "react";
import { BarStack } from "@visx/shape";
import { SeriesPoint } from "@visx/shape/lib/types";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { AxisBottom } from "@visx/axis";
import { TreeInterventions } from "@/lib/mock/data/treeInterventions";
import { treeInterventionsRaw } from "@/lib/mock";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { timeParse, timeFormat } from "d3-time-format";
import * as d3 from "d3";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal } from "@visx/legend";
import { localPoint } from "@visx/event";
import { Box } from "@material-ui/core";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";

type InterventionsCategories = "Élaguage" | "Abattage" | "Dessouchage";

type TooltipData = {
  bar: SeriesPoint<TreeInterventions>;
  key: InterventionsCategories;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

export type ResponsiveBandScaleStackedBars = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  data: any;
  isXScaleTimeFormat?: boolean;
  xScaleKey: string;
  yScaleUnit?: string;
  colorScheme: string[];
  colorSchemeRange?: number;
};

export const strokeColor = "#4d4d4d";
export const background = "#ecedee";
const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
};

let tooltipTimeout: number;

export default function ResponsiveBandScaleStackedBars({
  width,
  height,
  events = false,
  margin = defaultMargin,
  data,
  xScaleKey,
  isXScaleTimeFormat = false,
  colorScheme,
  yScaleUnit,
}: ResponsiveBandScaleStackedBars) {
  const { theme } = useThemeContext();
  const chartData = data.slice(0, 12);

  const categories = Object.keys(chartData[0]).filter((d) => d !== xScaleKey);
  type StackedBarsCategories = typeof categories[number];

  const keys = Object.keys(chartData[0]).filter(
    (d) => d !== xScaleKey
  ) as StackedBarsCategories[];

  type TooltipData = {
    bar: SeriesPoint<TreeInterventions>;
    key: StackedBarsCategories;
    index: number;
    height: number;
    width: number;
    x: number;
    y: number;
    color: string;
  };

  const categoryTotals = chartData.reduce((allTotals, currentDate) => {
    const totalByCategory = keys.reduce((dailyTotal, k) => {
      dailyTotal += Number(currentDate[k]);
      return dailyTotal;
    }, 0);
    allTotals.push(totalByCategory);
    return allTotals;
  }, [] as number[]);

  // struct
  const formatTime = timeFormat("%Y-%m");
  const interventionByMonth = treeInterventionsRaw.map(
    (i) => (i.date = formatTime(new Date(i.date)))
  );
  const interventionGroup = d3.group(
    treeInterventionsRaw,
    (d) => d.date,
    (d) => d.intervention_type
  );
  const hierarchy = d3.hierarchy(interventionGroup);
  const interventionsNestedCostsSum = d3.rollup(
    treeInterventionsRaw,
    (v) => d3.sum(v, (d) => d.estimated_cost),
    (d) => d.date,
    (d) => d.intervention_type
  );
  const interventionsNestedCount = d3.rollup(
    treeInterventionsRaw,
    (v) => v.length,
    (d) => d.date,
    (d) => d.intervention_type
  );
  console.group();
  console.log("treeInterventionsRaw", treeInterventionsRaw);
  console.log("interventionGroup", interventionGroup);
  console.log("hierarchy", hierarchy);
  console.log("interventionsNestedCostsSum", interventionsNestedCostsSum);
  console.log("interventionsNestedCount", interventionsNestedCount);
  console.groupEnd();

  const flattenObject = (obj) => {
    const flattened = {};

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(flattened, flattenObject(obj[key]));
      } else {
        flattened[key] = obj[key];
      }
    });

    return flattened;
  };
  console.log(flattenObject(interventionsNestedCostsSum));
  // accessors
  const getDate = (d: any) => d[`${xScaleKey}`];

  // scales
  const xScale = scaleBand<string>({
    domain: chartData.map(getDate),
    padding: 0.2,
  });
  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...categoryTotals)],
    nice: true,
  });
  const colorScale = scaleOrdinal<StackedBarsCategories, string>({
    domain: keys,
    range: colorScheme,
  });

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  const parseDate = timeParse("%Y-%m-%d");
  const format = timeFormat("%b %y");
  const formatDate = (date: string) => format(parseDate(date) as Date);

  if (width < 10) return null;
  // bounds
  const xMax = width;
  const yMax = height - margin.top - 100;

  xScale.rangeRound([0, xMax]);
  yScale.range([yMax, 0]);

  return width < 10 ? null : (
    <Box width={width} height={height}>
      <ParentSize>
        {({ width, height }) => (
          // relative position is needed for correct tooltip positioning
          <div style={{ position: "relative" }}>
            <svg ref={containerRef} width={width} height={height}>
              <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={theme.palette.background.default}
                rx={14}
              />
              <Grid
                top={margin.top}
                left={margin.left}
                xScale={xScale}
                yScale={yScale}
                width={xMax}
                height={yMax}
                stroke="black"
                strokeOpacity={0.1}
                xOffset={xScale.bandwidth() / 2}
              />
              <Group top={margin.top}>
                <BarStack
                  data={data}
                  keys={keys}
                  x={getDate}
                  xScale={xScale}
                  yScale={yScale}
                  color={colorScale}
                >
                  {(barStacks) =>
                    barStacks.map((barStack) =>
                      barStack.bars.map((bar) => (
                        <rect
                          key={`bar-stack-${barStack.index}-${bar.index}`}
                          fill={bar.color}
                          height={bar.height}
                          width={bar.width}
                          x={bar.x}
                          y={bar.y}
                          onClick={() => {
                            if (events)
                              alert(`clicked: ${JSON.stringify(bar)}`);
                          }}
                          onMouseLeave={() => {
                            tooltipTimeout = window.setTimeout(() => {
                              hideTooltip();
                            }, 300);
                          }}
                          onMouseMove={(event) => {
                            const point = localPoint(event);
                            if (tooltipTimeout) clearTimeout(tooltipTimeout);
                            const top = point.y;
                            const left = bar.x + bar.width / 2;
                            showTooltip({
                              tooltipData: bar,
                              tooltipTop: top,
                              tooltipLeft: left,
                            });
                          }}
                        />
                      ))
                    )
                  }
                </BarStack>
              </Group>
              <AxisBottom
                top={yMax + margin.top}
                scale={xScale}
                tickFormat={formatDate}
                stroke={strokeColor}
                tickStroke={strokeColor}
                tickLabelProps={() => ({
                  fill: strokeColor,
                  fontSize: 11,
                  textAnchor: "middle",
                })}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                top: margin.top / 2 - 10,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              <LegendOrdinal
                scale={colorScale}
                direction="row"
                labelMargin="0 15px 0 0"
              />
            </div>

            {tooltipOpen && tooltipData && (
              <TooltipInPortal
                key={Math.random()} // update tooltip bounds each render
                top={tooltipTop}
                left={tooltipLeft}
                style={tooltipStyles}
              >
                <div style={{ color: colorScale(tooltipData.key) }}>
                  <strong>{tooltipData.key}</strong>
                </div>
                <Box my={1}>
                  {`${tooltipData.bar.data[tooltipData.key]} ${yScaleUnit}`}
                </Box>
                <div>
                  <small>{formatDate(getDate(tooltipData.bar.data))}</small>
                </div>
              </TooltipInPortal>
            )}
          </div>
        )}
      </ParentSize>
    </Box>
  );
}
