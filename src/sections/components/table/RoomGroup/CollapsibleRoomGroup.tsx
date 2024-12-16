import { Container, Paper, Typography, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Box, Button, Link } from '@mui/material';
import React, { useEffect, useState } from 'react'
import GroupRoomService from 'src/@core/service/grouproom';
import Popup from '../../form/Popup';
import EditRoomGroup from '../../form/EditRoomGroup';

import { useCustomSnackbar } from 'src/hooks/use-snackbar';


interface props {
    id: string;
    isAdmin: boolean;
    onSuccess: () => void
}
const CollapsibleRoomGroup = ({ id, isAdmin, onSuccess }: props) => {
    const [reload,setReload] = useState<boolean>();
    const [data, setData] = useState<any>();
    const [openPopUp, setOpenPopUp] = useState<boolean>(false);
    const { showSuccess, showError } = useCustomSnackbar();


    const handleEditClick = () => {
        setOpenPopUp(true);
    }
    const handleEditRoomGroupSuccess = (message: string) => {
        showSuccess(message);
        fetchRoomGroup();
        onSuccess();
        setReload(!reload);
    }

    const fetchRoomGroup = async () => {
        try {
            const response = await GroupRoomService.getRoomGroupById(id);
            setData(response);
        } catch (error: any) {
            console.error('Error fetching responsible group:', error);
        }
    };
    useEffect(() => {
        fetchRoomGroup();
    }, [])
    if (!data) {
        return (
            <Container>
                <Typography variant="h6" sx={{ marginTop: 3 }}>
                    Không tìm thấy thông tin của nhóm phòng.
                </Typography>
            </Container>
        );
    }
    return (
        <Paper elevation={3} sx={{ position: 'relative', pb: isAdmin ? 8 : 0 }}>

            <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '10%' }} align='center'><strong>STT</strong></TableCell>
                            <TableCell sx={{ width: '20%' }} align='center'><strong>Cơ sở</strong></TableCell>
                            <TableCell sx={{ width: '20%' }} align='center'><strong>Tòa nhà</strong></TableCell>
                            <TableCell sx={{ width: '15%' }} align='center'><strong>Tầng</strong></TableCell>
                            <TableCell sx={{ width: '15%' }} align='center'><strong>Khu vực</strong></TableCell>
                            <TableCell sx={{ width: '20%' }} align='center'><strong>Phòng</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.rooms && data.rooms.map((room: any, index: any) => (
                            <TableRow key={room.id}>
                                <TableCell sx={{ width: '10%' }} align='center'>{index + 1}</TableCell>
                                <TableCell sx={{ width: '20%' }} align='center'>{room.campusName}</TableCell>
                                <TableCell sx={{ width: '20%' }} align='center'>{room.blockName}</TableCell>
                                <TableCell sx={{ width: '15%' }} align='center'>{room.floorName}</TableCell>
                                <TableCell sx={{ width: '15%' }} align='center'>{room.categoryName}</TableCell>
                                <TableCell sx={{ width: '20%' }} align='center'>{room.roomName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <Box sx={{
                position: 'absolute',
                bottom: 16, // Khoảng cách từ bottom
                right: 16, // Khoảng cách từ right
                display: isAdmin ? 'flex' : 'none',
                justifyContent: 'flex-end'
            }}>
                <Button variant="contained" onClick={handleEditClick}>
                    Chỉnh sửa
                </Button>
                <Popup title="Chỉnh sửa nhóm phòng" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
                    <EditRoomGroup setOpenPopup={setOpenPopUp} onSuccess={handleEditRoomGroupSuccess} id={id} data={data} />
                </Popup>
            </Box>
        </Paper>
    )
}

export default CollapsibleRoomGroup