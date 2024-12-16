import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class RoomCategoryService{
 getRoomCategoryById = async(Id:string) => {
    return internalApiService.getAsync(`/api/RoomCategories/id?id=${Id}`);
 }
 getAllRoomCategory = async() => {
    return internalApiService.getAsync(`/api/RoomCategories`);
 }
}
export default new RoomCategoryService();