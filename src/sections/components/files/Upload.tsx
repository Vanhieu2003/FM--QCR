// pages/upload.js
import { useEffect, useState } from 'react';
import FileService from 'src/@core/service/files';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Grid, IconButton, Modal } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
import { processImageUrlsFromString } from 'src/utils/image';


interface UploadProps {
    onImagesChange: (images: { [criteriaId: string]: string[] }) => void;
    onImagesDelete?: (imagesUrl: string) => void;
    criteriaId: string;
    images?: string[];
    mobile?: boolean
}


export default function Upload({ onImagesChange, onImagesDelete, criteriaId, images, mobile = false }: UploadProps) {
    const [temporaryUrls, setTemporaryUrls] = useState<string[]>(images?.length ? images : []);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [finalImage, setFinalImage] = useState<any[]>([]);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedImage(null);
    };


    // Hàm xử lý khi người dùng chọn file ảnh
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newTemporaryUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setTemporaryUrls(prev => [...prev, ...newTemporaryUrls]); // Thêm URL tạm thời vào state
            onImagesChange({ [criteriaId]: [...temporaryUrls, ...newTemporaryUrls] }); // Gửi URL tạm thời về component cha
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const checkBlobUrl = (url: string) => {
        return url.startsWith("blob");
    }

    const handleRemoveImage = (urlToRemove: string) => {
        const updatedUrls = temporaryUrls.filter(url => url !== urlToRemove);
        setTemporaryUrls(updatedUrls);
        onImagesChange({ [criteriaId]: updatedUrls }); // Gửi lại danh sách URL đã cập nhật về component cha
        if (onImagesDelete) {
            onImagesDelete(urlToRemove);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    const processUrl = async () => {

        // Sử dụng Promise.all để đợi tất cả các promises hoàn thành
        const processedUrls = await Promise.all(
            temporaryUrls.map(async (url: string) => {
                if (!checkBlobUrl(url)) {
                    return await processImageUrlsFromString(url);
                }
                return url; // Giữ nguyên URL nếu là blob
            })
        );

        setFinalImage(prevImages => [...prevImages, ...processedUrls]);

    }
    useEffect(() => {
        if(temporaryUrls && temporaryUrls.length>0){
            processUrl();
        }
    }, [temporaryUrls])
  
    return (
        <Box sx={{ padding: mobile ? '0' : '20px' }}>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />
            <Button
                fullWidth={mobile}
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleButtonClick}
            >
                Chọn ảnh
            </Button>
            {temporaryUrls.length > 0 && (
                <Box>
                    <h3>Ảnh đã tải lên:</h3>
                    <Grid container spacing={2}>
                        {temporaryUrls && temporaryUrls.map((url, index) => (
                            <Grid item key={index}>
                                <Box sx={{ position: 'relative' }}>
                                    {checkBlobUrl(url) ?
                                        (<img src={url} alt={`Uploaded ${index}`} width={100} height={100} style={{ objectFit: 'cover', cursor: 'zoom-in' }} onClick={() => handleImageClick(url)} />)
                                        :
                                        (<img src={finalImage[index]} alt={`Uploaded ${index}`} width={100} height={100} style={{ objectFit: 'cover', cursor: 'zoom-in' }} onClick={() => handleImageClick(url)} />)}
                                    <IconButton
                                        onClick={() => handleRemoveImage(url)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            color: 'red'
                                        }}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
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
        </Box>
    );
}
