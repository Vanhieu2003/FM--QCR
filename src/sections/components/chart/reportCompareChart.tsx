import { Box, Button, CardContent, Card, Typography, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ChartService from 'src/@core/service/chart';
import RenderBarChart from './barChart.tsx/reportBarChartCompare';
import RenderLineChartData from './lineChart.tsx/reportLineChartCompare';
import { MONTHS, YEARS } from 'src/utils/chart/time-for-chart';


const ReportCompareChart = () => {
    const [option, setOption] = useState<string>('year');
    const [barChartData, setBarChartData] = useState<any>();
    const [lineChartData, setLineChartData] = useState<any>();
    const [lineByMonth, setLineByMonth] = useState<string>('');
    const [lineByYear, setLineByYear] = useState<string>('');


    const handleMonthChange = (e:any)=>{
        setLineByMonth(e.target.value as string)
    }

    const handleYearChange = (e:any)=>{
        setLineByYear(e.target.value as string)
    }
    const handleClick = (type: string) => {
        if (type === 'year') {
            setOption('year');
        } else if (type === 'quater') {
            setOption('quater');
        }
        else {
            setOption('month');
        }
    }

    const fetchDataForBarChart = async (type: string) => {
        if (type === 'year') {
            const response = await ChartService.GetChartComparision();
            setBarChartData(response);
        }
        else {
            const response = await ChartService.GetCleaningReportByQuarter();
            setBarChartData(response);
        }
    }
    const fetchDataForLineChart = async (month: string, year: string) => {
        const response = await ChartService.GetCleaningReportsByMonth(month, year);
        setLineChartData(response);
    }

    useEffect(() => {
        if (option === 'year') {
            fetchDataForBarChart("year");
        }
        else if (option === 'quater') {
            fetchDataForBarChart('quater');
        }
        else {
            fetchDataForLineChart('', '');
        }
    }, [option])

    useEffect(()=>{
        if(option === 'month'){
            fetchDataForLineChart(lineByMonth,lineByYear)
        }
    },[lineByMonth,lineByYear])

    return (
        <>
            <Card sx={{ marginTop: '10px', flexGrow: 1 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Button variant={option === 'year' ? 'contained' : 'outlined'}
                            onClick={() => handleClick('year')} >Theo năm</Button>
                        <Button variant={option === 'quater' ? 'contained' : 'outlined'}
                            onClick={() => handleClick('quater')}>Theo quý</Button>
                        <Button variant={option === 'month' ? 'contained' : 'outlined'}
                            onClick={() => handleClick('month')}>Theo tháng</Button>
                    </Box>
                    {
                        option === 'month' ? (
                            <Box>
                                <Box sx={{ display: 'flex',marginTop:'20px',gap:2 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Chọn năm</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={lineByYear ||''}
                                            label="Chọn năm"
                                            onChange={handleYearChange}
                                        >
                                            {YEARS.map((year:any)=>
                                                (<MenuItem key={year.Value} value={year.Value}>{year.Name}</MenuItem>)
                                            )}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Chọn tháng</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={lineByMonth || ''}
                                            label="Chọn tháng"
                                            onChange={handleMonthChange}
                                        >
                                            {MONTHS.map((month:any)=>
                                                (<MenuItem key={month.Value} value={month.Value}>{month.Name}</MenuItem>)
                                            )}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <RenderLineChartData data={lineChartData} type={option} />
                            </Box>) :
                            <RenderBarChart data={barChartData} type={option} />
                    }
                </CardContent>
            </Card>
        </>
    )
}

export default ReportCompareChart