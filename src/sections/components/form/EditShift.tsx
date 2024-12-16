import { Box, TextField, Autocomplete, Typography, Checkbox, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import RoomCategoryService from 'src/@core/service/RoomCategory';
import ShiftService from 'src/@core/service/shift';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';

interface props {
    data: any;
    setOpenPopUp: (open: boolean) => void
    onSuccess: (message: string) => void
}
const EditShift = ({ data, setOpenPopUp, onSuccess }: props) => {
    const [selectedShift, setSelectedShift] = useState<any>(data);
    const [areas, setAreas] = useState<any>([]);
    const { showError, showSuccess } = useCustomSnackbar();
    const handleSubmit = async () => {
        if (selectedShift) {
            try {
                const response: any = await ShiftService.editShifts(selectedShift.id, {
                    shiftName: selectedShift.shiftName,
                    category: [selectedShift.roomCategoryId],
                    startTime: selectedShift.startTime,
                    endTime: selectedShift.endTime,
                    status: selectedShift.status,
                });
                if(response){
                    onSuccess("Chỉnh sửa thành công");
                    setOpenPopUp(false);
                }
            } catch (error) {
                showError('Có lỗi xảy ra khi sửa ca làm việc.');
            }
        }
     
    }

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await RoomCategoryService.getAllRoomCategory();
                setAreas(response);
            } catch (error: any) {
                console.error('Lỗi khi tải danh sách khu vực:', error);
            }
        };
        fetchAreas();
    }, []);
    return (
        <Box>
            <TextField
                label="Tên Ca"
                value={selectedShift?.shiftName || ''}
                onChange={(e) => setSelectedShift({ ...selectedShift, shiftName: e.target.value })}
                fullWidth
                margin="dense"
            />
            <Autocomplete
                value={selectedShift?.categoryName || ''}
                disabled
                onChange={(event, newValue) => setSelectedShift({ ...selectedShift, categoryName: newValue })}
                options={areas.map((area: any) => area.categoryName)}
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
            <Box >
                <Button onClick={handleSubmit} fullWidth variant='contained'>
                    Lưu
                </Button>
            </Box>
        </Box>
    )
}

export default EditShift