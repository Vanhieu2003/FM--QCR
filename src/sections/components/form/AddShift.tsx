import { Box, TextField, Autocomplete, Typography, Checkbox, Button, CircularProgress } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import RoomCategoryService from 'src/@core/service/RoomCategory';
import ShiftService from 'src/@core/service/shift';
import React from 'react';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { useCustomSnackbar } from 'src/hooks/use-snackbar';


interface props {
    setOpenPopUp: (open: boolean) => void
    onSuccess: (message: string) => void
}
const AddShift = ({ setOpenPopUp, onSuccess }: props) => {
    const [shiftName, setShiftName] = useState<string>('');
    const [areas, setAreas] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<any[]>([]);
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());
    const [loading, setLoading] = useState(false);
   
    const{showSuccess,showError} = useCustomSnackbar();
    const handleSubmit = async () => {
        if (shiftName === '' || !startTime || !endTime || selectedCategory.length === 0) {
          
            showError("Vui lòng nhập đầy đủ thông tin")
            return;
        }
        else {
            try {
                const data = {
                    shiftName,
                    startTime: startTime ? startTime.format('HH:mm') : '',
                    endTime: endTime ? endTime.format('HH:mm') : '',
                    category: selectedCategory.map((category) => category.id),
                };
                
                const response = await ShiftService.createShifts(data);

                if(response){
                    onSuccess("Tạo ca thành công");
                    setOpenPopUp(false);
                }
            } catch (error: any) {
                if(error.status === 409){
                
                    showError("Ca đã tồn tại cho khu vực này");
                }
            }
        }
    }


    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response:any = await RoomCategoryService.getAllRoomCategory();
                setAreas(response);
            } catch (error: any) {
                console.error('Lỗi khi tải danh sách khu vực:', error);
            }
        };
        fetchAreas();
    }, []);
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: '10px' }}>
            <TextField
                fullWidth
                id="group-name"
                label="Tên Ca"
                variant="outlined"
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
            />
            <Autocomplete
                multiple
                fullWidth
                options={areas}
                disableCloseOnSelect
                getOptionLabel={(option: any) => option.categoryName || ''}
                value={selectedCategory}
                onChange={(event, newValue) => {
                    setSelectedCategory(newValue);
                    setAreas((prevRooms) => {
                        const selectedIds = new Set(newValue.map(room => room.id));
                        return [...newValue, ...prevRooms.filter(room => !selectedIds.has(room.id))];
                    });
                }}
                renderOption={(props, option, { selected }) => (
                    <li {...props} key={option.id}>
                        <Checkbox
                            key={`checkbox-${option.id}`}
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected || selectedCategory.some(room => room.id === option.id)}
                        />
                        {option.categoryName}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Chọn phòng"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                noOptionsText="Không có dữ liệu phòng"
                loading={loading}
                loadingText="Đang tìm kiếm..."
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 2, margin: '20px 0' }}>
                    <TimePicker
                        sx={{ width: '100%' }}
                        ampm={false}
                        label="Thời gian bắt đầu"
                        value={startTime}
                        onChange={(newValue) => setStartTime(newValue)}
                    />

                    <TimePicker
                        sx={{ width: '100%' }}
                        ampm={false}
                        label="Thời gian kết thúc"
                        value={endTime}
                        onChange={(newValue) => setEndTime(newValue)}
                    />
                </Box>
            </LocalizationProvider>
            <Box >
                <Button onClick={handleSubmit} variant='contained' sx={{ width: '100%' }}>
                    Tạo
                </Button>
            </Box>
          
        </Box>
    )
}

export default AddShift