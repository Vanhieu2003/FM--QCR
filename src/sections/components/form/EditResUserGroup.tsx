
import { Container, Box, Typography, Alert, AlertTitle, Autocomplete, TextField, InputAdornment, Checkbox, Stack, Button, CircularProgress, Select, InputLabel, FormControl, MenuItem } from '@mui/material';
import { id } from 'date-fns/locale';
import React, { useEffect, useState } from 'react'
import CampusService from 'src/@core/service/campus';
import GroupRoomService from 'src/@core/service/grouproom';
import { useSettingsContext } from 'src/components/settings';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RoomService from 'src/@core/service/room';
import UserService from 'src/@core/service/user';
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';


interface props {
    setOpenPopup: (open: boolean) => void;
    onSuccess: (message: string) => void;
    data: any;
    id: string;
}
const EditResUserGroup = ({ setOpenPopup, onSuccess, data, id }: props) => {
    const settings = useSettingsContext();
    const [responsibleGroup, setResponsibleGroup] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [customColor, setCustomColor] = useState('#000000');
    const [isCustom, setIsCustom] = useState(false);
    const [groupName, setGroupName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const{showSuccess,showError} = useCustomSnackbar();


    const colors = [
        { label: 'Xanh', value: '#0000FF' },
        { label: 'Đỏ', value: '#FF0000' },
        { label: 'Vàng', value: '#FFFF00' },
        { label: 'Tím', value: '#800080' },
        { label: 'Xanh Lá', value: '#008000' },
        { label: 'Hồng', value: '#FFC0CB' },
        { label: 'Cam', value: '#FFA500' },
        { label: 'Tùy chọn', value: 'custom' }
    ];

    const handleColorChange = (event: any) => {
        const value = event.target.value;
        setColor(value);
        setIsCustom(value === 'custom');
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response: any = await UserService.getAllUsers();
                setUsers(response);
            } catch (error: any) {
                console.error('Error fetching users data:', error);
            }
        };
        fetchUsers();
        fetchResponsibleGroup();
    }, []);
    const fetchResponsibleGroup = async () => {
        try {
            
            setResponsibleGroup(data);
            setGroupName(data.groupName);
            setDescription(data.description);
            setColor(data.color);
            setSelectedUsers(data.users || []);
            setLoading(false);
        } catch (error: any) {
            console.error('Error fetching responsible group:', error);
            setLoading(false);
        }

    };
    const handleSubmit = async () => {
        if (groupName === '' || selectedUsers.length === 0) {
 
            showError("Vui lòng điền đầy đủ thông tin")
            return;
        }
        else{
            try {
                const data = {
                    groupName,
                    description,
                    color,
                    Users: selectedUsers.map((user: any) => ({
                        id: user.id,
                        userName: user.userName,
                    })),
                };
             
                const response = await ResponsibleGroupRoomService.updateResponsibleGroup(id, data);
                if(response){
                    onSuccess('Sửa nhóm người chịu trách nhiệm thành công');
                    setOpenPopup(false);
                }
                
            } catch (error: any) {
  
                showError("Đã xảy ra lỗi, vui lòng thử lại sau")
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
            <Box >
                <FormControl fullWidth>
                    <InputLabel id="color-select-label">Chọn màu</InputLabel>
                    <Select
                        labelId="color-select-label"
                        id="color-select"
                        value={color}
                        label="Chọn màu"
                        onChange={handleColorChange}
                        renderValue={(value) => (
                            <Box
                                sx={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: value === 'custom' ? customColor : value,
                                    display: 'inline-block',
                                    marginRight: 1,
                                }}
                            />
                        )}
                    >
                        {colors.map((color) => (
                            <MenuItem key={color.value} value={color.value}>
                                <Box
                                    sx={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: color.value !== 'custom' ? color.value : 'transparent',
                                        border: color.value === 'custom' ? '1px dashed gray' : 'none',
                                        display: 'inline-block',
                                        marginRight: 1,
                                    }}
                                />
                                {color.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {isCustom && (
                    <TextField
                        id="custom-color-picker"
                        label="Màu tùy chọn"
                        type="color"
                        variant="outlined"
                        value={customColor}
                        onChange={(e) => {
                            setCustomColor(e.target.value);
                            setColor(e.target.value);
                        }}
                        fullWidth
                        sx={{ mt: 1 }}
                    />
                )}
            </Box>
            <Box>
                <Autocomplete
                    multiple
                    fullWidth
                    options={users}
                    disableCloseOnSelect
                    getOptionLabel={(option: any) => `${option.firstName} ${option.lastName}` || ''}
                    value={selectedUsers}
                    onChange={(event, newValue) => {
                        setSelectedUsers(newValue);
                        setUsers(prevUsers => {
                            const selectedIds = new Set(newValue.map(user => user.id));
                            return [...newValue, ...prevUsers.filter(user => !selectedIds.has(user.id))];
                        });
                    }}
                    renderOption={(props, option, { selected }) => (
                        <li {...props} key={option.id}>
                            <Checkbox
                                key={`checkbox-${option.id}`}
                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                style={{ marginRight: 8 }}
                                checked={selected || selectedUsers.some(user => user.id === option.id)}
                            />
                            {option.firstName} {option.lastName}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chọn người dùng"
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
                    noOptionsText="Không có dữ liệu người dùng"
                    loading={loading}
                    loadingText="Đang tìm kiếm..."
                />
            </Box>

            <Button onClick={handleSubmit} variant='contained'>Sửa</Button>
           
        </Container>
    );
}

export default EditResUserGroup