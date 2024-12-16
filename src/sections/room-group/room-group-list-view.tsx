'use client';

import Box from '@mui/material/Box';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import {
  Autocomplete, TextField, Paper, Table, TableCell, TableContainer, TableRow, TableHead, TableBody,
  IconButton, Menu, MenuItem,
  Link,
  TableFooter,
  Pagination,
  Collapse,
  Button,
  TablePagination
} from '@mui/material';
import CampusService from 'src/@core/service/campus';
import { useEffect, useState } from 'react';
import GroupRoomService from 'src/@core/service/grouproom';
import CollapsibleRoomGroup from '../components/table/RoomGroup/CollapsibleRoomGroup';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React from 'react';
import Popup from '../components/form/Popup';
import AddRoomGroup from '../components/form/AddRoomGroup';

import { useCustomSnackbar } from 'src/hooks/use-snackbar';
import { checkRole } from 'src/@core/utils/checkUserRole';
import { RoleConstants } from 'src/@core/constants/permission';

// ----------------------------------------------------------------------

export default function RoomGroupListView() {
  const settings = useSettingsContext();
  const [reload,setReload] = useState<boolean>();
  const [campus, setCampus] = useState<any[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<any>();
  const [allGroupRooms, setAllGroupRooms] = useState<any[]>();
  const [filterGroupRooms, setFilterGroupRooms] = useState<any[]>();
  const [page, setPage] = useState<number>(0);
  const [openPopUpAdd, setOpenPopUpAdd] = useState<boolean>(false);
  const [openRow, setOpenRow] = useState(null);
  const{showSuccess,showError} = useCustomSnackbar();
  const isAdmin = checkRole(RoleConstants.ADMIN);

  const rowsPerPage = 10;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };


  const filterGroupRoom = () => {
    let filteredReports = allGroupRooms;
    if (selectedCampus !== null) {
      filteredReports = filteredReports?.filter(groupRoom => groupRoom.campusName === campus.find(campus => campus.id === selectedCampus)?.campusName);
    }
    const currentSize = page * rowsPerPage;
    if (filteredReports && filteredReports.length > 0) {
      if (currentSize > filteredReports.length) {
        setPage(0);
      }
      setFilterGroupRooms(filteredReports);
    }
    else {
      setFilterGroupRooms([]);
    }
  };


  const handleRowClick = (rowId: any) => {
    setOpenRow(openRow === rowId ? null : rowId);
  };

  const handleAddRoomGroupSuccess = async (message: string) => {
    showSuccess(message);
    fetchData();
  };


  const fetchData = async () => {
    try {
    
      const campusResponse:any = await CampusService.getAllCampus();
      const allGroupRooms:any = await GroupRoomService.getAllGroupRooms();
      setCampus(campusResponse);
      setAllGroupRooms(allGroupRooms);
    
    } catch (error: any) {
      console.error('Error fetching Room Group data:', error);
    }
  };

  useEffect(() => {
    setFilterGroupRooms(allGroupRooms);
  }, [allGroupRooms])


  useEffect(() => {
    if (filterGroupRooms !== undefined) {
      filterGroupRoom();
    }
    else {
      fetchData();
    }
  }, [page]);


  const handleAddClick = () => {
    setOpenPopUpAdd(true);
  }

  useEffect(() => {
    filterGroupRoom();
  }, [selectedCampus])


  const visibleRows = filterGroupRooms?.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Danh sách nhóm phòng</Typography>
      </Box>


      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginY: 2, alignItems: 'center' }}>
        <Autocomplete
          disablePortal
          options={campus}
          getOptionLabel={(option: any) => option.campusName || ''}
          sx={{ width: 300, marginY: 1 }}
          onChange={(event, value) => {
            setSelectedCampus(value ? value.id : null);
          }}
          noOptionsText="Không có dữ liệu cơ sở"
          renderInput={(params: any) => <TextField {...params} label="Chọn cơ sở" />}
        />
        <Button variant='contained' onClick={handleAddClick} sx={{ height: 'fit-content', padding: '10px',display:isAdmin?'block':'none' }}>Tạo mới</Button>
        <Popup title="Tạo mới nhóm phòng" openPopup={openPopUpAdd} setOpenPopup={setOpenPopUpAdd} >
          <AddRoomGroup setOpenPopup={setOpenPopUpAdd} onSuccess={handleAddRoomGroupSuccess} />
        </Popup>
      </Box>

      {filterGroupRooms && filterGroupRooms.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Cơ sở</TableCell>
                <TableCell align="center">Nhóm phòng</TableCell>
                <TableCell align="center">Mô tả </TableCell>
                <TableCell align="center">Số lượng phòng</TableCell>
                <TableCell align='center'></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows?.map((groupRoom: any, index) => (
                <React.Fragment key={groupRoom.id}>
                  <TableRow key={groupRoom.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{groupRoom.campusName}</TableCell>
                    <TableCell align="center">{groupRoom.groupName}</TableCell>
                    <TableCell align="center">{groupRoom.description}</TableCell>
                    <TableCell align="center">{groupRoom.numberOfRoom}</TableCell>
                    <TableCell align='right'>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleRowClick(groupRoom.id)}
                      >
                        {openRow === groupRoom.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={openRow === groupRoom.id} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <CollapsibleRoomGroup 
                          id={groupRoom.id} 
                          isAdmin={isAdmin} 
                          onSuccess={()=>
                          {fetchData();
                          setReload(!reload)}}/>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>

              ))}
            </TableBody>

          </Table>
        </TableContainer>
      ) : (
        <Typography>Không có báo cáo nào cho cơ sở này.</Typography>
      )}
   
      <Box sx={{
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <TablePagination
          component="div"
          count={filterGroupRooms?.length || 0}
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
