import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class GroupRoomService {

  createGroupRooms = async (data: object) => {
    return internalApiService.postAsync(`/api/GroupRooms`, data); 
  };
  getRoomGroupById = async (id:string)=>{
    return internalApiService.getAsync(`/api/GroupRooms/id?id=${id}`);
  }

  updateRoomGroup = async (id:string ,data:object)=>{
    return internalApiService.putAsync(`/api/GroupRooms?id=${id}`,data);
  }

  getAllGroupRooms = async ()=>{
    return internalApiService.getAsync(`/api/GroupRooms`);
  }
}

export default new GroupRoomService();
