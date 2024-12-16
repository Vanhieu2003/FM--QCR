import internalApiService from "./base/internalApiService";

export class BlockService {
    getBlockByCampusId = async(CampusId: string) => {
        return internalApiService.getAsync(`/api/Blocks/ByCampus?campusId=${CampusId}`);
    };
     getAllBlocks = async() => {
        return internalApiService.getAsync(`/api/Blocks`);
    }

}
export default new BlockService();