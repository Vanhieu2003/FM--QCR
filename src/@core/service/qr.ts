import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";


export class QRScannerService{
 
 getInfoByQR = async(roomCode:string) => {
    return internalApiService.getAsync(`/api/QR/GetInfo?roomCode=${roomCode}`);
 }
}
export default new QRScannerService();