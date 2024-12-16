"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, Box, Button, Collapse, Container, FormControl, IconButton, InputLabel, Link, Menu, MenuItem, Pagination, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, alpha } from '@mui/material';
import Dayjs from 'dayjs';
import Popup from '../components/form/Popup';
import AddForm from '../components/form/AddForm';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditForm from '../components/form/EditForm';
import BlockService from 'src/@core/service/block';
import axios from 'axios';
import FloorService from 'src/@core/service/floor';
import RoomService from 'src/@core/service/room';
import CampusService from 'src/@core/service/campus';
import CleaningFormService from 'src/@core/service/form';

import { KeyboardArrowDown } from '@mui/icons-material';
import { KeyboardArrowUp } from '@mui/icons-material';
import CollapsibleForm from '../components/table/form/CollapsibleForm';
import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';
import { RoleConstants } from 'src/@core/constants/permission';
import { checkRole } from 'src/@core/utils/checkUserRole';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';


export default function FourView() {
  const [reload, setReload] = useState<boolean>()
  const [campus, setCampus] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [floors, setFloors] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [currentFormID, setCurrentFormID] = useState<string>('0');
  const [filterFormList, setFilterFormList] = useState<any[]>();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mockForm, setMockForm] = useState<any[]>();
  const [openRow, setOpenRow] = useState(null);
  const { showSuccess, showError } = useCustomSnackbar();

  const rowsPerPage = 10;
  const settings = useSettingsContext();



  const handleRefreshFilter = () => {
    setSelectedCampus(null);
    setSelectedBlocks(null);
    setBlocks([]);
    setSelectedFloor(null);
    setFloors([]);
    setSelectedRoom(null);
    setRooms([]);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const isAdmin = checkRole(RoleConstants.ADMIN)


  const handleAddFormSuccess = async (message: string) => {
    showSuccess(message);
    await fetchData();
    setReload(!reload);
    handleRefreshFilter();
  };

  const handleEditFormSuccess = async (message: string) => {
    showSuccess(message);
    await fetchData();
    setReload(!reload);
    handleRefreshFilter();
  }



  const filterForm = () => {
    let filteredForm = mockForm;
    if (selectedCampus !== null) {
      filteredForm = filteredForm?.filter(report => report?.campusName === campus.find(campus => campus.id === selectedCampus)?.campusName);
    }
    if (selectedBlocks !== null) {
      filteredForm = filteredForm?.filter(report => report?.blockName === blocks.find(block => block.id === selectedBlocks)?.blockName);
    }
    if (selectedFloor !== null) {
      filteredForm = filteredForm?.filter(report => report?.floorName === floors.find(floor => floor.id === selectedFloor)?.floorName);
    }
    if (selectedRoom !== null) {
      filteredForm = filteredForm?.filter(report => report?.roomName === rooms.find(room => room.id === selectedRoom)?.roomName);
    }

    const currentSize = page * rowsPerPage;
    if (filteredForm && filteredForm.length > 0) {
      if (currentSize > filteredForm.length) {
        setPage(0);
      }
      setFilterFormList(filteredForm);
    }
    else {
      setFilterFormList([]);
    }
  };


  useEffect(() => {
    filterForm();
  }, [selectedCampus, selectedBlocks, selectedFloor, selectedRoom])


  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response1: any = await CampusService.getAllCampus();
      const response3: any = await CleaningFormService.getAllCleaningForm();
      setCampus(response1);
      setMockForm(response3);

    } catch (error) {
      setError(error.message);
      console.error('Chi tiết lỗi:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddClick = () => {
    setIsEditing(false);
    setOpenPopUp(true);
  }
  const handleRowClick = (rowId: any) => {
    setOpenRow(openRow === rowId ? null : rowId);
  };


  useEffect(() => {
    setFilterFormList(mockForm);
  }, [mockForm]);

  const handleCampusSelect = async (CampusId: string) => {
    var campusId = CampusId;
    try {
      const response: any = await BlockService.getBlockByCampusId(campusId);
      setBlocks(response);
      setSelectedBlocks(null);
      setFloors([]);
      setSelectedFloor(null);
      setRooms([]);
      setSelectedRoom(null);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };
  const handleBlockSelect = async (blockId: string) => {
    var blockId = blockId;

    try {
      const response: any = await FloorService.getFloorByBlockId(blockId);
      if (response.length > 0) {
        setFloors(response);
        setRooms([]);
        setSelectedRoom(null);
      }
      else {
        setFloors([]);
        setSelectedFloor(null);
        setRooms([]);
        setSelectedRoom(null);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };

  const handleFloorSelect = async (floorId: string) => {
    var floorId = floorId;

    try {
      const response: any = await RoomService.getRoomsByFloorIdAndBlockId(floorId, selectedBlocks ? selectedBlocks : '');
      if (response.length > 0) {
        setSelectedRoom(null);
        setRooms(response);
      }
      else {
        setRooms([]);
        setSelectedRoom(null);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };



  useEffect(() => {
    if (filterFormList !== undefined) {
      filterForm();
    }
    else {
      fetchData();
    }
  }, [page]);

  const visibleRows = filterFormList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Danh sách các Form đánh giá</Typography>
        <Button variant='contained' onClick={handleAddClick} sx={{ display: isAdmin ? 'block' : 'none' }}>Tạo mới</Button>
        <Popup title={isEditing ? 'Chỉnh sửa Form' : 'Tạo mới Form'} openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
          {isEditing ? (
            <EditForm formId={currentFormID} setOpenPopup={setOpenPopUp} onSuccess={handleEditFormSuccess} />
          ) : (
            <AddForm setOpenPopup={setOpenPopUp} onSuccess={handleAddFormSuccess} />
          )
          }
        </Popup>
      </Box>
      <Box
        sx={{
          mt: 5,
          width: 1,
          minHeight: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            marginBottom: 2,
          }}>
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
                  setSelectedBlocks(null);
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
              value={blocks.find((b: any) => b.id === selectedBlocks) || null}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSelectedBlocks(newValue ? newValue.id : null);
                  handleBlockSelect(newValue ? newValue.id : '');
                }
                else {
                  setSelectedBlocks(null);
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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead sx={{ width: 1 }}>
                <TableRow>
                  <TableCell align='center' sx={{ width: '5px' }}>STT</TableCell>
                  <TableCell align='center'>Cơ sở</TableCell>
                  <TableCell align='center'>Tòa nhà</TableCell>
                  <TableCell align="center">Tầng</TableCell>
                  <TableCell align="center">Khu vực</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows?.map((form: any, index) => (
                  <React.Fragment key={form.id}>
                    <TableRow key={form.id} sx={{ marginTop: '5px' }}>
                      <TableCell align='center' sx={{ width: '5px' }}>{index + 1 + (page * 10)}</TableCell>
                      <TableCell align='center'>
                        {form.campusName}
                      </TableCell>
                      <TableCell align='center'>
                        {form.blockName}
                      </TableCell>
                      <TableCell align='center'>
                        {form.floorName}
                      </TableCell>
                      <TableCell align='center'>
                        {form.roomName}
                      </TableCell>
                      <TableCell align='right'>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleRowClick(form.id)}
                        >
                          {openRow === form.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={openRow === form.id} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <CollapsibleForm id={form.id} isAdmin={isAdmin}></CollapsibleForm>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>

                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

      </Box>

      <Box sx={{
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <TablePagination
          component="div"
          count={filterFormList?.length || 0}
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
