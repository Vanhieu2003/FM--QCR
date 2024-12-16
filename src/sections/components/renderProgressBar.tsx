import { Box, LinearProgress, Typography } from "@mui/material";

const RenderProgressBar = ({progress}:{progress: number}) => {
    // Hàm để xác định màu sắc dựa trên giá trị progress
    const getColor = (value: number) => {
        if (value < 30) return '#FF0000'; // Đỏ
        if (value < 70) return '#FFA500'; // Cam
        return '#00FF00'; // Xanh lá
    };

    const color = getColor(progress);

    return (
        <Box>
            <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: color,
                    },
                }}
            />
            <Typography sx={{fontSize: '12px'}}>{progress}%</Typography>
        </Box>
    );
};

export default RenderProgressBar;
