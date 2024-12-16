import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import React, { Fragment } from 'react'


interface props {
    data: any;
}

const getColorByStatus = (status: string) => {
    switch (status.toLowerCase()) {
        case 'hoàn thành tốt':
            return '#00CC00';  // Xanh lá đậm
        case 'hoàn thành':
            return '#66FF66';  // Xanh lá nhạt
        case 'chưa hoàn thành':
            return '#FF0000';  // Đỏ
        default:
            return '#666666';  // Màu mặc định
    }
};

const ReportCount = ({ data }: props) => {
    const theme = useTheme();
    const reportCounts = data?.reportCounts ? Array.from(data.reportCounts).reverse() : [];
    return (
        <Card variant="outlined"
            sx={{
                backgroundColor: theme.palette.background.paper,
            }}>
            <CardContent sx={{ display: 'flex', height: '100%', justifyContent: 'space-evenly', gap: '30px' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{
                        color: "#666666", fontWeight: '700', fontSize: {
                            xs: '0.5rem',
                            sm: '0.75rem',
                            md: '1rem',
                            lg: '1.25rem'

                        }
                    }}>Tổng số báo cáo</Typography>
                    <Typography sx={{
                        fontStyle: 'bold', fontWeight: '900', marginTop: '10px', fontSize: {
                            xs: '2rem',
                            sm: '2.5rem',
                            md: '3rem',
                            lg: '3.5rem'
                        }
                    }}>{data.totalReportsToday}</Typography>
                </Box>
                {reportCounts.map((report: any, index: any) => (
                    <Fragment key={index}>
                        <Box sx={{ height: "auto", width: '1px', backgroundColor: "#000", opacity: "0.3" }}></Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{
                                color: "#666666", fontWeight: '700', fontSize: {
                                    xs: '0.5rem',
                                    sm: '0.75rem',
                                    md: '1rem',
                                    lg: '1.25rem'

                                }
                            }}>{report.status}</Typography>
                            <Typography sx={{
                                color: getColorByStatus(report.status), fontWeight: '900', marginTop: '10px', fontSize: {
                                    xs: '2rem',
                                    sm: '2.5rem',
                                    md: '3rem',
                                    lg: '3.5rem'
                                }
                            }}>{report.count}</Typography>
                        </Box>

                    </Fragment>
                ))}
            </CardContent>
        </Card>
    )
}

export default ReportCount