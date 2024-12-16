import { Card, CardContent, useTheme } from '@mui/material'
import { ArcElement } from 'chart.js';
import { Chart } from 'chart.js';
import React from 'react'
import DataChart from 'src/components/DataChart/DataChart'
Chart.register(ArcElement);

interface props {
    data: any;
}



const transformDataForDonutChart = (data: any) => {
    const reportCounts = data?.reportCounts ? Array.from(data.reportCounts).reverse() : [];
    return {
        labels: reportCounts.map((item: any) => item.status),
        datasets: [
            {
                label: "Số lượng báo cáo",
                data: reportCounts.map((item: any) => item.count),
                cutout: '75%',
                backgroundColor: ['#56d692', '#007867', '#FF0000'],
                hoverBackgroundColor: ['#56d692', '#007867', '#FF0000']
            }
        ]
    };
};
const ReportCountChart = ({ data }: props) => {
    const theme = useTheme();
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart: any) => {
            const { width, height, ctx } = chart;
            ctx.restore();
            const fontSize = (height / 200).toFixed(2);
            ctx.font = `${fontSize}em sans-serif`;
            ctx.textBaseline = 'middle';
            const total = chart.config.data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
            const text = `Tổng: ${total}`;
            const textX = Math.round((width - ctx.measureText(text).width) / 2);
            const textY = height / 1.6;
            ctx.fillStyle = theme.palette.text.primary;
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
    };
    const donutData = transformDataForDonutChart(data);
    return (
        <Card sx={{flexGrow:1}}>
            <CardContent sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}>
                <DataChart
                    type={"doughnut"}
                    data={donutData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
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
                                text: `Báo cáo vệ sinh trong ngày`,
                                color: theme.palette.text.primary,
                                font: { size: 18 },
                            }
                        }
                    }}
                    plugins={[centerTextPlugin]}
                />
            </CardContent>
        </Card>
    )
}

export default ReportCountChart