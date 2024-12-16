'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState } from 'react';
import {
  Button,
  Collapse,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';

import Popup from '../../components/form/Popup';
import AddUserPerTag from '../../components/form/AddUserPerTag';
import UserPerTagListView from '../../components/userPerTag/userPerTagListView';
import TagService from 'src/@core/service/tag';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import React from 'react';
import CollapsibleUserPerTag from 'src/sections/components/userPerTag/CollapsibleUserPerTag';

// ----------------------------------------------------------------------

export default function UserPerTagCreate() {
  const settings: any = useSettingsContext();
  const [reload,setReload] = useState<boolean>(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [data, setData] = useState<any>([]);
  const [openRow, setOpenRow] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };


  const handleRowClick = (rowId: any) => {
    setOpenRow(openRow === rowId ? null : rowId);
  };
  
  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await TagService.getTagGroups();
      setData(response);
    }
    catch (e) {
      console.log(e)
    }
  }

  const visibleRows = data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <Box sx={{ marginTop: '10px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Typography variant='h4'>Danh sách các nhóm tag đã tạo</Typography>
          <Button
            variant='contained'
            onClick={() => setOpenPopUp(true)}
          >
            Tạo mới
          </Button>
          <Popup
            title='Thêm người chịu trách nhiệm cho từng Tag'
            openPopup={openPopUp}
            setOpenPopup={setOpenPopUp} >
            <AddUserPerTag setOpenPopup={setOpenPopUp} onSuccess={()=>{fetchData();setReload(!reload)}}/>
          </Popup>
        </Box>
        <Box>
          {/* <UserPerTagListView data={data} /> */}
          <TableContainer component={Paper} >
            <Table sx={{ minWidth: 650 }} aria-label="Danh sách báo cáo vệ sinh">
              <TableHead>
                <TableRow>
                  <TableCell align="center">STT</TableCell>
                  <TableCell align="center">Tên Tag</TableCell>
                  <TableCell align="center">Số lượng người</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows?.map((tag: any, index: any) => (
                  <React.Fragment key={tag.id}>
                    <TableRow key={tag.id}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{tag.tagName}</TableCell>
                      <TableCell align="center">{tag.numberOfUsers}</TableCell>
                      <TableCell align='right'>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleRowClick(tag.id)}
                        >
                          {openRow === tag.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={openRow === tag.id} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <CollapsibleUserPerTag id={tag.id} tagName={tag.tagName} onSuccess={()=>
                          {fetchData();
                          setReload(!reload)}}></CollapsibleUserPerTag>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>

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
              count={data?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[]}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
