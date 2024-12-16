import axios, { AxiosInstance } from 'axios';
import cookie from 'react-cookies';

import moment from 'moment';
import { COOKIE_NAME, getFormUrlEncoded, HTTP_CONTENT_TYPE } from 'src/@core/constants/common';
import { toggleError } from 'src/hooks/use-snackbar';
import { IDENTITY_SERVER_ENDPOINT } from 'src/config-global';

// import { toggleError } from '@core/contexts/SnackbarProvider';

export abstract class AxiosInitialize {
  constructor(
    private _baseURL?: string,
    private _includeToken?: boolean
  ) {}

  isRefreshToken = false;

  subscribers = [] as any;

  public clearAllSession() {
    Object.keys(cookie.loadAll()).forEach((item) => {
      cookie.remove(item,{path:'/'});
    });
    // sessionStorage.clear();
    // // redirect to sign in page
    // if (window.location.href.indexOf('/login') === -1) {
    //   window.location.href = paths.auth.login;
    // }
  }

  private getInstance = (
    contentType = 'application/json',
    isShowErrorMessage = true
    // responseType: ResponseType = 'json'
  ): AxiosInstance => {
    const authData: any = cookie.load(COOKIE_NAME.AUTH);
    if (this._includeToken && !authData) {
      this.clearAllSession();
    }
    const instance = axios.create({
      baseURL: this._baseURL,
      headers: {
        'Content-Type': contentType,
        Authorization:
          this._includeToken && authData
            ? `${authData?.token_type} ${authData?.access_token}`
            : undefined,
      },
      //responseType: responseType,
    });
    instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      async (error) => {
        //Handle exception for your business
        const errorResponse = error.response;
        const errorObj = {
          message: '',
          type: 'error',
        };
        if (errorResponse.status === 401) {
          // && !error.config._retry
          //return  cookie.load(COOKIE_NAME.AUTH) && this.detectRefreshToken(error, isShowErrorMessage);
          this.clearAllSession();
          return Promise.reject(errorObj);
        }
        if (errorResponse.status === 403) {
          toggleError("Bạn không có quyền truy cập")
          return Promise.reject(errorObj);
        }

        if (errorResponse.statusText === 'Unknown Error') errorObj.message = 'Something went wrong';
        else if (error.message && error.message === 'Network Error')
          errorObj.message = 'No internet connection';
        else if (
          errorResponse &&
          errorResponse.data &&
          errorResponse.data.Errors &&
          errorResponse.data.Errors?.length > 0
        ) {
          errorResponse.data.Errors.forEach((item: any, index: number) => {
            errorObj.message += item.Message;
          });
        } else errorObj.message = errorResponse.data.Message;

        console.log(errorResponse);
        // show error
        if (isShowErrorMessage && errorObj && errorObj.message && errorObj.message.length > 0) {
          toggleError(errorObj.message);
        }
        return Promise.reject(errorObj);
      }
    );
    return instance;
  };

  public getAsync<T>(
    url: string,
    params?: { [key: string]: any },
    isShowErrorMessage = true,
    contentType?: string
  ): Promise<T> {
    return this.getInstance(contentType, isShowErrorMessage).get(url, {
      params: params,
    });
  }

  public downloadAsync<T>(
    url: string,
    params?: { [key: string]: any },
    isShowErrorMessage = true,
    contentType?: string
  ): Promise<T> {
    return this.getInstance(contentType, isShowErrorMessage).get(url, {
      params: params,
      responseType: 'blob',
    });
  }

  public postAsync<T>(
    url: string,
    json?: any,
    isShowErrorMessage = true,
    contentType = HTTP_CONTENT_TYPE.APPLICATION_JSON
  ): Promise<T> {
    let body = JSON.stringify(json);
    if (contentType !== HTTP_CONTENT_TYPE.APPLICATION_JSON || typeof json === 'object') {
      body = json;
    }

    return this.getInstance(contentType, isShowErrorMessage).post(url, body);
  }

  public putAsync<T>(
    url: string,
    json?: any,
    isShowErrorMessage = true,
    contentType = HTTP_CONTENT_TYPE.APPLICATION_JSON
  ): Promise<T> {
    let body = JSON.stringify(json);
    if (contentType !== HTTP_CONTENT_TYPE.APPLICATION_JSON || typeof json === 'object') {
      body = json;
    }
    return this.getInstance(contentType, isShowErrorMessage).put(url, body);
  }

  public deleteAsync<T>(url: string, isShowErrorMessage = true, contentType?: string): Promise<T> {
    return this.getInstance(contentType, isShowErrorMessage).delete(url);
  }

  private async refreshAccessToken() {
    const authData: any = cookie.load(COOKIE_NAME.AUTH);
    if (!authData) {
      return undefined;
    }
    const payload = {
      client_id: 'react_client_id',
      grant_type: 'refresh_token',
      refresh_token: authData.refresh_token,
    };

    const data: any = await this.getInstance(HTTP_CONTENT_TYPE.FORM_URLENCODED, true).post(
      `${IDENTITY_SERVER_ENDPOINT}${'connect/token'}`,
      getFormUrlEncoded(payload)
    );
    if (data && data.access_token) {
      const expire = moment().add(data.expires_in, 's').toDate();
      cookie.save(COOKIE_NAME.AUTH, data, { expires: expire });

      const userData: any = cookie.load(COOKIE_NAME.USER);
      cookie.save(COOKIE_NAME.USER, userData, { expires: expire });
      return new Promise((resolve) => {
        resolve(data.access_token);
      });
    }
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }

  private recallApiAfterRefreshToken(config: any, isShowErrorMessage: any) {
    const body = config.data ? JSON.parse(config.data) : undefined;
    const instance = this.getInstance(config.headers['Content-Type'], isShowErrorMessage);
    switch (config.method.toLowerCase()) {
      case 'get':
        return instance.get(config.url);
      case 'post':
        return instance.post(config.url, body);
      case 'put':
        return instance.put(config.url, body);
      case 'delete':
        return instance.delete(config.url);
      default:
        return instance.get(config.url);
    }
  }

  private onTokenRefreshed(token: any) {
    this.subscribers.map((cb: any) => cb({ token }));
  }

  private subscribeTokenRefresh(cb: any) {
    this.subscribers.push(cb);
  }

  private detectRefreshToken(error:any, isShowErrorMessage:any) {
    const originalRequest = error.config;
    if (!this.isRefreshToken) {
      this.isRefreshToken = true;

      this.refreshAccessToken()
        .then((access_token) => {
          if (access_token) {
            this.isRefreshToken = false;
            this.onTokenRefreshed(access_token);
            this.subscribers = [];
          }
        })
        .catch(() => {
          if (isShowErrorMessage) {
            //toggleMessage({ type: 'error', message: 'Đã hết phiên làm việc. Vui lòng đăng nhập lại.' });
          }
          this.clearAllSession();
        });
    }
    return new Promise((resolve) => {
      this.subscribeTokenRefresh(() => {
        resolve(this.recallApiAfterRefreshToken(originalRequest, isShowErrorMessage));
      });
    });
  }
}
