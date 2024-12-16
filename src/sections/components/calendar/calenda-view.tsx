'use client'
registerLicense(CALENDAR_LICENSE_KEY as string);
import {
  Week, Day, Month, Agenda, ScheduleComponent, ViewsDirective, ViewDirective, Inject, Resize, DragAndDrop, TimelineMonth, TimelineViews,
  CellClickEventArgs, CurrentAction,
  RecurrenceEditor,
  ResourcesDirective,
  ResourceDirective,
  EventClickArgs,
  MonthAgenda
} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

import numberingSystems from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';
import gregorian from '@syncfusion/ej2-cldr-data/main/vi/ca-gregorian.json';
import numbers from '@syncfusion/ej2-cldr-data/main/vi/numbers.json';
import timeZoneNames from '@syncfusion/ej2-cldr-data/main/vi/timeZoneNames.json';

import { useCallback, useEffect, useRef, useState } from 'react';
import { L10n, loadCldr } from '@syncfusion/ej2-base';
import { Box, IconButton, Button, Typography, Container, useTheme } from '@mui/material';
import { CALENDAR_LICENSE_KEY } from 'src/config-global';
import CalendarList from './list-UserGroup-view';
import ScheduleService from 'src/@core/service/schedule';
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import { getResponsibleGroupText } from 'src/utils/schedule/handle-schedule';
import { User, CalendarItem } from 'src/utils/type/Type';
import UserService from 'src/@core/service/user';
import Popup from '../form/Popup'
import AddScheduleComponent from './add-Schedule';
import CloseIcon from '@mui/icons-material/Close';
import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';
import { RoleConstants } from 'src/@core/constants/permission';
import { checkRole } from 'src/@core/utils/checkUserRole';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';





const CalendarView = () => {
  loadCldr(numbers, timeZoneNames, gregorian, numberingSystems);
  const settings = useSettingsContext();
  const [reload,setReload] = useState<boolean>();
  const scheduleObj = useRef<ScheduleComponent | null>(null);
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const timeScale = { enable: true, slotCount: 4 };
  const [currentEventSettings, setCurrentEventSettings] = useState([]);
  const [scheduleData, setScheduleData] = useState<any>();
  const [userList, setUserList] = useState<User[]>([]);
  const [filterData, setFilterData] = useState(currentEventSettings);
  const [isNewSchedule, setIsNewSchedule] = useState<boolean>(true);
  const {showSuccess,showError} = useCustomSnackbar();

  const handleFilterChange = useCallback((checkedIds: string[]) => {
    const SelectedResponsibleGroup = calendars
      .filter(cal => checkedIds.includes(cal.id.toString()))
      .map(cal => cal.id);


    const filteredEvents = currentEventSettings.filter((event: any) =>
      SelectedResponsibleGroup.includes(event.responsibleGroupId)
    );
    setFilterData(filteredEvents);

    setCalendars(prevCalendars =>
      prevCalendars.map(cal => ({
        ...cal,
        isChecked: checkedIds.includes(cal.id)
      }))
    );
  }, [calendars, currentEventSettings]);
  
  const [openPopup, setOpenPopup] = useState(false);
  const { user } = useAuthContext();
  const isAdmin = checkRole(RoleConstants.ADMIN);
  const isMember = checkRole(RoleConstants.MEMBER);
  

  const reloadScheduleData = useCallback(async () => {
    const ScheduleData:any = await ScheduleService.getAllSchedule();
    setCurrentEventSettings(ScheduleData);
    
    const checkedCalendars = calendars.filter(cal => cal.isChecked).map(cal => cal.id);
    const filteredEvents = ScheduleData.filter((event: any) =>
      checkedCalendars.includes(event.responsibleGroupId)
    );
    setFilterData(filteredEvents);
  }, [calendars]);

  const handleAddScheduleSuccess = async (message: string) => {
   
    reloadScheduleData();
    showSuccess(message);
    setOpenPopup(false);
  };


  useEffect(()=>{setReload(!reload)},[filterData])

  const handleAddSchedule = async () => {
    const getSlotData = () => {
      const selectedElements = scheduleObj.current?.getSelectedElements();
      if (!selectedElements) return null;

      const cellDetails = scheduleObj.current?.getCellDetails(selectedElements);
      if (!cellDetails) return null;

      const formData = scheduleObj.current?.eventWindow.getObjectFromFormData("e-quick-popup-wrapper");
      if (!formData) return null;

      const addObj: any = {};
      addObj.Id = scheduleObj.current?.getEventMaxID();
      addObj.Subject = formData.Subject && formData.Subject.length > 0 ? formData.Subject : "Add title";
      addObj.StartTime = new Date(cellDetails.startTime);
      addObj.EndTime = new Date(cellDetails.endTime);
      return addObj;
    };
    const eventData = getSlotData();
 
    setScheduleData(eventData);
    setIsNewSchedule(true);
    setOpenPopup(true);
  }
  

  const handleEditSchedule = async () => {
    const eventData = scheduleObj.current?.activeEventData?.event;
    setScheduleData(eventData);
    setIsNewSchedule(false);
    setOpenPopup(true);
  }

  const buttonClickActions = useCallback(async (action: string) => {
    let eventData: any = {};
    let actionType: CurrentAction = "Add";

    switch (action) {
      case "delete":
        eventData = scheduleObj.current?.activeEventData?.event;
        if (eventData && eventData.recurrenceRule) {
          actionType = "DeleteSeries";
          eventData = scheduleObj.current?.eventBase.getParentEvent(eventData, true);
          scheduleObj.current?.deleteEvent(eventData, actionType);
        }
        else {
          actionType = "Delete";
          scheduleObj.current?.deleteEvent(eventData, actionType);
        }
        const response: any = await ScheduleService.deleteSchedule(eventData.id);
        if (response) {
          showSuccess("Xóa lịch thành công");
          fetchData(isMember);
          setReload(!reload);
        }
        break;
      default:
        break;
    }
    scheduleObj.current?.closeQuickInfoPopup();
  }, []);

  const header = (props: any) => {
    return (
      <Box>
        {props.elementType === "cell" ? (
          <Box
            className="e-cell-header e-popup-header"
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',

            }}
          >
            <IconButton
              id="close"
              className="e-close"
              onClick={() => buttonClickActions("close")}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon fontSize="medium" />
            </IconButton>
          </Box>
        ) : (
          <Box
            className="e-event-header e-popup-header"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              p: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {props.title || 'Không có tiêu đề'}
            </Typography>
            <IconButton
              id="close"
              className="e-close"
              onClick={() => buttonClickActions("close")}
              size="small"
              sx={{
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              <CloseIcon fontSize="medium" />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  }

  const content = (props: any) => {
    return (
      <Box>
        {props.elementType === "cell" ? (
          <Box sx={{ padding: '10px 0' }}>
            <Typography variant='h4' textAlign={"center"}>Chưa có sự kiện nào</Typography>
          </Box>
        ) : (
          <Box className="e-event-content e-template">
            <Box className="e-subject-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {props.place && (
                <Box><b>Địa điểm: </b>{formatLocation(props.place)}</Box>
              )}
              <Box>
                <b>Thời gian: </b>
                {props.startDate.toLocaleDateString('vi-VN', { weekday: 'long' })} - {props.startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })},
                {props.startDate.toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: true })} - {props.endDate.toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: true })}
              </Box>
              <Box><b>Người dùng: </b>
                {props.users?.map((user: any) => `${user.firstName} ${user.lastName}`).join(', ')}
              </Box>
              <Box><b>Nhóm: </b>{getResponsibleGroupText(props.responsibleGroupId, calendars)}</Box>
              {props.description !== undefined && <Box><b>Mô tả: </b> {props.description}</Box>}
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  const footer = (props: any) => {
    if(!isAdmin){
      return null;
    }
    return(
    <Box>
      {props.elementType === "cell" ? (
        <Box className="e-cell-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Box className="right-button" sx={{ marginRight: '10px' }}>
            <ButtonComponent id="add" className="e-event-create" title="Add" onClick={handleAddSchedule}> Thêm </ButtonComponent>
          </Box>
        </Box>
      ) : (
        <Box className="e-event-footer" sx={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginRight: '10px' }}>
          <Box className="left-button">
            <ButtonComponent id="edit" className="e-event-edit" title="Edit" onClick={handleEditSchedule}> Chỉnh sửa </ButtonComponent>
          </Box>
          <Box className="right-button">
            <ButtonComponent id="delete" className="e-event-delete" title="Delete" onClick={() => buttonClickActions("delete")}> Xóa </ButtonComponent>
          </Box>
        </Box>
      )}
    </Box>
    )
  }
  const quickInfoTemplates = { header: header, content: content, footer: footer };

  const formatLocation = (place: any) => {
    if (typeof place === 'string') {
      try {
        place = JSON.parse(place);
      } catch (error) {
        console.error('Error parsing Place in template:', error);
        return '';
      }
    }
    return place.map((item: any) => {
      const roomStrings = item.rooms.map((room: any) => room.name);
      return `${roomStrings.join(', ')}`;
    }).join('; ');
  };

  const eventTemplate = (props: any) => {
    return (
      <div>
        <div><b>Tiêu đề: </b>{props.title}</div>
        <div>
          <b>Thời gian: </b>
          {new Date(props.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -
          {new Date(props.endDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };

  const OnEventDoubleClick = (args: EventClickArgs) => {
    if (isAdmin) {
      args.cancel = true;
      handleEditSchedule();
    }
    else {
      args.cancel = true;
    }
  }
  const OnCellDoubleClick = (args: CellClickEventArgs) => {
    if (isAdmin) {
      args.cancel = true;
      handleAddSchedule();
    }
    else {
      args.cancel = true;
    }
  }

  const fetchData = async (isMember:boolean) => {
    const [ResponsibleGroupRes, ScheduleData, UserData]: any = await Promise.all([ResponsibleGroupRoomService.getAllResponsibleGroups(),isMember?ScheduleService.getScheduleByUserId(user?.userId): ScheduleService.getAllSchedule(), UserService.getAllUsers()]);
    const updatedCalendars = ResponsibleGroupRes.map((item: any) => ({
      ...item,
      isChecked: true
    }));
    setCalendars(updatedCalendars);
    setCurrentEventSettings(ScheduleData);
    setFilterData(ScheduleData);
    setUserList(UserData);
  }


  useEffect(() => {
    fetchData(isMember);
  }, [])




  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>
        <Box sx={{ flex: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">Lịch công việc</Typography>
          <Button variant='contained' onClick={handleAddSchedule} sx={{ mr: 3.5, display: isAdmin ? 'block' : 'none' }}>Tạo mới lịch</Button>
        </Box>
        <Box sx={{ flex: 1 }}>

        </Box>
      </Box>
      <Popup title={isNewSchedule?"Tạo mới lịch":"Chỉnh sửa lịch"} openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <AddScheduleComponent scheduleData={scheduleData} userList={userList} calendars={calendars} setOpenPopup={setOpenPopup} isNewSchedule={isNewSchedule} onSuccess={handleAddScheduleSuccess} />
      </Popup>

      <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
        <Box sx={{ flex: 4 }}>
          <ScheduleComponent width='100%' height='700px' dateFormat='dd-MM-yyyy' eventSettings={{
            dataSource: filterData, fields: {
              id: 'index',
              subject: { name: 'title' },
              isAllDay: { name: 'allDay' },
              startTime: { name: 'startDate' },
              endTime: { name: 'endDate' },
              recurrenceRule: { name: 'recurrenceRule' },
              description: { name: 'description' },
              Users: { name: 'users' },
              ResponsibleGroupId: { name: 'responsibleGroupId' },
              Place: { name: 'place' },
              resourceFields: { name: 'responsibleGroupId' },
              customId: { name: 'id' }
            }
            , template: eventTemplate
          }} ref={scheduleObj} rowAutoHeight={true} locale='vi' cssClass="schedule-customization" quickInfoTemplates={quickInfoTemplates} eventDoubleClick={OnEventDoubleClick} cellDoubleClick={OnCellDoubleClick} >
            <ViewsDirective>
              <ViewDirective option="Day" interval={5}></ViewDirective>
              <ViewDirective option="Month" isSelected={true}></ViewDirective>
              <ViewDirective option="Week" timeScale={timeScale}></ViewDirective>
              <ViewDirective option="MonthAgenda" displayName='Lịch làm việc theo tháng'></ViewDirective>
            </ViewsDirective>
            <ResourcesDirective>
              <ResourceDirective
                field='responsibleGroupId'
                title='Nhóm người dùng'
                name='ResponsibleGroupIds'
                allowMultiple={true}
                dataSource={calendars}
                textField='text'
                idField='id'
                colorField='color'
              />
            </ResourcesDirective>
            <Inject services={[Week, Day, Month, MonthAgenda, RecurrenceEditor]} />
          </ScheduleComponent>
        </Box>
        <Box sx={{ flex: 1, display: !isMember ? 'block' : 'none' }}>
          <CalendarList
            calendars={calendars}
            onFilterChange={handleFilterChange}
            onCalendarsChange={e => setCalendars(e)}
          />
        </Box>

      </Box>
    
    </Container>

  )
}

export default CalendarView;