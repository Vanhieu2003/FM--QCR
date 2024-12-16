import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import DataChart from "src/components/DataChart/DataChart";
import { ChartSkeleton } from "../../skeleton/chartSkeleton";



const colors = [
    'rgba(142, 235, 21, 1)',
    'rgba(66, 133, 244, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 215, 0, 1)',
    'rgba(245, 2, 172, 1)',
    'rgba(2, 245, 192, 1)',
];

const transformDataForChart = (data: any, type: string) => {
    if (type === 'year') {
        const labels = data?.map((item: any) => item.campusName);

        const datasets = [
            {
                label: 'Điểm số',
                data: data?.map((item: any) => item.averageValue),
                backgroundColor: '#4285F4',
            },
            {
                label: 'Vi phạm',
                data: data?.map((item: any) => item.countNotMet),
                backgroundColor: '#FF0000',
            },
            {
                label: 'Hoàn thành tốt',
                data: data?.map((item: any) => item.countWellCompleted),
                backgroundColor: '#FFD700',
            },

        ];

        return { labels, datasets };
    }
    else {
        const labels = Array.from(new Set(data.map((item: any) => item.reportTime)))
        const campusNames = Array.from(new Set(data.map((item: any) => item.campusName)));
        const datasets = campusNames.map((campus: any, index: any) => ({
            label: campus,
            data: labels.map(label => {
                const entry = data.find(
                    (item: any) => item.campusName === campus && item.reportTime === label
                );
                return entry ? entry.averageValue : 0;
            }),
            backgroundColor: colors[index],
        }));

        return { labels, datasets };
    }
};

interface props {
    data: any,
    type: string,
}
const RenderBarChart = ({ data, type }: props) => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Giả lập loading time
        setIsLoading(true);
        if (data) {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }, [data]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: theme.palette.text.primary,
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: `So sánh giữa các cơ sở theo ${type === 'year' ? "năm" : "quý"}`,
                font: { size: 18 },
                color: theme.palette.text.primary,
            },
        },
        scales: {
            x: {
                stacked: false,
                ticks: {
                    color: theme.palette.text.primary
                }
            },
            y: {

                beginAtZero: true,
                max: 100,
                ticks: {
                    color: theme.palette.text.primary
                }
            },
        },
    };


    if (isLoading) {
        return <ChartSkeleton customHeight={600} />;
    }

    return (
        <DataChart
            type="bar"
            data={transformDataForChart(data, type)}
            options={options}
        />
    );

}

export default RenderBarChart