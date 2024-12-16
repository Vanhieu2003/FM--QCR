import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

type place = {
  campusId:string,
  roomId:string
  blockId:string,
  floorId:string,
  shiftId:string
}
export class ScheduleService {
 
  createSchedule = async (data: object) => {
    return internalApiService.postAsync(`/api/Schedules`, data); 
  };

  getAllSchedule = async ()=>{
    return internalApiService.getAsync(`/api/Schedules`);
  }
  getScheduleByUserId = async (id:string)=>{
    return internalApiService.getAsync(`/api/Schedules/userId?userId=${id}`)
  }
  getTagAndUserByShiftAndRoom = async (place:place, criteriaIds:string[]) => {
    const criteriaParams = criteriaIds.map(id => `criteriaIds=${id}`).join('&');
    const url = `/api/Schedules/get-users-by-shift-room-and-criteria?CampusId=${place.campusId}&BlockId=${place.blockId}&FloorId=${place.floorId}&RoomId=${place.roomId}&ShiftId=${place.shiftId}&${criteriaParams}`;
    return internalApiService.getAsync(url);
  }
  deleteSchedule = async (id: string) => {
    return internalApiService.deleteAsync(`/api/Schedules?scheduleId=${id}`);
  }

  editSchedule = async (id: string, data: object) => {
    return internalApiService.putAsync(`/api/Schedules?id=${id}`, data);
  }
}

export default new ScheduleService();
