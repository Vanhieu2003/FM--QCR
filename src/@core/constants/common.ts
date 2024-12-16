export enum COOKIE_NAME {
    AUTH = 'MEDU.AUTH',
    USER = 'MEDU.USER',
    PERMISSIONS = 'MEDU.PERMISSIONS'
  }
  
  export const getFormUrlEncoded = (toConvert: any) => {
    const formBody = [] as any;
    for (const property in toConvert) {
      const encodedKey = encodeURIComponent(property) as string;
      const encodedValue = encodeURIComponent(toConvert[property]) as string;
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    return formBody.join('&');
  };
  
  export const HTTP_CONTENT_TYPE = {
    APPLICATION_JSON: 'application/json',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
    MULTIPART_FORMDATA: 'multipart/form-data',
  };
  