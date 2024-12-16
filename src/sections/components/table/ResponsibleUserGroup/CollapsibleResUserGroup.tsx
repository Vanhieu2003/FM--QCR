import { Container, Paper, Typography, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Box, Button, Link, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import Popup from '../../form/Popup';
import EditResUserGroup from '../../form/EditResUserGroup';

import { useCustomSnackbar } from 'src/hooks/use-snackbar';


interface props {
    id: string;
    onSuccess: () =>void
}
const CollapsibleResUserGroup = ({ id,onSuccess }: props) => {

    const [responsibleGroup, setResponsibleGroup] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [openPopUp, setOpenPopUp] = useState<boolean>(false);
    const { showSuccess, showError } = useCustomSnackbar();


    const handleEditClick = () => {
        setOpenPopUp(true);
    }
    const handleEditRoomGroupSuccess = (message: string) => {
        showSuccess(message);
        fetchResponsibleGroup();
        onSuccess();
    }
    const fetchResponsibleGroup = async () => {
        try {
            const response = await ResponsibleGroupRoomService.getResponsibleGroupbyId(id);
            setResponsibleGroup(response);
            setLoading(false);
        } catch (error: any) {
            console.error('Error fetching responsible group:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResponsibleGroup();
    }, [id]);

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!responsibleGroup) {
        return (
            <Container>
                <Typography variant="h6" sx={{ marginTop: 3 }}>
                    Không tìm thấy thông tin của nhóm chịu trách nhiệm.
                </Typography>
            </Container>
        );
    }

    return (
        <Paper elevation={3} sx={{ position: 'relative', pb: '8px' }}>
            <Typography variant="h4" gutterBottom align="center">
                Thông tin thành viên nhóm chịu trách nhiệm
            </Typography>
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell align="left"><strong>Tên nhóm:</strong></TableCell>
                            <TableCell align="left">{responsibleGroup.groupName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><strong>Mô tả:</strong></TableCell>
                            <TableCell align="left">{responsibleGroup.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><strong>Màu sắc:</strong></TableCell>
                            <TableCell align="left">
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        backgroundColor: responsibleGroup.color,
                                        border: '1px solid black'
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><strong>Thành viên nhóm:</strong></TableCell>
                            <TableCell align="left">
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            {responsibleGroup.users && responsibleGroup.users.map((user: any) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TableCell>
                        </TableRow>


                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ position: 'absolute', right: '16px', bottom: '16px' }}>
                <Button variant="contained" onClick={handleEditClick}>
                    Chỉnh sửa
                </Button>
                <Popup title="Chỉnh sửa nhóm người chịu trách nhiệm" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
                    <EditResUserGroup setOpenPopup={setOpenPopUp} onSuccess={handleEditRoomGroupSuccess} id={id} data={responsibleGroup} />
                </Popup>
            </Box>

        </Paper>
    );
}

export default CollapsibleResUserGroup