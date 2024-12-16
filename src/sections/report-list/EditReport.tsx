"use client"
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import "src/global.css";
import SendIcon from '@mui/icons-material/Send';
import { useSettingsContext } from 'src/components/settings';
import { Button, FormControl, FormControlLabel, IconButton, InputLabel, Link, MenuItem, Modal, Popover, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CleaningReportService from 'src/@core/service/cleaningReport';
import React from 'react';
import ResponsibleUserView from '../components/table/Report/responsibleUserView';

import Upload from '../components/files/Upload';
import FileService from 'src/@core/service/files';
import { API_ENDPOINT } from 'src/config-global';

import { useCustomSnackbar } from 'src/hooks/use-snackbar';
import { useRouter } from 'next/navigation';
dayjs.locale('vi');
// ----------------------------------------------------------------------
interface CriteriaEvaluation {
  criteriaId: string;
  value: any;
  note: string;
  images: { [key: string]: string };
}

export default function ReportEditView({ reportId }: { reportId: string }) {
  const [criteriaEvaluations, setCriteriaEvaluations] = useState<Array<{ criteriaId: string, value: any, note: string }>>([]);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userPerTags, SetUserPerTags] = useState<any[]>([]);
  const [criteriaImages, setCriteriaImages] = useState<{ [criteriaId: string]: string[] }>({});
  const settings = useSettingsContext();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [removeImageUrl, setRemoveImageUrl] = useState<string[]>([]);
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const { showSuccess, showError } = useCustomSnackbar();



  const parseImageUrls = (imageUrlString: string | null): string[] => {
    try {
      if (!imageUrlString) return [];

      const imageObject = JSON.parse(imageUrlString);
      return Object.values(imageObject) as string[];
    } catch (error) {
      console.error('Error parsing image URLs:', error);
      return [];
    }
  };

  const fetchData = async () => {
    const response: any = await CleaningReportService.getCleaningReportById(reportId);
    setReport(response);
    setCriteria(response.criteriaList);
    SetUserPerTags(response.usersByTags);
    const initialImages: { [criteriaId: string]: string[] } = {};
    response.criteriaList.forEach((criteria: any) => {
      initialImages[criteria.id] = parseImageUrls(criteria.imageUrl);
    });
    setCriteriaImages(initialImages);
    const initialEvaluations = response.criteriaList.map((criteria: any) => ({
      criteriaId: criteria.id,
      value: criteria.value || 0,
      note: criteria.note || ''
    }));
    setCriteriaEvaluations(initialEvaluations);
  }
  useEffect(() => {
    fetchData();
  }, []);
  if (!report) {
    return
  }


  const updateCriteriaEvaluation = (criteriaId: string, value: any, note: string) => {
    setCriteriaEvaluations(prevEvaluations => {
      const numericValue = Number(value);
      const existingIndex = prevEvaluations.findIndex(evaluation => evaluation.criteriaId === criteriaId);
      if (existingIndex !== -1) {
        // Nếu đã tồn tại, cập nhật giá trị
        const newEvaluations = [...prevEvaluations];
        newEvaluations[existingIndex] = { criteriaId, value: numericValue, note };
        return newEvaluations;
      } else {
        // Nếu chưa tồn tại, thêm mới
        return [...prevEvaluations, { criteriaId, value: numericValue, note }];
      }
    });
  };


  const uploadImages = async (temporaryUrls: any) => {

    const uploadedUrls = await Promise.all(
      temporaryUrls.map(async (tempUrl: any) => {
        const blob = await fetch(tempUrl).then(res => res.blob());
        const file = new File([blob], `image_${Math.random()}.jpg`, { type: blob.type });
        const formData = new FormData();
        formData.append("files", file);
        const res: any = await FileService.PostFile(formData);
        return res.fileUrls[0]; // Giả sử server trả về URL của file đã upload
      })
    );
    return uploadedUrls;
  };

  const isExistingServerUrl = (url: string) => {
    return !url.startsWith("blob");
  };

  const handleSubmit = async () => {
    try {
      let allCurrentImages: string[] = [];
      const criteriaListWithImages = await Promise.all(
        criteriaEvaluations.map(async (criteria) => {
          const images = await criteriaImages[criteria.criteriaId] || [];

          const existingImages = await images.filter(url => isExistingServerUrl(url));
         

          const newImages = await images.filter(url => !isExistingServerUrl(url));
    
          const uploadedImageUrls = await newImages.length > 0 ? await uploadImages(newImages) : [];

          const allImageUrls = await [...existingImages, ...uploadedImageUrls];
          allCurrentImages = [...allCurrentImages, ...allImageUrls];

          const imagesObject = allImageUrls.reduce((acc: any, url, index) => {
            acc[`image_${index + 1}`] = url;
            return acc;
          }, {});

          return {
            id: criteria.criteriaId,
            value: criteria.value,
            note: criteria.note,
            images: imagesObject
          };
        })
      );

      removeImageUrl.map(url => {

        if (!allCurrentImages.includes(url)) {
          const fileName = url.split('uploads/').pop();
          if (fileName) {
            const response = FileService.DeleteFile(fileName);
          }
        }
      })
      const reportData = {
        reportId: report.id,
        criteriaList: criteriaListWithImages,
        userPerTags: userPerTags,
      };
   
      const response:any = await CleaningReportService.updateCleaningReport(reportData);
      if (response) {
        showSuccess("Chỉnh sửa báo cáo thành công");
        router.replace(`/dashboard/report-list/detail/${reportId}`);
      }
    } catch (e) {

      showError("Đã xảy ra lỗi khi gửi báo cáo");
      console.error("Submit error:", e);
    }
  };


  const handleValueChange: (criteriaId: string, value: any) => void = (criteriaId, value) => {
    const existingEvaluation = criteriaEvaluations.find(evaluation => evaluation.criteriaId === criteriaId);
    updateCriteriaEvaluation(criteriaId, value, existingEvaluation?.note || '');
  };

  const handleNoteChange = (criteriaId: string, note: string) => {
    const existingEvaluation = criteriaEvaluations.find(evaluation => evaluation.criteriaId === criteriaId);
    updateCriteriaEvaluation(criteriaId, existingEvaluation?.value || '', note);
  };

  const handleImagesChange = (images: { [criteriaId: string]: string[] }) => {
    setCriteriaImages(prevImages => ({
      ...prevImages,
      ...images
    }));
  };

  const handleImageRemove = (imageUrl: string) => {
    if (isExistingServerUrl(imageUrl)) {
      setRemoveImageUrl([...removeImageUrl, imageUrl]);
    }
  }





  //UI of the website
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon fontSize='large' />}
          onClick={() => window.history.back()}
        />
        <Typography variant="h4"> Chỉnh sửa Form </Typography>


      </Box>

      <Box
        sx={{
          mt: 5,
          width: 1,
          minHeight: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            marginBottom: 2,
          }}>
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={[report.campusName]}
              getOptionLabel={(option) => option}
              value={report.campusName}
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn cơ sở"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu cơ sở"
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={[report.blockName]}
              getOptionLabel={(option) => option}
              value={report.blockName}
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn tòa nhà"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu tòa nhà"
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={[report.floorName]}
              getOptionLabel={(option) => option}
              value={report.floorName}
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn tầng"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu tầng"
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={[report.roomName]}
              getOptionLabel={(option) => option}
              value={report.roomName}
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn phòng"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu phòng"
            />
            <Autocomplete
              fullWidth
              disabled
              sx={{ flex: 1 }}
              options={[report.shiftName]}
              getOptionLabel={(option: any) =>
                typeof option === 'string'
                  ? option
                  : `${option.shiftName} (${option.startTime.substring(0, 5)} - ${option.endTime.substring(0, 5)})`
              }
              value={
                typeof report.shiftName === 'string'
                  ? report.shiftName
                  : `${report.shiftName} (${report.startTime.substring(0, 5)} - ${report.endTime.substring(0, 5)})`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn ca"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu ca"
            />
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead sx={{ width: 1 }}>
                <TableRow>
                  <TableCell align='center'>Tiêu chí</TableCell>
                  <TableCell align="center">Đánh giá</TableCell>
                  <TableCell align="center">Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {criteria.map(criterion => {
                  const evaluation = criteriaEvaluations.find(evaluation => evaluation.criteriaId === criterion.id);
                  return (
                    <TableRow
                      key={criterion.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, margin: '10px 0' }}
                    >
                      <TableCell component="th" scope="row" align='center'>
                        {criterion.name}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <RenderRatingInput
                            criteriaID={criterion.id}
                            inputRatingType={criterion.criteriaType}
                            value={evaluation?.value || 0}
                            onValueChange={handleValueChange} />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <TextField fullWidth sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                            },
                          },
                        }} placeholder=''
                          onChange={(e) => handleNoteChange(criterion.id, e.target.value)}
                          value={criteriaEvaluations.find(evaluation => evaluation.criteriaId === criterion.id)?.note || ''}
                        />
                        <Upload onImagesChange={handleImagesChange} criteriaId={criterion.id} images={criteriaImages[criterion.id]} onImagesDelete={handleImageRemove}></Upload>
                      </TableCell>
                    </TableRow>

                  )
                })}
                <TableRow>
                  <TableCell colSpan={4}>
                    <ResponsibleUserView data={userPerTags} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {criteria.length !== 0 &&
          <Button variant="contained" endIcon={<SendIcon />} sx={{ mt: 'auto', alignSelf: 'flex-end', mb: 2, mr: 2 }} onClick={handleSubmit}>
            Cập nhật
          </Button>}

      </Box>

    </Container>
  );
}
