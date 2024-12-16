import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";


export class CleaningFormService{
 getAllCleaningForm =async () => {
    return internalApiService.getAsync(`/api/CleaningForms`);
  }
 postCleaningForm = async(form:object) => {
    return internalApiService.postAsync(`/api/CleaningForms/create-form`,form);
 }
 postCriteriaPerForm = async(data:any) => {
    return internalApiService.postAsync(`/api/CriteriasPerForms/newForm`,data);
 }
 getFormById = async(formId:string) => {
    return internalApiService.getAsync(`/api/CleaningForms?id=${formId}`);
 }
 getFormInfoById = async(formId:string)=>{
   return internalApiService.getAsync(`/api/CleaningForms/GetFullInfo?formId=${formId}`);
 }
 EditCleaningForm = async(data:any) => {
    return internalApiService.putAsync(`/api/CriteriasPerForms/edit`,data);
 }
 getFormByRoomId = async(roomId:string) => {
    return internalApiService.getAsync(`/api/CleaningForms/ByRoomId?RoomId=${roomId}`);
 }
}
export default new CleaningFormService();