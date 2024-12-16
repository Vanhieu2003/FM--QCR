import React, { useCallback, useEffect, useState } from 'react';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddCalendarItemDialog from './add-UserGroup';
import EditIcon from '@mui/icons-material/Edit';
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import { checkRole } from 'src/@core/utils/checkUserRole';
import { RoleConstants } from 'src/@core/constants/permission';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';

interface CalendarItem {
    groupName: string;
    id: string;
    color: string;
    isChecked: boolean;
}

interface CalendarListProps {
    calendars: (CalendarItem[]);
    onFilterChange: (checkedIds: string[]) => void;
    onCalendarsChange: (updatedCalendars: CalendarItem[]) => void; // Thêm prop mới
}


export default function CalendarList({ calendars, onFilterChange, onCalendarsChange }: CalendarListProps) {
    const theme = useTheme();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);
    const isAdmin = checkRole(RoleConstants.ADMIN);
    const {showSuccess,showError} = useCustomSnackbar();
    const handleAddClick = () => {
        setDialogType('add');
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (item: CalendarItem) => {
        setDialogType('edit');
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditingItem(null);
    };

    const handleAddItem = async (name: string, color: string) => {
        const response:any = await ResponsibleGroupRoomService.createResponsibleGroups({ GroupName: name, Color: color, Description: "" });
        const newItem = {
            id: response.id,
            groupName: response.groupName,
            color: response.color,
            isChecked: true
        }
        if (response) {
            calendars = [...calendars, newItem];
            showSuccess("Thêm thành công");
         
            onCalendarsChange(calendars);
        }
    };

    const handleEditItem = (id: string, name: string, color: string) => {
        const updatedCalendars = calendars.map(cal =>
            cal.id === id ? { ...cal, text: name, color: color } : cal
        );
        onCalendarsChange(updatedCalendars);
    };

    const handleCheckboxChange = useCallback((id: string) => {
        const updatedCalendars = calendars.map(cal =>
            cal.id === id ? { ...cal, isChecked: !cal.isChecked } : cal
        );
        const checkedIds = updatedCalendars.filter(cal => cal.isChecked).map(cal => cal.id);
        onFilterChange(checkedIds);
    }, [calendars, onFilterChange]);

    const listTemplate = (data: CalendarItem) => {
        const handleEditButtonClick = (e: React.MouseEvent) => {
            e.stopPropagation(); // Ngăn sự kiện lan truyền lên div cha
            handleEditClick(data);
        };
        return (
            <Box
                onClick={() => handleCheckboxChange(data.id)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    cursor: 'pointer',
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                }}
            >
                <Box
                    sx={{
                        backgroundColor: data.color,
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        mr: 1,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                />
                <Typography
                    sx={{
                        flex: 1,
                        color: theme.palette.text.primary
                    }}
                >
                    {data.groupName}
                </Typography>
                <IconButton
                    onClick={handleEditButtonClick}
                    sx={{
                        p: '2px',
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover
                        }
                    }}
                >
                    <EditIcon sx={{
                        color: theme.palette.text.primary,
                        fontSize: '18px',
                        display:isAdmin?'block':'none'
                    }} />
                </IconButton>

                <CheckBoxComponent
                    checked={data.isChecked}
                />
            </Box>
        );
    };

    return (
        <Box sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            p: 2,
            boxShadow: theme.shadows[1]
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2
            }}>
                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                    Nhóm người dùng
                </Typography>
                <IconButton
                    onClick={handleAddClick}
                    sx={{
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover
                        },
                        display:isAdmin?'block':'none'
                    }}
                >
                    <AddIcon sx={{ color: theme.palette.text.primary }} />
                </IconButton>
            </Box>
            <ListViewComponent
                dataSource={calendars as unknown as { [key: string]: Object; }[]}
                template={listTemplate}
                fields={{ text: 'text', id: 'id' }}
                cssClass={`e-list-template ${theme.palette.mode === 'dark' ? 'e-dark-theme' : ''}`}
            />
            <AddCalendarItemDialog
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                onAdd={handleAddItem}
                onEdit={handleEditItem}
                type={dialogType}
                initialData={editingItem ? {
                    id: editingItem.id,
                    name: editingItem.groupName,
                    color: editingItem.color
                } : undefined}
            />
        </Box>
    );
}