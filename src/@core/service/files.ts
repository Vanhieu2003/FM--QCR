import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";
import { HTTP_CONTENT_TYPE } from "../constants/common";

export class FileService {
   //  PostFile = async(file:any) => {
   //     return axios.post(`${API_ENDPOINT}/api/Files/UploadFiles`,file,{
   //         headers: {
   //             'Content-Type': 'multipart/form-data',
   //         },
   //     });
   //  }
   GetFile = async (fileUrl: string) => {
      return axios.get(`${API_ENDPOINT}/api/Files/GetImage?fileUrl=${fileUrl}`,{responseType:'blob'})
   }

   PostFile = async (file: any) => {
      return internalApiService.postAsync(`/api/Files/UploadFiles`, file, true, HTTP_CONTENT_TYPE.MULTIPART_FORMDATA);
   }

   DeleteFile = async (fileName: string) => {
      return internalApiService.deleteAsync(`/api/Files/DeleteFile?filename=${fileName}`);
   }
}
export default new FileService();