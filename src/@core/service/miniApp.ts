import internalApiService from "./base/internalApiService";
export class MiniAppService {
  getAll = async()=>{
    return internalApiService.getAsync(`/api/Application`);
  }
}

export default new MiniAppService();
