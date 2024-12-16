import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class RoomService {
   getRoomsByFloorIdAndBlockId = async (floorId: string,blockId:string) => {
      return internalApiService.getAsync(`/api/Rooms/By-Floor&Block?floorId=${floorId}&blockId=${blockId}`);
   }
   getRoomById = async (roomId: string) => {
      return internalApiService.getAsync(`/api/Rooms/${roomId}`);
   }
   getRoomsByFloorIdAndBlockIdIfExistForm = async (floorId: string,blockId:string) => {
      return internalApiService.getAsync(`/api/Rooms/IfExistForm-Floor&Block?floorId=${floorId}&blockId=${blockId}`);
   }
   getAllRooms = async () => {
      return internalApiService.getAsync(`/api/Rooms/All`);
   }

   getRoomByCampus = async (campusId: string) => {
      return internalApiService.getAsync(`/api/Rooms/GetRoomByCampus?campusId=${campusId}`);
   }
   searchRooms = async (input: string) => {
      return internalApiService.getAsync(`/api/Rooms/SearchRoom?roomName=${input}`);
   }
   getRoomByBlockAndCampus = async (campusId: string, blockId: string) => {
      return internalApiService.getAsync(`/api/Rooms/GetRoomByBlocksAndCampus?blockId=${blockId}&campusId=${campusId}`);
   }
   getRoomListByRoomType = async (roomType: string) => {
      return internalApiService.getAsync(`/api/Schedules/GetRoomsList?RoomType=${roomType}`);
   }
}

export default new RoomService();