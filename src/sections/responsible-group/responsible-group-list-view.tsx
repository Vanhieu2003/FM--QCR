'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import {
  Autocomplete, TextField, Paper, Table, TableCell, TableContainer, TableRow, TableHead,
  TableBody, Button, IconButton, Menu, MenuItem,
  Link,
  TableFooter,
  Pagination,
  Collapse,
  TablePagination
} from '@mui/material';

import { useEffect, useState } from 'react';
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import { KeyboardArrowDown } from '@mui/icons-material';
import { KeyboardArrowUp } from '@mui/icons-material';
import React from 'react';
import CollapsibleResUserGroup from '../components/table/ResponsibleUserGroup/CollapsibleResUserGroup';
import Popup from '../components/form/Popup';
import AddResUserGroup from '../components/form/AddResUserGroup';

import { useCustomSnackbar } from 'src/hooks/use-snackbar';

// ----------------------------------------------------------------------

export default function ResponsibleGroupListView() {
  const settings = useSettingsContext();
  const [reload,setReload] = useState<boolean>();
  const [responsibleGroups, setResponsibleGroups] = useState<any[]>([]);
  const [openRow, setOpenRow] = useState(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const{showSuccess,showError} = useCustomSnackbar();
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  

  const [page,setPage] = useState(0);

  const rowsPerPage = 10;
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };


  const handleRowClick = (rowId: any) => {
    setOpenRow(openRow === rowId ? null : rowId);
  };

  const handleAddClick = async () => {
    setOpenPopUp(true);
  }

  const handleAddSuccess = (message: string) => {
    setOpenPopUp(false);

    showSuccess(message);
    fetchGroupUser();

  }
  const fetchGroupUser = async () => {
    try {
      const response: any = await ResponsibleGroupRoomService.getAllForGroupRoom();
      setResponsibleGroups(response);
     
    } catch (error: any) {
      console.error('Error fetching Room Group data:', error);
    }
  };


  useEffect(() => {
    fetchGroupUser();
  }, [pageNumber]);


 

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom:'20px' }}>
        <Typography variant="h4">Danh sách nhóm người chịu trách nhiệm</Typography>
        <Button
          variant="contained"
          onClick={handleAddClick}
        >
          Tạo mới
        </Button>
        <Popup title="Tạo mới nhóm người chịu trách nhiệm" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
          <AddResUserGroup setOpenPopup={setOpenPopUp} onSuccess={handleAddSuccess} />
        </Popup>
      </Box>


      {responsibleGroups.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Nhóm chịu trách nhiệm</TableCell>
                <TableCell align="center">Mô tả</TableCell>
                <TableCell align="center">Số lượng người</TableCell>
                <TableCell align="center">Màu</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responsibleGroups.map((responsibleGroup: any, index) => (
                <React.Fragment key={responsibleGroup.id}>
                  <TableRow key={`${responsibleGroup.id}-${index}`}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{responsibleGroup.groupName}</TableCell>
                    <TableCell align="center">{responsibleGroup.description}</TableCell>
                    <TableCell align="center">{responsibleGroup.numberOfUser}</TableCell>
                    <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: responsibleGroup.color,
                          border: '1px solid black',
                        }}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleRowClick(responsibleGroup.id)}
                      >
                        {openRow === responsibleGroup.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={openRow === responsibleGroup.id} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <CollapsibleResUserGroup id={responsibleGroup.id}  onSuccess={()=>
                          {fetchGroupUser();
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
        <Typography>Không có nhóm chịu trách nhiệm nào.</Typography>
      )}
     
       <Box sx={{
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <TablePagination
          component="div"
          count={responsibleGroups?.length || 0}
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
