import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Card, TablePagination, useTheme, Typography, IconButton, TextField, Collapse } from '@mui/material'
import React, { useState } from 'react'
import { getBackgroundColor } from 'src/utils/chart/GetColor'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
interface props {
    data: any
}

const ResponsibleUserForChart = ({ data }: props) => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;
    const [filter, setFilter] = useState({ tag: '', user: '' });
    const [filterOpen, setFilterOpen] = useState({ tag: false, user: false });
    const [filteredRows, setFilteredRows] = useState(data);

    const handleFilterToggle = (column: any) => {
        setFilterOpen((prevOpen: any) => ({
            ...prevOpen,
            [column]: !prevOpen[column],
        }));
    };

    const handleFilterChange = (e: any, column: string) => {
        const value = e.target.value;

        // Cập nhật filter trước
        const updatedFilter = { ...filter, [column]: value };
        setFilter(updatedFilter);

        // Áp dụng bộ lọc với trạng thái filter đã cập nhật
        const newFilteredRows = data.filter((row: any) => {
            const tagMatch = row.tagName.toLowerCase().includes(updatedFilter.tag.toLowerCase());
            const userMatch = row.firstName.toLowerCase().includes(updatedFilter.user.toLowerCase());
            return tagMatch && userMatch;
        });

        setFilteredRows(newFilteredRows);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const visibleRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align='center'
                                colSpan={5}
                                sx={{ fontSize: '20px', color: theme.palette.text.primary }}
                            >
                                Bảng thống kê người chịu trách nhiệm
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='center' sx={{ width: '20%', position: 'relative' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography>Tag</Typography>
                                    <IconButton onClick={() => handleFilterToggle('tag')}>
                                        <FilterAltIcon />
                                    </IconButton>
                                </Box>
                                <Collapse in={filterOpen.tag} timeout="auto" unmountOnExit>
                                    <Box sx={{ position: 'absolute', zIndex: 10, backgroundColor: 'white', padding: 1, boxShadow: 3, right: 0 }}>
                                        <TextField
                                            label="Lọc theo tag"
                                            value={filter.tag}
                                            onChange={(e) => handleFilterChange(e, 'tag')}
                                        />
                                    </Box>
                                </Collapse>
                            </TableCell>
                            <TableCell align='center' sx={{ width: '20%', position: 'relative' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography>Tên</Typography>
                                    <IconButton onClick={() => handleFilterToggle('user')}>
                                        <FilterAltIcon />
                                    </IconButton>
                                </Box>
                                <Collapse in={filterOpen.user} timeout="auto" unmountOnExit>
                                    <Box sx={{ position: 'absolute', zIndex: 10, backgroundColor: 'white', padding: 1, boxShadow: 3,right: 0  }}>
                                        <TextField
                                            label="Lọc theo user"
                                            value={filter.user}
                                            onChange={(e) => handleFilterChange(e, 'user')}
                                        />
                                    </Box>
                                </Collapse>
                            </TableCell>
                            <TableCell align='center' sx={{ width: '20%' }}>Số lượng báo cáo (đã hoàn thành)</TableCell>
                            <TableCell align='center' sx={{ width: '20%' }}>Điểm số trung bình (%)</TableCell>
                            <TableCell align='center' sx={{ width: '20%' }}>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.length > 0 ? visibleRows.map((record: any) => (
                            <TableRow>
                                <TableCell align='center' sx={{ width: '20%' }}>{record.tagName}</TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    {`${record.firstName} ${record.lastName}`}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    {record.totalReport}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    {record.progress}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    <Box sx={{ backgroundColor: getBackgroundColor(record.status), borderRadius: '5%', padding: '5px' }}>
                                        {record.status}
                                    </Box>
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

            {filteredRows.length > 0 && (
                <Box sx={{
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <TablePagination
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[]}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
                    />
                </Box>
            )}
        </Card>
    );
};

export default ResponsibleUserForChart