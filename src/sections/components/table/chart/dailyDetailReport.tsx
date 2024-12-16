import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, Card, TablePagination, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { getBackgroundColor } from 'src/utils/chart/GetColor';

interface props {
    data: any,
    campusName:string
}



const DailyDetailReport = ({ data,campusName }: props) => {

    return (
        <Box >
            <TableContainer component={Card} sx={{marginTop:'10px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align='center'
                                colSpan={5}
                            >
                                Thống kê chi tiết hàng ngày của {campusName}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='center' sx={{ width: '30%'}}>Số lượng phòng</TableCell>
                            <TableCell align='center' sx={{ width: '30%'}}>Tỷ lệ</TableCell>
                            <TableCell align='center' sx={{ width: '40%'}}>Mức độ hoàn thành</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((record: any,index:any) => (
                            <TableRow key={index}>
                                <TableCell align='center' sx={{ width: '30%' }}>{record.totalReport}</TableCell>
                                
                                <TableCell align='center' sx={{ width: '30%' }}>
                                    {record.proportion}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '40%' }}>
                                    <Box sx={{ backgroundColor: getBackgroundColor(record.status), borderRadius: '5%', padding: '5px' }}>
                                        {record.status}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    )
}

export default DailyDetailReport