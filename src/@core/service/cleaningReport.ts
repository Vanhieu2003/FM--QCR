import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class CleaningReportService {
  PostReport = async (data: object) => {
    return internalApiService.postAsync(`/api/CleaningReports/create`, data);
  }
  getAllCleaningReportInfo = async () => {
    return internalApiService.getAsync(`/api/CleaningReports/GetAllInfo`);
  }
  getAllCleaningReportInfoByMemberId = async(id:string)=>{
    return internalApiService.getAsync(`/api/CleaningReports/GetAllInfoByUserId?userId=${id}`)
  }
  getAllCleaningReportInfoByManagerId = async(id:string)=>{
    return internalApiService.getAsync(`/api/CleaningReports/GetAllInfoByManagerId?managerId=${id}`)
  }

  getCleaningReportById = async (id: string) => {
    return internalApiService.getAsync(`/api/CleaningReports/GetFullInfo?reportId=${id}`);
  }
  updateCleaningReport = async (data: object) => {
    return internalApiService.putAsync(`/api/CleaningReports/update`, data);
  }
  AddUserScore = async (data:object) =>{
    return internalApiService.postAsync(`/api/CleaningReports/user-score`, data);
  }
}

export default new CleaningReportService();