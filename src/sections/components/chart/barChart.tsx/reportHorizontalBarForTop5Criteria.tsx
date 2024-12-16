import { Card, CardContent, useTheme } from '@mui/material';
import { scales } from 'chart.js';
import React from 'react'
import { HorizontalBarChartData } from 'src/_mock/chartData';
import DataChart from 'src/components/DataChart/DataChart';


interface props {
    data: any;
    campusName:string;
}

const colors =[
    'rgb(75, 192, 192)',
    'rgb(78, 60, 192)',
    'rgb(11, 89, 192)',
    'rgb(61, 251, 192)',
    'rgb(200, 100, 150)',
    'rgb(100, 200, 150)',
]

const processData = (data: { campusName: string; criteriaName: string; value: number }[]) => {
    // Lấy danh sách unique criteriaName
    const criteriaNames = Array.from(new Set(data.map((item: any) => item.criteriaName)));

    // Lấy danh sách unique campusName
    const campusNames  = Array.from(new Set(data.map((item: any) => item.campusName)));

    // Tạo datasets
    const datasets = campusNames.map((campusName, index) => {
        return {
            label: campusName,
            data: criteriaNames.map(criteriaName => {
                // Tìm giá trị (value) của criteria cho campus hiện tại
                const record = data.find(
                    (item:any) => item.campusName === campusName && item.criteriaName === criteriaName
                );
                // Nếu tìm thấy giá trị thì trả về, nếu không thì trả về null
                return record ? record.value : null;
            }),
            // Các tùy chọn hiển thị cho từng dataset
            backgroundColor: colors[index],
        };
    });

    return {
        labels:criteriaNames,
        datasets:datasets
    };
};


const RenderHorizontalBarChart = ({ data,campusName }: props) => {
    const theme = useTheme();
    const options = {
        indexAxis: 'y',  // Đặt trục x thành trục dọc, cho phép thanh nằm ngang
        responsive: true,
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
                display: true, // Hiển thị title
                text: `Biểu đồ Top 5 tiêu chí đánh giá của ${campusName}`, // Tiêu đề
                font: {
                    size: 20 // Kích thước font
                },
                color: theme.palette.text.primary, 
            },
            
            tooltip: {
                enabled: true, // Bật tooltip khi hover vào thanh
                callbacks: {
                    label: function (tooltipItem: any) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    }
                }
            }
        },
    };

    return (
        <Card sx={{height:'100%'}}>
            <CardContent
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}>
                <DataChart
                    type="bar"
                    data={processData(data)}
                    options={{
                        ...options,
                        indexAxis: 'y'
                    }}
                    width= {100}
                    height={70}
                />
            </CardContent>
        </Card>
    )
}

export default RenderHorizontalBarChart