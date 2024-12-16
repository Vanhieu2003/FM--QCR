import cookie from 'react-cookies';
import moment from 'moment';


import identityServerService from './base/identityServerServices';

import { COOKIE_NAME, HTTP_CONTENT_TYPE, getFormUrlEncoded } from '../constants/common';
import { ORIGIN } from 'src/config-global';


export class AuthService {
  private clientIDs: any[] = [];
  async getToken(payload: any) {
    const data = await identityServerService.postAsync<any>(
      'connect/token',
      getFormUrlEncoded(payload),
      true,
      HTTP_CONTENT_TYPE.FORM_URLENCODED
    );

    if (data && data.access_token) {
      // const expire = moment().add(data.expires_in, 's').toDate();
      const date = new Date();
      date.setTime(date.getTime() + 30* 60 * 1000);
      cookie.save(COOKIE_NAME.AUTH, data, { domain: ORIGIN, path: '/', expires: date });

      return data;
    }
    return undefined;
  }

  hasClientID() {
    const url = new URL(window.location.href);

    const searchParams = new URLSearchParams(url.search);
    const clientID = searchParams.get('clientID') || '';
    if (clientID?.trim().length > 0 && !this.clientIDs.some((client: any) => client.clientID == clientID)) {
      window.location.href = `${window.location.origin}/forbidden`;
      return undefined;
    }
    return {
      clientID: searchParams.get('clientID'),
      origin: searchParams.get('origin'),
    };
  }

  getProvider = async () => {
    const response: any = await identityServerService.postAsync('connect/userinfo');
    if (response) {
      const date = new Date();
      // date.setTime(date.getTime() + 24 * 60 *60 * 1000);
      date.setTime(date.getTime() + 30* 60 * 1000);
      cookie.save(COOKIE_NAME.USER, response, {
        domain: ORIGIN,
        path: '/',
        expires: date,
      });
    }
  };

  getPermission = async () => {
    const response: any = await identityServerService.getAsync('auth/GetAllPermission');
    if (response) {
      const date = new Date();
      // date.setTime(date.getTime() + 24 * 60 *60 * 1000);
      date.setTime(date.getTime() + 30* 60 * 1000);
      cookie.save(COOKIE_NAME.PERMISSIONS, response, {
        domain: ORIGIN,
        path: '/',
        expires: date,
      });
    }
  };

  signOut = () => {
    identityServerService.clearAllSession();
  };

  getCurrentUser = () => cookie.load(COOKIE_NAME.USER);

  getAccessToken = () => {
    const authData: any = cookie.load(COOKIE_NAME.AUTH);
    return authData?.access_token || undefined;
  };

  getUserId = () => this.getCurrentUser()?.sub || undefined;

  getAuthEmail = () => this.getCurrentUser()?.email || undefined;

  getDeps = () => this.getCurrentUser()?.deps || '';

  getCurrentDepartment = () => {
    const deps = this.getDeps();
    return deps.split(',')?.[0];
  };

  makeUserVerified() {
    const user = this.getCurrentUser();
    const date = new Date();
    // date.setTime(date.getTime() + 24 * 60 *60 * 1000);
    date.setTime(date.getTime() + 30 *60 * 1000);
    delete user.isVerified;
    cookie.save(COOKIE_NAME.USER, user, { domain: ORIGIN, path: '/', expires: date });
  }
}


export default new AuthService();