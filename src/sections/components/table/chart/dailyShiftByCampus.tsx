import { Box, TableContainer, Card, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, useTheme } from '@mui/material'
import React, { useState } from 'react'

interface props {
    data: any,
    campusName: string
}


const DailyShiftByCampus = ({ data, campusName }: props) => {
    const theme= useTheme();
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const visibleRows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align='center'
                                colSpan={5}
                                sx={{fontSize:'20px',color:theme.palette.text.primary}}
                            >
                                Bảng thống kê điểm số theo ca trong ngày của {campusName}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='center' sx={{ width: '25%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Tên ca</TableCell>
                            <TableCell align='center' sx={{ width: '25%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Thời gian</TableCell>
                            <TableCell align='center' sx={{ width: '25%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Số lượng báo cáo</TableCell>
                            <TableCell align='center' sx={{ width: '25%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Điểm số trung bình (%)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? visibleRows.map((record: any) => (
                            <TableRow>
                                <TableCell align='center' sx={{ width: '20%' }}>{record.shiftName}</TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    {record.shiftTime}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    {record.totalEvaluations}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    {record.averageCompletionPercentage}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell align='center' colSpan={5} sx={{ fontSize: '20px', fontWeight: 700, fontStyle: 'bold' }}>
                                    Chưa có thông tin đánh giá cho ngày hôm nay
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {data.length > 0 && (
                <Box sx={{ 
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <TablePagination
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[]}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
                    />
                </Box>
            )}
        </Card>
    )
}

export default DailyShiftByCampus