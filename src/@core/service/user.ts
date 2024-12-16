import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class UserService {
     getAllUsers = async() => {
        return internalApiService.getAsync(`/api/Users`);
    }

}
export default new UserService();