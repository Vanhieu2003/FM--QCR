"use client"
import { Stack, Card, Typography, Chip, TableContainer, Paper, Table, TableBody, TableCell, TableHead, TableRow, Box, Rating, Modal, ListItemText, Grid, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ResponsibleUserView from './Report/responsibleUserView';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';
import HouseIcon from '@mui/icons-material/House';
import PersonIcon from '@mui/icons-material/Person';
import { useAuthContext } from 'src/auth/hooks';
import { processImageUrls } from 'src/utils/image';
interface Props {
    report: any
}

const renderRatingInput = (RatingType: string, RatingValue: any) => {
    switch (RatingType) {
        case "BINARY":
            return (
                <Box>
                    <Typography>{RatingValue === 1 ? "Đạt" : RatingValue === 0 ? "Không Đạt" : "Chưa đánh giá"}</Typography>
                </Box>
            );
        case "RATING":
            return (
                <Rating
                    value={RatingValue || 0}
                    disabled

                />
            );
        default:
            return null;
    }
};
const ReportDetail = ({ report }: Props) => {
    const parse = require('html-react-parser').default;
    const [openModal, setOpenModal] = useState(false);
    const [finalReport, setFinalReport] = useState<any>();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const theme = useTheme();
    const handleProcessData = async (data: any) => {
        const report1 = await processImageUrls(data);
        setFinalReport(report1);
    }
    useEffect(() => {
        if (report !== null) {
            handleProcessData(report);
        }
    }, [report])


    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedImage(null);
    };

    const renderLeftContentInfo = ({ icon, title, content }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {icon}
            <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2">{title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {content}
                </Typography>
            </Box>
        </Box>
    );

    const renderRightContent = (
        <Stack component={Card} spacing={3} sx={{ p: 3 }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={4}><Typography variant='h3' sx={{ color: theme.palette.text.primary }} align='center'>Bảng chi tiết đánh giá</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='center' sx={{ width: '25%' }}>Tiêu chí</TableCell>
                            <TableCell align='center' sx={{ width: '25%' }}>Đánh giá</TableCell>
                            <TableCell align='center' sx={{ width: '25%' }}>Ghi chú</TableCell>
                            <TableCell align='center' sx={{ width: '25%' }}>Ảnh</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {finalReport && finalReport.criteriaList.map((criterion: any, index: any) => (
                            <TableRow key={criterion.id}>
                                <TableCell align='center' sx={{ width: '25%' }}>{criterion.name}</TableCell>
                                <TableCell align='center' sx={{ width: '25%' }}>
                                    {renderRatingInput(criterion.criteriaType, criterion.value)}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '25%' }}>
                                    {parse(criterion.note)}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '25%' }}>
                                    {criterion.imageUrl && Object.entries(criterion.imageUrl).map(([key, url]: [string, unknown], index: number) => (
                                        typeof url === 'string' && (
                                            <img key={index} src={url} alt={`Image ${index}`} width={100} height={100} style={{ margin: '0 5px', cursor: 'zoom-in' }} onClick={() => handleImageClick(url)} />
                                        )
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={4}>
                                <ResponsibleUserView data={report.usersByTags} isShadow={false} />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        maxHeight: "90%",
                        maxWidth: "90%",
                        overflow: "auto",
                    }}
                >
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Zoomed"
                            style={{ width: "100%", height: "auto" }}
                        />
                    )}
                </Box>
            </Modal>
        </Stack>
    );


    const renderLeftContent = (
        <Stack component={Card} spacing={2} sx={{ p: 3, marginRight: '20px' }}>
            <Typography variant='h6'>Thông tin báo cáo</Typography>
            <Stack spacing={1}>
                {renderLeftContentInfo({
                    icon: <CalendarMonthIcon />,
                    title: "Ngày đánh giá",
                    content: dayjs(report.createAt).format('DD/MM/YYYY')
                })}
                {renderLeftContentInfo({
                    icon: <CalendarMonthIcon />,
                    title: "Ngày cập nhật",
                    content: dayjs(report.updateAt).format('DD/MM/YYYY')
                })}
                {renderLeftContentInfo({
                    icon: <HouseIcon />,
                    title: "Cơ sở",
                    content: report.campusName
                })}
                {renderLeftContentInfo({
                    icon: <HouseIcon />,
                    title: "Tòa nhà",
                    content: report.blockName
                })}
                {renderLeftContentInfo({
                    icon: <HouseIcon />,
                    title: "Tầng",
                    content: report.floorName
                })}
                {renderLeftContentInfo({
                    icon: <HouseIcon />,
                    title: "Phòng",
                    content: report.roomName
                })}
                {renderLeftContentInfo({
                    icon: <PersonIcon />,
                    title: "Người đánh giá",
                    content: report.fullName,
                })}
            </Stack>
        </Stack>
    );


    return (

        <Grid container spacing={4} sx={{ marginTop: 1 }}>
            <Grid item xs={12} md={3} sx={{ paddingTop: '0 !important' }}>
                {renderLeftContent}
            </Grid>
            <Grid item xs={12} md={9} sx={{ paddingTop: '0 !important' }}>
                {renderRightContent}
            </Grid>
        </Grid>

    )
}

export default ReportDetail