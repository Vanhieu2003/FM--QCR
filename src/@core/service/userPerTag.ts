import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class UserPerTagService {
    CreateUserPerTag = async(userPerTag: any) => {
        return internalApiService.postAsync(`/api/UsersPerTag`,userPerTag);
    }
    updateUserPerTag = async (data:object)=>{
        return internalApiService.putAsync(`/api/UsersPerTag`,data);
    }

}
export default new UserPerTagService();