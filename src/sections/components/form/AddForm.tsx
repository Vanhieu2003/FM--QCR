import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Autocomplete, Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material';
import RoomService from 'src/@core/service/room';
import BlockService from 'src/@core/service/block';
import CampusService from 'src/@core/service/campus';
import CriteriaService from 'src/@core/service/criteria';
import FloorService from 'src/@core/service/floor';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CleaningFormService from 'src/@core/service/form';
import throttle from 'lodash/throttle';
import { debounce } from 'lodash';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';

interface Campus {
  id: string;
  campusCode: string;
  campusName: string;
  campusName2: string;
  campusSymbol: string;
  sortOrder: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
interface Blocks {
  id: string,
  blockCode: string,
  blockName: string,
  blockName2: string,
  blockNo: string,
  dvtcode: string,
  dvtname: string,
  assetTypeCode: string,
  assetTypeName: string,
  sortOrder: number,
  useDepartmentCode: string,
  useDepartmentName: string,
  manageDepartmentCode: string,
  manageDepartmentName: string,
  floorArea: number,
  contructionArea: number,
  functionCode: string,
  functionName: string,
  valueSettlement: number,
  originalPrice: number,
  centralFunding: number,
  localFunding: number,
  otherFunding: number,
  statusCode: string,
  statusName: string,
  campusCode: string,
  campusName: string,
  campusId: string,
  createdAt: string,
  updatedAt: string
}


type Floor = {
  id: string,
  floorCode: string,
  floorName: string,
  description: string,
  floorOrder: number,
  basementOrder: number,
  sortOrder: number,
  notes: string,
  createdAt: string,
  updatedAt: string
};

type Room = {
  id: string,
  roomCode: string,
  roomName: string,
  description: string,
  roomNo: string,
  dvtcode: string,
  dvtname: string,
  assetTypeCode: string,
  assetTypeName: string,
  useDepartmentCode: string,
  useDepartmentName: string,
  manageDepartmentCode: string,
  manageDepartmentName: string,
  numberOfSeats: number,
  floorArea: number,
  contructionArea: number,
  valueSettlement: number,
  originalPrice: number,
  centralFunding: number,
  localFunding: number,
  otherFunding: number,
  statusCode: string,
  statusName: string,
  sortOrder: number,
  blockId: string,
  roomCategoryId: string,
  floorId: string,
  createdAt: string,
  updatedAt: string,
  roomCategory: null | any,
  lessons: any[]
};
type Tag = {
  Id: string;
  name: string;
};


type Criteria = {
  id: string,
  criteriaName: string,
  roomCategoryId: string,
  criteriaType: string,
  tags?: Tag[]
};





type AddFormProps = {
  setOpenPopup: (open: boolean) => void;
  onSuccess: (message: string) => void;
}
const AddForm = ({ setOpenPopup,onSuccess }: AddFormProps) => {
  const [campus, setCampus] = useState<Campus[]>([]);
  const [blocks, setBlocks] = useState<Blocks[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [options, setOptions] = useState<string>("one");
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [selectedCriteriaList, setSelectedCriteriaList] = useState<Criteria[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const {showSuccess,showError} = useCustomSnackbar();

  const fetchRooms = useCallback(async (input: string) => {
    setLoading(true);
    try {
      let response:any
      if(input.trim().length>1){
        response = await RoomService.searchRooms(input);
      }
      else{
        response = await RoomService.getAllRooms();
      }
      // Kết hợp kết quả tìm kiếm với các phòng đã chọn
      const searchResults = response;
      const selectedRoomIds = new Set(selectedRooms.map(room => room.id));
      
      // Lọc ra các phòng từ kết quả tìm kiếm mà chưa có trong selectedRooms
      const newRooms = searchResults.filter((room:any) => !selectedRoomIds.has(room.id));
      
      // Kết hợp selectedRooms với kết quả tìm kiếm mới
      setRooms([...selectedRooms, ...newRooms]);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm phòng:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedRooms]);

  const debouncedFetchRooms = useCallback(
    debounce((input: string) => {
      if (input.trim().length >= 1) {
        fetchRooms(input);
      }
      else{
        fetchRooms('');
      }
    }, 500),
    [fetchRooms]
  );

  const handleInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    debouncedFetchRooms(newInputValue);
  };

  const handleSave = async () => {
    if (options === "one") {
      if (selectedCampus === null) {
        showError('Vui lòng chọn cơ sở');
        return;
      }
      if (selectedBlocks === null) {
        showError('Vui lòng chọn tòa nhà');
        return;
      }
      if (selectedFloor === null) {
        showError('Vui lòng chọn tầng');
        return;
      }
      if (selectedRoom === null) {
        showError('Vui lòng chọn phòng');
        return;
      }
    }
    else {
      if (selectedRooms === null) {
        showError('Vui lòng chọn phòng');
        return;
      }
    }


    const Criterialist = selectedCriteriaList;
    if (Criterialist.length === 0) {
      showError('Vui lòng chọn ít nhất 1 tiêu chí');
      return;
    }
    const newForm = {
      formName: options === "one" ? "Form cho phòng đơn" : "Form cho nhiều phòng",
      RoomId: options === "one"
        ? [{ id: selectedRoom }]
        : selectedRooms.map(room => ({ id: room.id })),
      criteriaList: selectedCriteriaList.map(criteria => ({ id: criteria.id }))
    };

    try {
      const response = await CleaningFormService.postCleaningForm(newForm);
      if(response){
        onSuccess("Form đã được tạo thành công")
        setOpenPopup(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo form:", error);
      showError('Có lỗi xảy ra khi tạo form');
    }
  }


  const handleCriteriaChange = (criteria: Criteria) => {
    setSelectedCriteriaList((prevSelectedCriteriaList) => {
      let newSelectedCriteriaList;
      if (prevSelectedCriteriaList.some((c) => c.id === criteria.id)) {
        newSelectedCriteriaList = prevSelectedCriteriaList.filter((c) => c.id !== criteria.id);
      } else {
        newSelectedCriteriaList = [...prevSelectedCriteriaList, criteria];
      }
      return newSelectedCriteriaList;
    });

  };
  useEffect(() => {
    const fetchCampus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response1:any = await CampusService.getAllCampus();
        setCampus(response1);
      }
      catch (error) {
        setError(error.message);
        console.error('Chi tiết lỗi:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampus();
  }, []);

  useEffect(() => {
    setSelectedBlocks(null);
    setSelectedFloor(null);
    setSelectedRoom(null);
  }, [selectedCampus]);
  const handleCampusSelect = async (CampusId: string) => {
    var campusId = CampusId;
    try {
      const response:any = await BlockService.getBlockByCampusId(campusId);
      setBlocks(response);
      setFloors([]);
      setRooms([]);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };
  const handleBlockSelect = async (blockId: string) => {
    var blockId = blockId;
    try {
      const response:any = await FloorService.getFloorByBlockId(blockId);
      if (response.length > 0) {
        setFloors(response);
        setRooms([]);
      }
      else {
        setFloors([]);
        setRooms([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };

  const handleFloorSelect = async (floorId: string) => {
    var floorId = floorId;

    try {
      const response:any = await RoomService.getRoomsByFloorIdAndBlockId(floorId,selectedBlocks?selectedBlocks:'');
      if (response.length > 0) {
        setRooms(response);
      }
      else {
        setRooms([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };

  const handleRoomSelect = async (roomId: string) => {

    var roomCategoryId = rooms.find(room => room.id === roomId)?.roomCategoryId;
    const response:any = await CriteriaService.getCriteriaByRoomCategoryId(roomCategoryId || '');
    setCriteriaList(response);

  }

  const handleOptionChange = async (option: string) => {
    setOptions(option);

    if (option === "one") {
      setBlocks([]);
      setFloors([]);
      setRooms([]);
      setCriteriaList([]);
      setSelectedCampus(null);
      setSelectedBlocks(null);
      setSelectedFloor(null);
      setSelectedRoom(null);
      setSelectedCriteriaList([]);
      setSelectedRooms([]);
    }
    if (option === "many") {
      setSelectedCriteriaList([]);
      setSelectedRooms([]);
      const response1:any = await CriteriaService.getAllCriterias();
      const response2:any = await RoomService.getAllRooms();
      setCriteriaList(response1);
      setRooms(response2);
    }
  }

  const renderOneFormContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Autocomplete
        fullWidth
        sx={{ marginY: 2 }}
        options={campus}
        getOptionLabel={(option: Campus) => option.campusName || ''}
        value={campus.find((c: Campus) => c.id === selectedCampus) || null}
        onChange={(event, newValue) => {
          setSelectedCampus(newValue ? newValue.id : null);
          if (newValue) handleCampusSelect(newValue.id);
        }}
        renderInput={(params) => <TextField {...params} label="Chọn cơ sở" variant="outlined" />}
        noOptionsText="Không có dữ liệu cơ sở"
      />
      <Autocomplete
        fullWidth
        sx={{ marginY: 2 }}
        options={blocks}
        getOptionLabel={(option: any) => option.blockName || ''}
        value={blocks.find((b: any) => b.id === selectedBlocks) || null}
        onChange={(event, newValue) => {
          if (newValue) {
            setSelectedBlocks(newValue ? newValue.id : null);
            handleBlockSelect(newValue ? newValue.id : '');
          }
          else {
            setSelectedBlocks(null);
            setFloors([]);
            setSelectedFloor(null);
            setRooms([]);
            setSelectedRoom(null);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Chọn tòa nhà"
            variant="outlined"
          />
        )}
        noOptionsText="Không có dữ liệu tòa nhà"
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
      <Autocomplete
        fullWidth
        sx={{ marginY: 2 }}

        options={floors}
        getOptionLabel={(option: Floor) => option.floorName || ''}
        value={floors.find(floor => floor.id === selectedFloor) || null}
        onChange={(event, newValue) => {
          if (newValue) {
            setSelectedFloor(newValue ? newValue.id : null);
            handleFloorSelect(newValue ? newValue.id : '');
          }
          else {
            setSelectedFloor(null);
            setRooms([]);
            setSelectedRoom(null);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Chọn tầng"
            variant="outlined"
          />
        )}
        noOptionsText="Không có dữ liệu tầng"
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
      <Autocomplete
        fullWidth
        sx={{ marginY: 2 }}
        options={rooms}
        getOptionLabel={(option: any) => option.roomName || ''}
        value={rooms.find(room => room.id === selectedRoom) || null}
        onChange={(event, newValue) => {
          if (newValue) {
            setSelectedRoom(newValue ? newValue.id : null);
            handleRoomSelect(newValue ? newValue.id : '');
          }
          else {
            setSelectedRoom(null);
            setCriteriaList([]);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Chọn phòng"
            variant="outlined"
          />
        )}
        noOptionsText="Không có dữ liệu phòng"
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.roomName}
          </li>
        )}
      />
      <Typography variant="h6">Chọn tiêu chí</Typography>
      <Box sx={{
        maxHeight: '100px',
        overflowY: 'auto',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '10px',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}>
        <FormGroup>
          {criteriaList.map((criteria) => (
            <FormControlLabel
              key={criteria.id}
              control={<Checkbox checked={selectedCriteriaList.includes(criteria)} onChange={() => handleCriteriaChange(criteria)} />}
              label={criteria.criteriaName}
            />
          ))}
        </FormGroup>
      </Box>

    </Box>
  );

  const renderManyFormsContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Autocomplete
        multiple
        fullWidth
        sx={{ marginY: 2 }}
        options={rooms}
        disableCloseOnSelect
        getOptionLabel={(option: Room) => option.roomName || ''}
        value={selectedRooms}
        onChange={(event, newValue) => {setSelectedRooms(newValue);
          setRooms(prevRooms => {
            const selectedIds = new Set(newValue.map(room => room.id));
            return [...newValue, ...prevRooms.filter(room => !selectedIds.has(room.id))];
          });
        }}
        onInputChange={handleInputChange}
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
      <Autocomplete
        multiple
        options={criteriaList}
        disableCloseOnSelect
        getOptionLabel={(option) => option.criteriaName}
        value={selectedCriteriaList}
        onChange={(event, newValue) => {
          setSelectedCriteriaList(newValue);
        }}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.id}>
            <Checkbox
              key={`checkbox-${option.id}`} 
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.criteriaName}
          </li>
        )}
        style={{ width: '100%' }}
        renderInput={(params) => (
          <TextField {...params} label="Chọn tiêu chí" placeholder="Tiêu chí" />
        )}
      />
    </Box>
  );
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          onClick={() => handleOptionChange("one")}
          variant={options === "one" ? "contained" : "outlined"}
          sx={{ '&:focus': { boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.5)' } }}
        >
          Tạo một form
        </Button>
        <Button
          onClick={() => handleOptionChange("many")}
          variant={options === "many" ? "contained" : "outlined"}
          sx={{ '&:focus': { boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.5)' } }}
        >
          Tạo nhiều form
        </Button>
      </Box>
      {options === "one" ? renderOneFormContent() : renderManyFormsContent()}
      <Button onClick={handleSave} variant='contained' sx={{ float: 'right', mt: 2 }}>Tạo</Button>
    </>
  );
}

export default AddForm;
