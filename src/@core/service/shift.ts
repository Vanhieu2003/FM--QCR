import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class ShiftService{
 getShiftsByRoomId = async(roomCategoricalId:string) => {
    return internalApiService.getAsync(`/api/Shifts/ByRoomId?roomId=${roomCategoricalId}`);
 }
 getAllShifts = async () => {
  return internalApiService.getAsync(`/api/Shifts`);
}


 createShifts = async (data: object) => {
   return internalApiService.postAsync(`/api/Shifts`, data); 
 };
 
 editShifts = async (id:string,data: object) => {
  return internalApiService.putAsync(`/api/Shifts?id=${id}`, data); 
};
 
}
export default new ShiftService();