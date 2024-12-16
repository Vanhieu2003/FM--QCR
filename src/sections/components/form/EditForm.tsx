"use client"
import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import RoomService from 'src/@core/service/room';
import BlockService from 'src/@core/service/block';
import FloorService from 'src/@core/service/floor';
import CleaningFormService from 'src/@core/service/form';
import CampusService from 'src/@core/service/campus';
import CriteriaService from 'src/@core/service/criteria';
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

type Form = {
  id?: string,
  campusName?: string,
  blockName?: string,
  floorName?: string,
  roomName?: string
  CriteriaList?: Criteria[];
};

interface EditFormProps {
  formId: string;
  setOpenPopup: (open: boolean) => void;
  onSuccess:(message:string)=>void;
};

const EditForm = ({ formId, setOpenPopup,onSuccess }: EditFormProps) => {
  const [form, setForm] = useState<Form>();
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
  const [selectedCriteriaList, setSelectedCriteriaList] = useState<Criteria[] | null>(null);
  const {showError,showSuccess} = useCustomSnackbar();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1:any = await CleaningFormService.getFormInfoById(formId);
        const response2:any = await CriteriaService.getAllCriterias();
        const response3:any = await CriteriaService.getCriteriaByFormId(formId);
        setForm(response1);
        setSelectedCriteriaList(response3);
        setCriteriaList(response2);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu form:', error);
      }
    };
    fetchData();
  }, [formId]);




  const handleCriteriaChange = (criteria: Criteria) => {
    setSelectedCriteriaList((prevSelectedCriteriaList) => {
      let newSelectedCriteriaList;
      if (prevSelectedCriteriaList?.some((c) => c.id === criteria.id)) {
        newSelectedCriteriaList = prevSelectedCriteriaList?.filter((c) => c.id !== criteria.id);
      } else {
        newSelectedCriteriaList = [...(prevSelectedCriteriaList || []), criteria];
      }
      return newSelectedCriteriaList;
    });
  };

  const handleSave = async () => {
    const idForm = formId;
    const Criterialist = selectedCriteriaList;
    if (Criterialist?.length === 0) {
      showError('Vui lòng chọn ít nhất 1 tiêu chí');
      return;
    }
    const newCriteria = selectedCriteriaList;
    const newForm = {
      formId: idForm, // Dummy ID for the new Form
      criteriaList: newCriteria?.map((criteria) => ({ id: criteria.id }))
    };

    const response = await CleaningFormService.EditCleaningForm(newForm);
    if(response){
      onSuccess("Form đã được sửa thành công")
      setOpenPopup(false);
    }
    setOpenPopup(false);
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <FormControl fullWidth sx={{ marginY: 2 }} disabled>
          <InputLabel htmlFor="campus-input">Cơ sở</InputLabel>
          <OutlinedInput
            id="campus-input"
            value={form?.campusName || ''}
            label="Cơ sở"
          />
        </FormControl>

        <FormControl fullWidth sx={{ marginY: 2 }} disabled>
          <InputLabel htmlFor="block-input">Tòa nhà</InputLabel>
          <OutlinedInput
            id="block-input"
            value={form?.blockName || ''}
            label="Tòa nhà"
          />
        </FormControl>

        <FormControl fullWidth sx={{ marginY: 2 }} disabled>
          <InputLabel htmlFor="floor-input">Tầng</InputLabel>
          <OutlinedInput
            id="floor-input"
            value={form?.floorName || ''}
            label="Tầng"
          />
        </FormControl>

        <FormControl fullWidth sx={{ marginY: 2 }} disabled>
          <InputLabel htmlFor="room-input">Phòng</InputLabel>
          <OutlinedInput
            id="room-input"
            value={form?.roomName || ''}
            label="Phòng"
          />
        </FormControl>

        <Typography variant="h6">Chọn tiêu chí</Typography>
        <Box sx={{
          maxHeight: '150px', // Bạn có thể điều chỉnh chiều cao tối đa ở đây
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
                control={<Checkbox checked={selectedCriteriaList?.some(selectedCriteria => selectedCriteria.id === criteria.id)}
                  onChange={() => handleCriteriaChange(criteria)} />}
                label={criteria.criteriaName}
              />
            ))}
          </FormGroup>
        </Box>

      </Box>
      <Button onClick={handleSave} variant='outlined' sx={{ float: 'right', marginTop: 2 }}>Sửa</Button>
    </Box>
  );
};

export default EditForm;
