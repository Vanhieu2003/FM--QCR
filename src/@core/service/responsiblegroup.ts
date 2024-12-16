import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class ResponsibleGroupRoomService {
 
  createResponsibleGroups = async (data: object) => {
    return internalApiService.postAsync(`/api/ResponsibleGroups`, data); 
  };


  getAllResponsibleGroups = async ()=>{
    return internalApiService.getAsync(`/api/ResponsibleGroups`);
  }
  getAllForGroupRoom = async ()=>{
    return internalApiService.getAsync(`/api/ResponsibleGroups/all`)
  }
  getResponsibleGroupbyId = async (id:string)=>{
    return internalApiService.getAsync(`/api/ResponsibleGroups/id?id=${id}`);
  }
  
  updateResponsibleGroup = async (id:string ,data:object)=>{
    return internalApiService.putAsync(`/api/ResponsibleGroups?id=${id}`,data);
  }
}

export default new ResponsibleGroupRoomService();
