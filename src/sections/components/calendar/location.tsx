import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react';
import RoomService from 'src/@core/service/room';


interface LocationItem {
    id: string;
    name: string;
}

interface Props {
    index: number;
    data: {
        level: string;
        rooms: Array<{ id: string; name: string }>;
    };
    onChange: (index: number, level: string, rooms: Array<{ id: string; name: string }>) => void;
    onRemove: (index: number) => void;
}

const LocationSelector = React.memo(({ index, data, onChange, onRemove }: Props) => {
    const [locationOptions, setLocationOptions] = useState<LocationItem[]>([]);

    const levelOptions = ['Cơ sở', 'Tòa nhà', 'Tầng', 'Phòng'];

    const fetchLocationData = async (level: string) => {
        try {
            const response:any = await RoomService.getRoomListByRoomType(level);        
            setLocationOptions(response);
        } catch (error) {
            setLocationOptions([]);
        }
    };

    useEffect(() => {
        if (data.level) {
            fetchLocationData(data.level);
        }
    }, [data.level]);

    return (
        <Box display="flex" alignItems="center" gap={2}>
            <Box width={"30%"}>
                <DropDownListComponent
                    dataSource={levelOptions}
                    value={data.level}
                    floatLabelType="Always"
                    change={(e: any) => {
                        if (e.value !== null) {
                            if (e.value !== data.level) {
                          
                                onChange(index, e.value, []);
                                fetchLocationData(e.value);
                            }
                        }
                    }}
                    placeholder="Chọn loại địa điểm"
                />
            </Box>
            <Box width={'70%'}>
                <MultiSelectComponent
                    dataSource={locationOptions.map(r => ({ id: r.id, name: r.name }))}
                    value={data.rooms.map(r => r.id)}
                    change={(e: { value: string[] | null }) => {
                        if (e.value === null || e.value === undefined) {
                            if (data.rooms.length > 0) {
                                onChange(index, data.level, []);
                            }
                        } else {
                            const selectedRooms = e.value.map(id => {
                                const room = locationOptions.find(r => r.id === id);
                                return room ? { id: room.id, name: room.name } : { id: id, name: id };
                            });
                            if (JSON.stringify(selectedRooms) !== JSON.stringify(data.rooms)) {
                                onChange(index, data.level, selectedRooms);
                            }
                        }
                    }}
                    placeholder="Chọn địa điểm"
                    floatLabelType="Always"
                    mode="Box"
                    showClearButton={true}
                    style={{ color: "#000 !important" }}
                    filterBarPlaceholder="Tìm kiếm địa điểm"
                    popupHeight="200px"
                    className='e-field'
                    allowFiltering={true}
                    filterType="Contains"
                    enabled={!!data.level}
                    fields={{ text: 'name', value: 'id' }}
                />
            </Box>
            {index > 0 && (
                <IconButton onClick={() => onRemove(index)} color="error">
                    <DeleteIcon />
                </IconButton>
            )}
        </Box>
    );
});

export default LocationSelector;