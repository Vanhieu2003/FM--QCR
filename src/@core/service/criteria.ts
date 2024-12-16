import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";


export class CriteriaService {
  getCriteriaByRoomCategoryId = async (roomCategoricalId: string) => {
    return internalApiService.getAsync(`/api/Criteria/ByRoom?RoomCategoricalId=${roomCategoricalId}`);
  }
  
  getCriteriaByRoomId = async (roomId: string) => {
    return internalApiService.getAsync(`/api/Criteria/ByRoomId?RoomId=${roomId}`);
  }
  
  getCriteriaByFormId = async (formId: string) => {
    return internalApiService.getAsync(`/api/CriteriasPerForms/ByFormId?formId=${formId}`);
  }

  getAllCriterias = async()=>{
    return internalApiService.getAsync(`/api/Criteria/Getall`)
  }

  postCriteria = async (data:object)=>{
    return internalApiService.postAsync(`/api/Criteria/CreateCriteria`,data)
  }

  disableCriteria = async (criteriaId: string) => {
    return internalApiService.putAsync(`/api/Criteria?id=${criteriaId}`);
  }
  searchCriteria = async (search:string)=>{
    return internalApiService.getAsync(`/api/Criteria/search?keyword=${search}`)
  }
}
export default new CriteriaService();