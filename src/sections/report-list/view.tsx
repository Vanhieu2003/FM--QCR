"use client"

import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState } from 'react';
import {
  Container, Typography, Box, TextField, Paper, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, MenuItem, FormControl, InputLabel, Select,
  Autocomplete,
  Button,
  Collapse,
  Pagination,
  Stack,
  useTheme,
  TablePagination
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from '@mui/material/Link';
import moment from 'moment';
import RenderProgressBar from '../components/renderProgressBar';
import CampusService from 'src/@core/service/campus';
import BlockService from 'src/@core/service/block';
import FloorService from 'src/@core/service/floor';
import CleaningReportService from 'src/@core/service/cleaningReport';
import FilterListIcon from '@mui/icons-material/FilterList';
import RoomService from 'src/@core/service/room';
import { RoleConstants } from 'src/@core/constants/permission';
import { checkRole } from 'src/@core/utils/checkUserRole';
import { useAuthContext } from 'src/auth/hooks';



// ----------------------------------------------------------------------

export default function TwoView() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentReportID, setCurrentReportID] = useState<any>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>, report: any) => {
    setAnchorEl(event.currentTarget);
    setCurrentReportID(report.id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const settings = useSettingsContext();
  const theme = useTheme();

  const [campus, setCampus] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [showProgressFilter, setShowProgressFilter] = useState(false);
  const [filterReportsList, setfilterReportsList] = useState<any[]>();
  const [page, setPage] = useState(0);
  const [mockReports, setMockReports] = useState<any[]>();
  const {user} = useAuthContext();
  const rowsPerPage = 10;
  const isMember = checkRole(RoleConstants.MEMBER);
  const isManager = checkRole(RoleConstants.MANAGER);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const filterReports = () => {
    let filteredReports = mockReports;
    if (selectedCampus !== null) {
      filteredReports = filteredReports?.filter(report => report.campusName === campus.find(campus => campus.id === selectedCampus)?.campusName);
    }
    if (selectedBlock !== null) {
      filteredReports = filteredReports?.filter(report => report.blockName === blocks.find(block => block.id === selectedBlock)?.blockName);
    }
    if (selectedFloor !== null) {
      filteredReports = filteredReports?.filter(report => report.floorName === floors.find(floor => floor.id === selectedFloor)?.floorName);
    }
    if (selectedRoom !== null) {
      filteredReports = filteredReports?.filter(report => report.roomName === rooms.find(room => room.id === selectedRoom)?.roomName);
    }

    if (start !== null && end !== null) {
      filteredReports = filteredReports?.filter(report =>
        report.value >= start && report.value <= end
      );
    }
    if (selectedDate !== null && selectedDate.isValid()) {
      const startOfDay = selectedDate.startOf('day');
      const endOfDay = selectedDate.endOf('day');

      
      filteredReports = filteredReports?.filter(report => {
        const reportDate = dayjs(report.createAt);
        return reportDate.isAfter(startOfDay) && reportDate.isBefore(endOfDay);
      });
    }



    const currentSize = page * rowsPerPage;
    if (filteredReports && filteredReports.length > 0) {
      if (currentSize > filteredReports.length) {
        setPage(0);
      }
      setfilterReportsList(filteredReports);
    }
    else {
      setfilterReportsList([]);
    }

  };


  const fetchData = async () => {
    try {
      const response1: any = await CampusService.getAllCampus();
      if (!isMember && !isManager) {
        const response3: any = await CleaningReportService.getAllCleaningReportInfo();
        setMockReports(response3);
      }
      else {
        if (isMember) {
          const response3: any = await CleaningReportService.getAllCleaningReportInfoByMemberId(user?.userId);
          setMockReports(response3);
        }
        else{
          const response3: any = await CleaningReportService.getAllCleaningReportInfoByManagerId(user?.userId);
          setMockReports(response3);
        }
      }
      setCampus(response1);
    } catch (error) {
      console.error('Chi tiết lỗi:', error);
    }
  }

  useEffect(() => {
    setfilterReportsList(mockReports);
  }, [mockReports]);

  useEffect(() => {
    filterReports();
  }, [selectedCampus, selectedBlock, selectedFloor, selectedRoom, selectedDate]);

  useEffect(() => {
    if (selectedCampus !== null) {
      setSelectedBlock(null);
      setSelectedFloor(null);
      setSelectedRoom(null);
    }
  }, [selectedCampus]);
  const handleCampusSelect = async (CampusId: string) => {
    try {
      setSelectedCampus(CampusId);
      const response: any = await BlockService.getBlockByCampusId(CampusId);
      setBlocks(response);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tòa nhà:', error);
    }
  };

  const handleBlockSelect = async (blockId: string) => {
    var blockId = blockId;

    try {
      const response: any = await FloorService.getFloorByBlockId(blockId);
      if (response.length > 0) {
        setFloors(response);
        setRooms([]);

      }
      else {
        setFloors([]);
        setRooms([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };
  const toggleProgressFilter = () => {
    setShowProgressFilter(!showProgressFilter);
  };
  const handleFilterProgress = () => {
    if (start !== null && end !== null) {
      filterReports();
    }
    else {
      filterReports();
    }
  };
  const handleFloorSelect = async (floorId: string) => {
    setSelectedFloor(floorId);
    try {
      const response: any = await RoomService.getRoomsByFloorIdAndBlockId(floorId, selectedBlock ? selectedBlock : '');
      if (response.length > 0) {
        setRooms(response);
      }
      else {
        setRooms([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };

  const handleProgressChange = (setValue: React.Dispatch<React.SetStateAction<number | null>>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setValue(value === '' ? null : Number(value));
  };

  useEffect(() => {
    if (filterReportsList !== undefined) {
    
      filterReports();
    }
    else {
  
      fetchData();
    }
  }, [page]);

  const visibleRows = filterReportsList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4">Danh sách báo cáo vệ sinh hằng ngày</Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginBottom: 2,
        marginTop: 2,
        gap: 2
      }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <DatePicker
              label="Chọn thời gian"
              value={selectedDate}
              onChange={(newDate: Dayjs | null) => {
             
                setSelectedDate(newDate);
              }}
              onAccept={(newDate: Dayjs | null) => {
                if (newDate && moment(newDate.format('DD/MM/YYYY'), 'DD/MM/YYYY', true).isValid()) {
                  setSelectedDate(newDate);
                }
              }}
              format="DD/MM/YYYY"
              sx={{
                '& .MuiInputLabel-root': { // Màu của label
                  color: theme.palette.text.primary,
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { // Màu của border
                    borderColor: theme.palette.divider,
                  },
                  '&:hover fieldset': { // Màu của border khi hover
                    borderColor: theme.palette.text.primary,
                  },
                  '&.Mui-focused fieldset': { // Màu của border khi focus
                    borderColor: theme.palette.text.primary,
                  },
                },
                '& .MuiInputBase-input': { // Màu của text
                  color: theme.palette.text.primary,
                },
                '& .MuiIconButton-root': { // Màu của icon calendar
                  color: theme.palette.text.primary,
                },
              }}
            />
          </LocalizationProvider>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={toggleProgressFilter} color="primary">
                <FilterListIcon />
              </IconButton>
              <Typography variant="body1" sx={{ ml: 1 }}>
                Lọc theo tiến độ
              </Typography>
            </Box>
            <Collapse in={showProgressFilter}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                <TextField
                  label="Tiến độ từ"
                  type="number"
                  value={start === null ? '' : start}
                  onChange={handleProgressChange(setStart)}
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="Tiến độ đến"
                  type="number"
                  value={end === null ? '' : end}
                  onChange={handleProgressChange(setEnd)}
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ width: 120 }}
                />
                <Button variant="contained" onClick={handleFilterProgress}>
                  Lọc
                </Button>
              </Box>
            </Collapse>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Autocomplete
            fullWidth
            sx={{ flex: 1 }}
            options={campus}
            getOptionLabel={(option: any) => option.campusName || ''}
            value={campus.find((c: any) => c.id === selectedCampus) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedCampus(newValue ? newValue.id : null);
                handleCampusSelect(newValue ? newValue.id : '');
              }
              else {
                setSelectedCampus(null);
                setBlocks([]);
                setSelectedBlock(null);
                setFloors([]);
                setSelectedFloor(null);
                setRooms([]);
                setSelectedRoom(null);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn cơ sở"
                variant="outlined"
              />
            )}
            noOptionsText="Không có dữ liệu cơ sở"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <Autocomplete
            fullWidth
            sx={{ flex: 1 }}
            options={blocks}
            getOptionLabel={(option: any) => option.blockName || ''}
            value={blocks.find((b: any) => b.id === selectedBlock) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedBlock(newValue ? newValue.id : null);
                handleBlockSelect(newValue ? newValue.id : '');
              }
              else {
                setSelectedBlock(null);
                setFloors([]);
                setSelectedFloor(null);
                setRooms([]);
                setSelectedRoom(null);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn tòa nhà"
                variant="outlined"
              />
            )}
            noOptionsText="Không có dữ liệu tòa nhà"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <Autocomplete
            fullWidth
            sx={{ flex: 1 }}
            options={floors}
            getOptionLabel={(option: any) => option.floorName || ''}
            value={floors.find(floor => floor.id === selectedFloor) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedFloor(newValue ? newValue.id : null);
                handleFloorSelect(newValue ? newValue.id : '');
              }
              else {
                setSelectedFloor(null);
                setRooms([]);
                setSelectedRoom(null);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn tầng"
                variant="outlined"
              />
            )}
            noOptionsText="Không có dữ liệu tầng"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <Autocomplete
            fullWidth
            sx={{ flex: 1 }}
            options={rooms}
            getOptionLabel={(option: any) => option.roomName || ''}
            value={rooms.find(room => room.id === selectedRoom) || null}
            onChange={(event, newValue) => {
              setSelectedRoom(newValue ? newValue.id : null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn phòng"
                variant="outlined"
              />
            )}
            noOptionsText="Không có dữ liệu phòng"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Box>


      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="Danh sách báo cáo vệ sinh">
          <TableHead>
            <TableRow>
              <TableCell align="center">Ngày</TableCell>
              <TableCell align="center">Cơ sở</TableCell>
              <TableCell align="center">Tòa nhà</TableCell>
              <TableCell align="center">Tầng</TableCell>
              <TableCell align="center">Phòng</TableCell>
              <TableCell align="center">Tiến độ</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows?.map(report => (
              <TableRow key={report.id}>
                <TableCell align="center">{dayjs(report.createAt).format('DD/MM/YYYY')} ({report.startTime.substring(0, 5)} - {report.endTime.substring(0, 5)})</TableCell>
                <TableCell align="center">{report.campusName}</TableCell>
                <TableCell align="center">{report.blockName}</TableCell>
                <TableCell align="center">{report.floorName}</TableCell>
                <TableCell align="center">{report.roomName}</TableCell>
                <TableCell align="center"><RenderProgressBar progress={report.value} /></TableCell>
                <TableCell align="center">
                  <div>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? 'long-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={(event) => handleClick(event, report)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      MenuListProps={{
                        'aria-labelledby': 'long-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>
                        <Link href={`/dashboard/report-list/detail/${currentReportID}`} sx={{ display: 'flex' }} underline='none'>
                          <VisibilityOutlinedIcon sx={{ marginRight: '5px', color: 'black' }} /> Xem chi tiết
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose} sx={{ display: !isMember ? 'block' : 'none' }}>
                        <Link href={`/dashboard/report-list/edit/${currentReportID}`} sx={{ display: 'flex' }} underline='none' >
                          <EditOutlinedIcon sx={{ marginRight: '5px', color: 'black' }} /> Chỉnh sửa
                        </Link>
                      </MenuItem>
                    </Menu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <TablePagination
          component="div"
          count={filterReportsList?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Box>
    </Container>
  );
}
