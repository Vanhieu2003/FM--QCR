'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { useState, useEffect } from 'react';
import {
    Button, TextField,
    Autocomplete,
} from '@mui/material';
import UserService from 'src/@core/service/user';
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import TagService from 'src/@core/service/tag';
import SendIcon from '@mui/icons-material/Send';
import UserPerTagService from 'src/@core/service/userPerTag';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';

// ----------------------------------------------------------------------
type AddUserPerTagProps = {
    setOpenPopup: (open: boolean) => void;
    onSuccess : ()=> void;
};
export default function UserPerTagCreate({ setOpenPopup, onSuccess }: AddUserPerTagProps) {
    const settings: any = useSettingsContext();
    const [tags, setTags] = useState<any>([]);
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string | null>('');
    const [users, setUsers] = useState<string[]>([]);
    const [groups, setGroups] = useState<any>([]);
    const [selectedThings, setSelectedThings] = useState<string[]>([]);
    const {showSuccess,showError} = useCustomSnackbar();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1 = await TagService.getAllTags();
                setTags(response1);
            } catch (error: any) {
                console.error('Error fetching users data:', error);
            }

        };
        fetchData();
    }, []);

    const handleSelectedType = async (Type: string) => {
    
        if (Type === 'user') {
            const response:any = await UserService.getAllUsers();
            setUsers(response);
        }
        else if (Type === 'group') {
            const response = await ResponsibleGroupRoomService.getAllResponsibleGroups();
            setGroups(response);
        }
    }

    const handleSubmit = async () => {
        const data = {
            'TagId': selectedTag,
            'Id': selectedThings,
            'Type': selectedType,
        }
   
        try {
            const response = await UserPerTagService.CreateUserPerTag(data);
            if (response) {
                showSuccess("Thêm thành công");
                onSuccess()
                setOpenPopup(false);
            }
        }
        catch (e) {
            showError("Đã xảy ra lỗi, vui lòng thử lại sau")
            console.log(e)
        }

    }
    return (
        <Box sx={{display:'flex', flexDirection:'column',gap:2}}>
            <Box sx={{ width: '100%' }}>
                <Autocomplete
                    fullWidth
                    sx={{ flex: 1 }}
                    options={tags}
                    getOptionLabel={(option: any) => option.tagName || ''}
                    value={tags.find((tag: any) => tag.id === selectedTag) || null}
                    onChange={(event, newValue) => {
                        setSelectedTag(newValue ? newValue.id : null);
                    }}
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
                    fullWidth
                    sx={{ flex: 1 }}
                    options={['group', 'user']}
                    getOptionLabel={(option: string) => {
                        switch (option) {
                            case 'group':
                                return 'Chọn theo nhóm';
                            case 'user':
                                return 'Chọn theo người';
                            default:
                                return '';
                        }
                    }}
                    value={selectedType}
                    onChange={(event, newValue) => {
                        setSelectedType(newValue);
                        handleSelectedType(newValue ? newValue : "");
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chọn thể loại"
                            variant="outlined"
                        />
                    )}
                    noOptionsText="Không có dữ liệu kiểu"
                    isOptionEqualToValue={(option, value) => option === value}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                {selectedType === 'user' ? (
                    <Autocomplete
                        multiple
                        fullWidth
                        options={users}
                        getOptionLabel={(option: any) => `${option.firstName} ${option.lastName}` || ''}
                        value={users.filter((user: any) => selectedThings.includes(user.id)) || []}
                        onChange={(event, newValue: any) => {
                            setSelectedThings(newValue ? newValue.map((item: any) => item.id) : []);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Chọn người"
                                variant="outlined"
                            />
                        )}
                        noOptionsText="Không có dữ liệu người dùng"
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                {`${option.firstName} ${option.lastName}`}
                            </li>
                        )}
                    />
                ) : selectedType === 'group' ? (
                    <Autocomplete
                        fullWidth
                        options={groups}
                        getOptionLabel={(option: any) => option.groupName || ''}
                        value={groups.find((group: any) => selectedThings.includes(group.id)) || null}
                        onChange={(event, newValue: any) => {
                            setSelectedThings(newValue ? [newValue.id] : []);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Chọn nhóm"
                                variant="outlined"
                            />
                        )}
                        noOptionsText="Không có dữ liệu nhóm"
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                ) : null}
            </Box>
            {selectedThings && selectedThings.length > 0 && (<Box >
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleSubmit}
                    sx={{width:'100%'}}
                >
                    Lưu
                </Button>
            </Box>)}
        </Box>

    )
}