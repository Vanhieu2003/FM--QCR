import { useTheme } from '@mui/material';


export const getBackgroundColor = (status: string) => {
    const theme = useTheme();
    const isLightTheme = theme.palette.mode === 'light';
    
    switch (status) {
        case 'Hoàn thành':
            return isLightTheme ? '#d0f0c0' : '#4caf50';  
        case 'Hoàn thành tốt':
            return isLightTheme ? '#a8d5a2' : '#66bb6a';  
        case 'Chưa hoàn thành':
            return isLightTheme ? '#ffcdd2' : '#e57373';  
        case 'Cần cải thiện':
            return isLightTheme ? '#fff6c2' : '#ffa726';  
        default:
            return 'transparent';  
    }
};