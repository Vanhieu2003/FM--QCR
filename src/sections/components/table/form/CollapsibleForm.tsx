import { Container, Typography, Paper, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Box, Button, Chip, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { GroupRoomService } from 'src/@core/service/grouproom';
import EditRoomGroup from '../../form/EditRoomGroup';

import  CleaningFormService  from 'src/@core/service/form';
import RenderRatingInput from '../../rating/renderRatingInput';
import Popup from '../../form/Popup';
import EditForm from '../../form/EditForm';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';

interface props{
    id:string;
    isAdmin:boolean;
}
const CollapsibleForm = ({id,isAdmin}:props) => {
    const [data, setData] = useState<any>({});
    const [openPopUp, setOpenPopUp] = useState<boolean>(false);
    const{showSuccess,showError} = useCustomSnackbar();
  
    const handleEditClick = () => {
        setOpenPopUp(true);
    }
    const handleEditFormSuccess = (message:string) =>{
        fetchFormData();
        showSuccess(message);
    }

    const fetchFormData = async () => {
        try {
            const response = await CleaningFormService.getFormInfoById(id);
            setData(response);
        } catch (error: any) {
            console.error('Error fetching responsible group:', error);
        }
    };
    useEffect(() => {
        fetchFormData();
    }, [])

    return (
        <Paper elevation={3} sx={{ position: 'relative',pb:isAdmin?8:0}}>
            <TableContainer component={Paper} sx={{ marginTop: '10px',maxHeight: '400px', overflowY: 'auto'  }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Tiêu chí</TableCell>
                <TableCell align="center">Đánh giá</TableCell>
                <TableCell align="center">Phân loại</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.criteriaList?.map((criterion:any,index:any) => (
                <>
                  <TableRow key={data.id}>
                    <TableCell align="center">
                      {index+1}
                    </TableCell>
                    <TableCell align="center">
                      {criterion.name}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RenderRatingInput criteriaID={criterion.id} inputRatingType={criterion.criteriaType} disabled={true} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction='row' spacing={1} justifyContent='center' >
                        {criterion.tags?.map((tag:any) =>
                          <Chip key={tag.id} label={tag.name} />
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
            <Box sx={{
                position: 'absolute',
                bottom: 16, 
                right: 16, 
                display: isAdmin?'flex':'none',
                justifyContent: 'flex-end'
            }}>
                <Button variant="contained" onClick={handleEditClick} >
                    Chỉnh sửa
                </Button>
                <Popup title="Chỉnh sửa Form" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
                    <EditForm setOpenPopup={setOpenPopUp} onSuccess={handleEditFormSuccess} formId={data?.idForm}/>
                </Popup>
            </Box>
          
        </Paper>
    )
}

export default CollapsibleForm