import { Container, Paper, Typography, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Box, Button, Link, CircularProgress, TableFooter } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Popup from '../form/Popup';
import TagService from 'src/@core/service/tag';
import EditUserPerTag from '../form/EditUserPerTag';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';



interface props {
    id: string;
    tagName: string;
    onSuccess: () =>void
}
const CollapsibleUserPerTag = ({ id, tagName,onSuccess }: props) => {
    const [reload,setReload] = useState<boolean>();
    const [loading, setLoading] = useState<boolean>(true);
    const [openPopUp, setOpenPopUp] = useState<boolean>(false);
    const [tagGroup, setTagGroup] = useState<any | null>(null);
    const{showSuccess,showError} = useCustomSnackbar();


    const handleEditClick = async () => {
        setOpenPopUp(true);
    }

    const handleEditTagSuccess = async (message: string) => {
        showSuccess(message);
        onSuccess();
        fetchTagGroupInfo();
        setReload(!reload);
    }

    const fetchTagGroupInfo = async () => {
        try {
            const response = await TagService.getGroupInfoByTagId(id);
            setTagGroup(response);
            setLoading(false);

        } catch (error: any) {
            console.error('Error fetching responsible group:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTagGroupInfo();
    }, []);

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (tagGroup.length === 0) {
        return (
            <Paper elevation={3} sx={{ pb: '8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ textAlign: 'center', marginY: '10px' }}>
                    <Typography variant="h6" >
                        Không có thành viên trong tag này
                    </Typography>
                </Box>

                <Button variant="contained" onClick={handleEditClick} sx={{ marginX: '10px' }}>
                    Chỉnh sửa
                </Button>
                <Popup title="Chỉnh sửa Tag" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
                    <EditUserPerTag setOpenPopup={setOpenPopUp} onSuccess={handleEditTagSuccess} data={{ id: id, tagName: tagName, tagGroup }} />
                </Popup>
                
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ position: 'relative', pb: '8px' }}>
            <Typography variant="h4" gutterBottom align="center">
                Thông tin thành viên của tag {tagGroup[0].tagName}
            </Typography>
            <TableContainer component={Paper} sx={{maxHeight:'400px',overflowY:'auto'}}>
                <Table sx={{ minWidth: 650 }} aria-label="Danh sách báo cáo vệ sinh">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">Tên thành viên</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Nhóm phòng</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tagGroup.map((user: any, index: any) => (
                            <TableRow key={user.id}>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="center">{`${user.firstName} ${user.lastName}`}</TableCell>
                                <TableCell align="center">{user.userName}</TableCell>
                                <TableCell align="center">{user.groupName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} align="right">
                                <Button variant="contained" onClick={handleEditClick}>
                                    Chỉnh sửa
                                </Button>
                                <Popup title="Chỉnh sửa Tag" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
                                    <EditUserPerTag setOpenPopup={setOpenPopUp} onSuccess={handleEditTagSuccess} data={{ id: id, tagName: tagName, tagGroup }} />
                                </Popup>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
           
        </Paper>
    );
}

export default CollapsibleUserPerTag