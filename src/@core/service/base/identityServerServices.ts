import { IDENTITY_SERVER_ENDPOINT } from 'src/config-global';
import { AxiosInitialize } from './axiosInitialize';

class IdentityService extends AxiosInitialize {
  constructor() {
    super(IDENTITY_SERVER_ENDPOINT, true);
  }
}

export default new IdentityService();
