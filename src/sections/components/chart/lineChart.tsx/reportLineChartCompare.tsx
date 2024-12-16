import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { lineChartData } from "src/_mock/chartData"
import DataChart from "src/components/DataChart/DataChart"
import { ChartSkeleton } from "../../skeleton/chartSkeleton";

interface props {
    data: any,
    type: string,
}

const colors = [
    'rgb(75, 192, 192)',
    'rgb(78, 60, 192)',
    'rgb(11, 89, 192)',
    'rgb(61, 251, 192)',
    'rgb(200, 100, 150)',
    'rgb(100, 200, 150)',
];

function transformDataToChartFormat(data: any, type: string) {
    const campusMap = new Map<string, Map<string, number>>();
    const timeLine = new Set<string>();

    // Khởi tạo mảng dữ liệu cho mỗi cơ sở
    data?.forEach((item: any) => {
        if (!campusMap.has(item.campusName)) {
            campusMap.set(item.campusName, new Map<string, number>());
        }
        campusMap.get(item.campusName)!.set(item.reportTime, item.averageValue);
        timeLine.add(item.reportTime);
    });

    // Chuyển Set thành Array và sắp xếp các quý
    const quarters = Array.from(timeLine).sort();

    // Chuyển đổi dữ liệu thành định dạng mong muốn
    const datasets = Array.from(campusMap.entries()).map(([campusName, values]) => ({
        label: campusName,
        data: quarters.map(quarter => values.get(quarter) || 0),
        fill: false,
        backgroundColor: colors.pop(),
    }));

    return {
        labels: quarters,
        datasets: datasets,
    };
}

const RenderLineChartData = ({ data, type }: props) => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (data) {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }, [data]);

    if (isLoading) {
        return <ChartSkeleton customHeight={600}/>;
    }
  
    if (data?.length > 0) {
        return (
            <DataChart
                type="line"
                data={transformDataToChartFormat(data, type) ?? { labels: [], datasets: [] }}
                options={{
                    scales:{
                        y:{
                            ticks:{
                                color:theme.palette.text.primary
                            }
                        },
                        x:{
                            ticks:{
                                color:theme.palette.text.primary
                            }
                        },
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: theme.palette.text.primary, 
                                font: {
                                    size: 14
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: `Báo cáo điểm sổ của các cơ sở theo tháng`,
                            color: theme.palette.text.primary, 
                            font: { size: 18 },
                        }
                    }
                }}
            />
        )
    } else {
        return (
            <Box>
                <Typography variant="h3">Không có dữ liệu</Typography>
            </Box>
        )
    }
}

export default RenderLineChartData