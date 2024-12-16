import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class CampusService {
     getCampusById = async(CampusId: string) => {
        return internalApiService.getAsync(`/api/Campus?id=${CampusId}`);
    };
     getAllCampus = async() => {
        return internalApiService.getAsync(`/api/Campus`);
    }

}
export default new CampusService();