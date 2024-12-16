import { ChartConfiguration, Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";

interface DataChartProps extends ChartConfiguration {
    width?: number;
    height?: number;
}

const DataChart = ({ data, options, width , height , ...props }: DataChartProps) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const chart = new Chart(chartRef.current, {
                ...props,
                data,
                options: {
                    ...options
                }
            });
            return () => {
                chart.destroy();
            };
        }
    }, [data, options]);

    return (
        <canvas ref={chartRef} width={width} height={height} />
    );
};

Chart.register(...registerables);
export default DataChart;
