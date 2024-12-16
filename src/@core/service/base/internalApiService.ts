import { API_ENDPOINT } from 'src/config-global';
import { AxiosInitialize } from './axiosInitialize';

class InternalApiService extends AxiosInitialize {
  constructor() {
    super(API_ENDPOINT, true);

  }
}
export default new InternalApiService();
