"use client"
import { Typography, IconButton, Popover, FormControl, Select, MenuItem, Box, TextField, Autocomplete, Button } from '@mui/material';
import React, { EventHandler, useEffect, useState } from 'react'
import RenderRatingInput from '../rating/renderRatingInput';
import EditIcon from '@mui/icons-material/Edit';
import TagService from 'src/@core/service/tag';
import CriteriaService from 'src/@core/service/criteria';
import RoomCategoryService from 'src/@core/service/RoomCategory';

interface Tag {
    id?: string;
    tagName: string;
}

type Criteria = {
    id?: string,
    criteriaName: string,
    roomCategoryId: string,
    criteriaType: string,
    tags?: Tag[]|string[]
};

type RoomCategorical = {
    id: string,
    categoryCode: string,
    categoryName: string,
    createdAt: string,
    updatedAt: string,
    rooms: any[]
}

type AddCriteriaFormProps = {
    setOpenPopup: (open: boolean) => void;
    onSuccess:(message:string)=>void;
};

const EditCriteria = ({ setOpenPopup,onSuccess }: AddCriteriaFormProps) => {
    const [ratingTypesSelected, setRatingTypesSelected] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [roomCategories, setRoomCategories] = useState<RoomCategorical[]>([]);
    const [error, setError] = useState(null);
    const [criteriaName, setCriteriaName] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [tags, setTags] = useState<Tag[]>([]);
    const [allOptions, setAllOptions] = useState<Tag[]>([]);
    const [tagsSelected, setTagsSelected] = useState<Tag[]>([]);

    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const tagsResponse:any = await TagService.getAllTags();
                setTags(tagsResponse);
                setAllOptions(tagsResponse);
            } catch (error) {
                setError(error.message);
                console.error('Chi tiết lỗi khi lấy Criteria:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTags();
    }, []);
    useEffect(() => {
        const fetchRoomCategorical = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response:any = await RoomCategoryService.getAllRoomCategory();
                setRoomCategories(response);
            } catch (error) {
                setError(error.message);
                console.error('Chi tiết lỗi khi lấy room category:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoomCategorical();
    }, []);

    const handleTagChange = (event: any, newValue: (Tag | string)[]) => {
        const updatedTagsSelected: Tag[] = newValue.map((tag) => {
            if (typeof tag === 'string') {
                // Tạo Tag mới nếu tag là chuỗi
                const newTag: Tag = { tagName: tag };
                return newTag;
            } else {
                return tag;
            }
        });
        setTagsSelected(updatedTagsSelected);
    };


    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleTypeChang = (e: any) => {
        setRatingTypesSelected(e.target.value)
        handleClose();
    }

    const handleRoomCategoricalSelected = async (roomCategoricalId: string) => {
        setSelectedRoom(roomCategoricalId);

    }
    const handleSave = async () => {
        const newCriteria: Criteria = {
            criteriaName: criteriaName,
            criteriaType: ratingTypesSelected ? ratingTypesSelected : 'BINARY',
            roomCategoryId: selectedRoom,
            tags: tagsSelected.map(tag => tag.tagName)
        };

        const response = await CriteriaService.postCriteria(newCriteria);
        if(response){
            onSuccess("Tiêu chí đã được chỉnh sửa thành công")
            setOpenPopup(false);
        }
        
    };


    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography>
                    Tên tiêu chí
                </Typography>
                <TextField value={criteriaName} onChange={(e) => setCriteriaName(e.target.value)}>

                </TextField>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography>
                    Loại tiêu chí
                </Typography>
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <RenderRatingInput inputRatingType={ratingTypesSelected} />
                    <IconButton onClick={(event) => handleClick(event)}>
                        <EditIcon />
                    </IconButton>
                </Box>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <FormControl>
                        <Select
                            value={ratingTypesSelected || 'Chọn kiểu'}
                            onChange={(e) => handleTypeChang(e)}
                        >
                            <MenuItem value='Chọn kiểu'>Chọn kiểu</MenuItem>
                            <MenuItem value='BINARY'>Đạt/Không đạt</MenuItem>
                            <MenuItem value='RATING'>Rating</MenuItem>
                        </Select>
                    </FormControl>
                </Popover>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography>
                    Khu vực
                </Typography>
                <Autocomplete
                    style={{ margin: "10px 0" }}
                    id="room-category-autocomplete"
                    options={roomCategories}
                    getOptionLabel={(option) => option.categoryName}
                    value={roomCategories.find((c: any) => c.id === selectedRoom) || null}
                    onChange={(event, newValue) => {
                        handleRoomCategoricalSelected(newValue?.id || '');
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Danh mục phòng"
                            placeholder="Chọn danh mục phòng"
                        />
                    )}
                    noOptionsText="Không có dữ liệu phòng"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Autocomplete
                    style={{ margin: "10px 0" }}
                    multiple
                    id="tags-outlined"
                    options={allOptions}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.tagName}
                    defaultValue={[]}
                    freeSolo
                    autoSelect
                    onChange={(e, value) => handleTagChange(e, value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tags"
                            placeholder="Tags"
                        />
                    )}
                />
            </Box>

            <Button onClick={handleSave} sx={{ float: 'right' }}>Tạo</Button>
        </Box>
    )
}

export default EditCriteria