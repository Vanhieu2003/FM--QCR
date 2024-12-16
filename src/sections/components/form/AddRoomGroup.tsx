'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { useState, useEffect, useCallback, useRef } from 'react';
import CampusService from 'src/@core/service/campus';
import RoomService from 'src/@core/service/room';
import { Button, Checkbox, Stack, Autocomplete, TextField, CircularProgress, createFilterOptions } from '@mui/material';
import GroupRoomService from 'src/@core/service/grouproom';
import React from 'react';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { useCustomSnackbar } from 'src/hooks/use-snackbar';

// ----------------------------------------------------------------------


type props = {
    setOpenPopup: (open: boolean) => void;
    onSuccess: (message: string) => void;
}

export default function AddRoomGroup({ setOpenPopup, onSuccess }: props) {
    const settings: any = useSettingsContext();
    const [campus, setCampus] = useState<any[]>([]);

    const [selectedCampus, setSelectedCampus] = useState<any>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedRooms, setSelectedRooms] = useState<any[]>([]);
    const [groupName, setGroupName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const {showError,showSuccess} = useCustomSnackbar();


    const filterOptions = createFilterOptions({
        ignoreCase: true,
        limit: 20,
        stringify: (option: any) => option.roomName
      });
    // Fetch tất cả campus khi component được render
    useEffect(() => {
        const fetchCampus = async () => {
            try {
                const response: any = await CampusService.getAllCampus();
                setCampus(response);
            } catch (error: any) {
                console.error('Error fetching campus data:', error);
            }
        };
        fetchCampus();
    }, []);

  

    const handleCampusChange = async (event: any, value: any) => {
        if (value && value.id) {
            setSelectedCampus(value);
            try {
                const response: any = await RoomService.getRoomByCampus(value.id);
                if (response && Array.isArray(response)) {
                
                    setRooms(response);

                } else {
                    console.error('Unexpected response format:', response);
                    setRooms([]);
                }
            } catch (error: any) {
                console.error('Error fetching rooms:', error);
            }
        }
    };



    const handleSubmit = async () => {
        if (groupName === '' || selectedRooms.length === 0) {
         
            showError("Vui lòng điền đầy đủ thông tin");
            return;
        }
        else {
            try {
                const data = {
                    groupName,
                    description,
                    Rooms: selectedRooms.map((room: any) => ({
                        id: room.id,
                        roomName: room.roomName,
                    })),
                };
                const response = await GroupRoomService.createGroupRooms(data);
                if(response){
                    onSuccess("Tạo thành công");
                    setOpenPopup(false);
                }
            } catch (error: any) {
               showError("Có lỗi xảy ra, vui lòng thử lại sau");
            }
        }

    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: '10px' }}>
            <Box>
                <TextField
                    fullWidth
                    id="group-name"
                    label="Nhập tên nhóm"
                    variant="outlined"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
            </Box>
            <Box>
                <TextField
                    fullWidth
                    id="group-description"
                    label="Nhập mô tả nhóm phòng"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Box>
            <Box>
                <Autocomplete
                    disablePortal
                    fullWidth
                    options={campus}
                    getOptionLabel={(option: any) => option.campusName || ''}
                    onChange={handleCampusChange}
                    renderInput={(params: any) => <TextField {...params} label="Chọn cơ sở" />}
                />
            </Box>
            <Box>
                <Autocomplete
                    multiple
                    fullWidth
                    options={rooms}
                    filterOptions={filterOptions}
                    disableCloseOnSelect
                    getOptionLabel={(option: any) => option.roomName || ''}
                    value={selectedRooms}
                    onChange={(event, newValue) => {
                        setSelectedRooms(newValue);
                        setRooms(prevRooms => {
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
                                checked={selected || selectedRooms.some(room => room.id === option.id)}
                            />
                            {option.roomName}
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
            </Box>

            <Button onClick={handleSubmit} variant='contained'>Tạo</Button>
           
        </Container>
    );
}
