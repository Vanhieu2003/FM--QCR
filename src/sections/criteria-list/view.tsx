"use client"
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import "src/global.css";
import { Autocomplete, Button, Chip, Stack, TextField, Pagination, Typography, TablePagination } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RenderRatingInput from 'src/sections/components/rating/renderRatingInput';
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from 'src/sections/components/form/Popup';
import AddCriteria from 'src/sections/components/form/AddCriteria';
import CriteriaService from 'src/@core/service/criteria';
import TagService from 'src/@core/service/tag';
import RoomCategoryService from 'src/@core/service/RoomCategory';

import { useSettingsContext } from 'src/components/settings/context';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { checkRole } from 'src/@core/utils/checkUserRole';
import { RoleConstants } from 'src/@core/constants/permission';
dayjs.locale('vi');

type Criteria = {
  id: string,
  criteriaName: string,
  roomCategoryId: string,
  criteriaType: string,
  createAt: string,
  updateAt: string,
  tags: Tag[],
  roomName: string
};
type Tag = {
  id: number;
  tagName: string;
};


export default function FiveView() {
  const settings = useSettingsContext();
  const [reload,setReload] = useState<boolean>();
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [openAutocomplete, setOpenAutocomplete] = useState<{ [key: string]: boolean }>({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [mockCriteria,setMockCriteria] = useState<Criteria[]>();
  const [filterCriteriaList,setFilterCriteriaList] = useState<Criteria[]>();
  const{showSuccess,showError} = useCustomSnackbar();
  const {user} = useAuthContext();
  const rowsPerPage = 10;

  const isAdmin = checkRole(RoleConstants.ADMIN);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleAddCriteriaSuccess = () => {
    showSuccess("Thêm tiêu chí thành công")
    fetchCriteriaAndTags();
    setReload(!reload);
  };



  const filterCriteria = () => {
    let filteredCriteria = mockCriteria;
    if(searchTerm){
      filteredCriteria = filteredCriteria?.filter((criteria) => criteria.criteriaName.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedTags.length > 0){
      filteredCriteria = filteredCriteria?.filter((criteria) => {
        return selectedTags.every(selectedTag =>
          criteria.tags.some(tag => tag.tagName === selectedTag.tagName)
        );
      });
    }
   
    const currentSize = page * rowsPerPage;
    if(filteredCriteria && filteredCriteria.length > 0){
      if(currentSize > filteredCriteria.length){
        setPage(0);
      }
      setFilterCriteriaList(filteredCriteria);
    }
    else{
      setFilterCriteriaList([]);
    }
  };
 

  const fetchCriteriaAndTags = async () => {
    setIsLoading(true);
    setError(null);
    try {
   
      const tagsResponse:any = await TagService.getAllTags();
      const allCriteriaResponse:any = await CriteriaService.getAllCriterias();
      const allCriteriaWithTags = await Promise.all(allCriteriaResponse.map(async (criteria: Criteria) => {
        try {
          const tagsResponse = await TagService.getTagsByCriteriaId(criteria.id);
          const roomCategoryResponse:any = await RoomCategoryService.getRoomCategoryById(criteria.roomCategoryId);
          return { ...criteria, tags: tagsResponse, roomCategoryName: roomCategoryResponse.categoryName };
        } catch (tagError) {
          console.error(`Lỗi khi lấy tags cho criteria ${criteria.id}:`, tagError);
          return { ...criteria, tags: [] };
        }
      }));
      setCriteriaList(allCriteriaWithTags);
      setAllTags(tagsResponse);
      setMockCriteria(allCriteriaWithTags);
      
    } catch (error) {
      setError(error.message);
      console.error('Chi tiết lỗi khi lấy Criteria:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setFilterCriteriaList(mockCriteria);
  }, [mockCriteria]);

  useEffect(() => {
    filterCriteria();
  }, [selectedTags,searchTerm]);


 

  useEffect(() => {
    if (filterCriteriaList !== undefined) {
      filterCriteria();
    }
    else {
      fetchCriteriaAndTags();
    }
  }, [page]);

  

  const handleAutocompleteChange = (criteriaID: string, newValue: (Tag | null)[]) => {
    const updatedTags = criteriaList.map((criteria) => {
      if (criteria.id === criteriaID) {
        return {
          ...criteria,
          tags: newValue.filter((tag): tag is Tag => tag !== null && tag !== undefined),
        };
      }
      return criteria;
    });
    setSelectedCriteria(
      updatedTags.find((criteria) => criteria.id === criteriaID) || null
    );
  };

  const handleTagChange = (event: any, newValue: Tag[]) => {
    const updatedTagsSelected: Tag[] = newValue.map((tag) => {
      return tag;
    });
    setSelectedTags(updatedTagsSelected);
  };

  const HandleRemoveCriteria = (criteriaId: string) => {
    CriteriaService.disableCriteria(criteriaId);
    showSuccess("Xóa tiêu chí thành công");
    fetchCriteriaAndTags();
    setReload(!reload);
  }

  const visibleRows = filterCriteriaList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4">Danh sách các tiêu chí đánh giá</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginY: '15px' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Tìm kiếm tiêu chí"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value)}}
            
          />
          <Autocomplete
            multiple
            options={allTags}
            getOptionLabel={(option) => option.tagName}
            value={selectedTags}
            sx={{ width: 300 }}
            onChange={(e, value) => handleTagChange(e, value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lọc theo tag"
                placeholder="Chọn tag"
              />
            )}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  label={option.tagName}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
          />
        </Box>

        <Button variant='contained' onClick={() => setOpenPopUp(true)} sx={{display:isAdmin?'block':'none'}}>Tạo mới</Button>
        <Popup title='Form đánh giá' openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
          <AddCriteria setOpenPopup={setOpenPopUp} onSuccess={handleAddCriteriaSuccess}/>
        </Popup>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead sx={{ width: 1 }}>
            <TableRow>
              <TableCell align='center'>Tiêu chí</TableCell>
              <TableCell align="center">Đánh giá</TableCell>
              <TableCell align="center">Khu vực</TableCell>
              <TableCell align="center">Phân loại</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows?.map((criteria:any) => (
              <TableRow key={criteria.id}>
                <TableCell>{criteria.criteriaName}</TableCell>
                <TableCell>
                  <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RenderRatingInput criteriaID={criteria.id} inputRatingType={criteria.criteriaType} disabled={true} />
                  </Box>
                </TableCell>
                <TableCell align="center">{criteria.roomCategoryName}</TableCell>
                <TableCell>
                  <Stack direction='row' spacing={1}>
                    {criteria.tags?.map((tag:any) =>
                      <Chip key={tag.id} label={tag.tagName} />
                    )}
                  </Stack>
                  {openAutocomplete[criteria.id] && (
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={criteria.tags || []}
                      freeSolo
                      value={criteria.tags || []}
                      onChange={(event, newValue) => handleAutocompleteChange(criteria.id, newValue as Tag[])}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Tiêu chí"
                          placeholder="Select or add criteria"
                        />
                      )}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  <DeleteOutlineOutlinedIcon sx={{ marginRight: '5px', cursor: 'pointer',display:isAdmin?'block':'none' }} onClick={() => HandleRemoveCriteria(criteria.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    
      <Box sx={{
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <TablePagination
          component="div"
          count={filterCriteriaList?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Box>
      
    </Container>
  );
}
