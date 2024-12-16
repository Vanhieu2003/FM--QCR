import axios from "axios";
import { API_ENDPOINT } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class TagService {
  getAllTags = async () => {
    return internalApiService.getAsync(`/api/Tags`);
  }

  getGroupInfoByTagId = async (id: string) => {
    return internalApiService.getAsync(`/api/Tags/GetGroupInfoByTagId?tagId=${id}`);
  }

  getTagsByCriteriaId = async (criteriaId: string) => {
    return internalApiService.getAsync(`/api/TagsPerCriterias/Criteria?criteriaId=${criteriaId}`);
  }
  postTagsPerCriteria = async (data: { criteriaId: string | undefined, Tag: object[] }) => {
    return internalApiService.postAsync(`/api/TagsPerCriterias/newCriteria`, data);
  }
  getTagGroups = async () => {
    return internalApiService.getAsync(`/api/Tags/GetTagGroups`)
  }
}
export default new TagService();