'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { useState, useEffect, useCallback, useRef } from 'react';
import CampusService from 'src/@core/service/campus';
import RoomService from 'src/@core/service/room';
import { Button, Checkbox, Stack, Autocomplete, TextField, CircularProgress } from '@mui/material';
import GroupRoomService from 'src/@core/service/grouproom';
import React from 'react';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


import UserService from 'src/@core/service/user';
import  UserPerTagService  from 'src/@core/service/userPerTag';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';

// ----------------------------------------------------------------------


type props = {
    setOpenPopup: (open: boolean) => void;
    onSuccess: (message: string) => void;
    data: any;

}

export default function EditUserPerTag({ setOpenPopup, onSuccess, data }: props) {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>(data.tagGroup.length > 0 ? data.tagGroup : []);
    const [loading, setLoading] = useState<boolean>(false);
    const {showError,showSuccess} = useCustomSnackbar();


    const fetchUser = async () => {
        try {
            const response:any = await UserService.getAllUsers();
            setUsers(response);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    const handleSubmit =async()=>{
        
        const completeData = {
            id:data.id,
            users:selectedUsers.map((user)=>user.id)
        }
        if(selectedUsers.length===0){
            showError("Vui lòng chọn ít nhất 1 người dùng");
            return;
        }
        const response:any = await UserPerTagService.updateUserPerTag(completeData);
        if(response){
            onSuccess("Sửa nhóm người dùng thành công");
            setOpenPopup(false);
        }
        else{
            showError("Lỗi khi sửa nhóm người dùng, vui lòng thử lại sau!")
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: '10px' }}>
            <Box sx={{ width: '100%' }}>
                <Autocomplete
                    fullWidth
                    sx={{ flex: 1 }}
                    options={[data.tagName]}
                    getOptionLabel={(option) => option}
                    value={data.tagName}
                    disabled
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chọn tag"
                            variant="outlined"
                        />
                    )}
                    noOptionsText="Không có dữ liệu tag"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
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
           
        </Box>
    );
}
