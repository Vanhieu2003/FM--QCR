import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class FloorService{
 getFloorByBlockId = async(blockId:string) => {
    return internalApiService.getAsync(`/api/Floors/Block?BlockId=${blockId}`);
 }
}
export default new FloorService();