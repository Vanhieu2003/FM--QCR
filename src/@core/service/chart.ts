import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class ChartService {
  GetAverageValueForReport = async(campusId:string)=>{
    return internalApiService.getAsync(`/api/Chart/average-values?campusId=${campusId}`)
  }

  GetAverageValueForCriteriaPerCampus = async (campusId: string) => {
    return internalApiService.getAsync(
      `/api/Chart/GetTopCriteriaValuesByCampus?campusId=${campusId}`
    );
  };

  GetCleaningReportBy10Days = async ()=>{
    return internalApiService.getAsync(`/api/Chart/GetCleaningReportsByLast10Days`)
  }
  GetCleaningReportByQuarter = async()=>{
    return internalApiService.getAsync(`/api/Chart/GetCleaningReportsByQuarter`)
  }
  
  GetCleaningReportsByMonth = async (month: string,year: string) => {
    return internalApiService.getAsync(
      `/api/Chart/GetCleaningReportsByMonth?month=${month}&year=${year}`
    );
  }


  GetCleaningProgressByCampusId = async (campusId: string) => {
    return internalApiService.getAsync(
      `/api/Chart/summary?campusId=${campusId}`
    );
  }
  GetChartComparision = async ()=>{
    return internalApiService.getAsync(`/api/Chart/comparison`)
  }

  GetDailyTagAndUserByCampus = async(campusId:string)=>{
    return internalApiService.getAsync(
      `/api/Chart/responsible-tag-report?campusId=${campusId}`
    );
  }

  GetDailyRoomGroupReportByCampus = async (campusId: string) => {
    return internalApiService.getAsync(
      `/api/Chart/room-group-report?campusId=${campusId}`
    );
  }

  GetDailyReportStatusTableByCampus = async (campusId: string) => {
    return internalApiService.getAsync(
      `/api/Chart/detail-report?campusId=${campusId}`
    );
  }

  GetDailyComparisionByCampus = async (campusId: string) => {
    return internalApiService.getAsync(
      `/api/Chart/GetShiftEvaluations?campusId=${campusId}`
    );
  }
}

export default new ChartService();