'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import {
  Paper, Table, TableCell, TableContainer, TableRow, TableHead, TableBody,
  IconButton, Menu, MenuItem, Link, Pagination, TableFooter, Select, MenuItem as MuiMenuItem, TextField,
  Autocomplete, Dialog, DialogActions,
  DialogContent, DialogTitle, Button, Checkbox,
  Snackbar,
  Alert,
  TablePagination
} from '@mui/material';
import { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShiftService from 'src/@core/service/shift';
import RoomCategoryService from 'src/@core/service/RoomCategory';
import Popup from '../components/form/Popup';
import EditShift from '../components/form/EditShift';
import AddShift from '../components/form/AddShift';

import { useCustomSnackbar } from 'src/hooks/use-snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { checkRole } from 'src/@core/utils/checkUserRole';
import { RoleConstants } from 'src/@core/constants/permission';


export default function ShiftListView() {
  const settings = useSettingsContext();
  const [reload, setReload] = useState<any>();
  const [shifts, setShifts] = useState<any>([]);
  const [filteredShiftsList, setFilteredShiftsList] = useState<any[]>();
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [areas, setAreas] = useState<any[]>([]);
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [openPopUp1, setOpenPopUp1] = useState<boolean>(false);
  const [searchShiftName, setSearchShiftName] = useState<string>('');
  const { showSuccess, showError } = useCustomSnackbar();

  const rowsPerPage = 10
  const isAdmin = checkRole(RoleConstants.ADMIN);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };


  const filterShifts = () => {
    let filteredShifts = shifts;
    if (searchShiftName) {
      filteredShifts = filteredShifts?.filter((shift: any) => shift.shiftName.toLowerCase().includes(searchShiftName.toLowerCase()));
    }
    if (selectedArea !== null) {
      filteredShifts = filteredShifts?.filter((shift: any) => shift?.roomCategoryId === areas.find(area => area.id === selectedArea)?.id);
    }

    const currentSize = page * rowsPerPage;
    if (filteredShifts && filteredShifts.length > 0) {
      if (currentSize > filteredShifts.length) {
        setPage(0);
      }
      setFilteredShiftsList(filteredShifts);
    }
    else {
      setFilteredShiftsList([]);
    }
  };

  const handleAddClick = async () => {
    setOpenPopUp(true);
  }
  const handleAddSuccess = async (message: string) => {
    showSuccess(message);
    fetchData();
    setReload(!reload);
  }

  const fetchData = async () => {
    try {
      const response: any = await RoomCategoryService.getAllRoomCategory();
      const shiftResponse: any = await ShiftService.getAllShifts();
      setAreas(response);
      setShifts(shiftResponse);
    } catch (error: any) {
      console.error('Lỗi khi tải danh sách khu vực:', error);
    }
  };

  useEffect(() => {
    setFilteredShiftsList(shifts);
  }, [shifts]);


  useEffect(() => {
    if (filteredShiftsList !== undefined) {
      filterShifts();
    }
    else {
      fetchData();
    }
  }, [page]);

  useEffect(() => {
    filterShifts();
  }, [selectedArea, searchShiftName]);


  const handleOpenEditDialog = (shift: any) => {
    setSelectedShift(shift);
    // setOpenEditDialog(true);
    setOpenPopUp1(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedShift(null);
  };

  const handleSaveEdit = async (message:string) => {
    showSuccess(message);
    fetchData();
    setReload(!reload);
    // if (selectedShift) {
    //   try {
    //     // Gọi API chỉnh sửa ca làm việc
    //     const response: any = await ShiftService.editShifts(selectedShift.id, {
    //       shiftName: selectedShift.shiftName,
    //       category: [selectedShift.roomCategoryId],
    //       startTime: selectedShift.startTime,
    //       endTime: selectedShift.endTime,
    //       status: selectedShift.status,
    //     });
    //     showSuccess("Sửa ca làm việc thành công");
    //     const updatedShifts: any = await ShiftService.getAllShifts();
    //     setShifts(updatedShifts);
    //     setSelectedArea(null);
    //     setSearchShiftName('');
    //     setReload(!reload);

    //   } catch (error) {

    //     showError('Có lỗi xảy ra khi sửa ca làm việc.');

    //   } finally {
    //     handleCloseEditDialog();
    //   }
    // }
  };

  const visibleRows = filteredShiftsList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4">Danh sách ca làm việc</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Autocomplete
            sx={{ minWidth: 200 }}
            options={areas}
            getOptionLabel={(option: any) => option.categoryName || ''}
            value={areas.find((a: any) => a.id === selectedArea) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedArea(newValue ? newValue.id : null);
              }
              else {
                setSelectedArea(null);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn khu vực"
                variant="outlined"
              />
            )}
            noOptionsText="Không có dữ liệu khu vực"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm theo tên ca"
            value={searchShiftName}
            onChange={(e) => setSearchShiftName(e.target.value)}
            sx={{ minWidth: 300 }}
          />
        </Box>
        <Button variant="contained" onClick={handleAddClick} sx={{ display: isAdmin ? 'block' : 'none' }}>Tạo mới</Button>
        <Popup title="Tạo mới ca làm việc" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
          <AddShift setOpenPopUp={setOpenPopUp} onSuccess={handleAddSuccess} />
        </Popup>
      </Box>


      {loading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : filteredShiftsList && filteredShiftsList?.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Tên Ca</TableCell>
                <TableCell align="center">Thời gian bắt đầu</TableCell>
                <TableCell align="center">Thời gian kết thúc</TableCell>
                <TableCell align="center">Khu vực</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows?.map((shift: any, index: any) => (
                <TableRow key={shift.id}>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{shift.shiftName}</TableCell>
                  <TableCell align="center">{shift.startTime}</TableCell>
                  <TableCell align="center">{shift.endTime}</TableCell>
                  <TableCell align="center">{areas.find((area: any) => area.id === shift.roomCategoryId)?.categoryName}</TableCell>
                  <TableCell align="center">{shift.status === 'ENABLE' ? '✔️' : '❌'}</TableCell>
                  <TableCell align="center" sx={{ display: isAdmin ? 'block' : 'none' }}>
                    <IconButton onClick={() => handleOpenEditDialog(shift)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Popup title="Chỉnh sửa ca làm" openPopup={openPopUp1} setOpenPopup={setOpenPopUp1} >
            <EditShift setOpenPopUp={setOpenPopUp1} onSuccess={handleSaveEdit} data={selectedShift}/>
          </Popup>
        </TableContainer>
      ) : (
        <Typography>Không có dữ liệu nào.</Typography>
      )}


      {/* <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Chỉnh sửa ca làm việc</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên Ca"
            value={selectedShift?.shiftName || ''}
            onChange={(e) => setSelectedShift({ ...selectedShift, shiftName: e.target.value })}
            fullWidth
            margin="dense"
          />
          <Autocomplete
            value={selectedShift?.categoryName || ''}
            onChange={(event, newValue) => setSelectedShift({ ...selectedShift, categoryName: newValue })}
            options={areas.map((area) => area.categoryName)}
            disabled
            renderInput={(params) => <TextField {...params} label="Khu vực" margin="dense" />}
            fullWidth
          />
          <TextField
            label="Thời gian bắt đầu"
            type="time"
            value={selectedShift?.startTime || ''}
            onChange={(e) => setSelectedShift({ ...selectedShift, startTime: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Thời gian kết thúc"
            type="time"
            value={selectedShift?.endTime || ''}
            onChange={(e) => setSelectedShift({ ...selectedShift, endTime: e.target.value })}
            fullWidth
            margin="dense"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography>Trạng thái: </Typography>
            <Checkbox
              checked={selectedShift?.status === 'ENABLE'}
              onChange={(e) =>
                setSelectedShift({ ...selectedShift, status: e.target.checked ? 'ENABLE' : 'DISABLE' })
              }
              sx={{ ml: 1 }}
            />
            {selectedShift?.status === 'ENABLE' ? '✔️' : '❌'}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="error">
            Hủy
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog> */}

      <Box sx={{
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <TablePagination
          component="div"
          count={filteredShiftsList?.length || 0}
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