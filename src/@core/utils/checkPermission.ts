import { COOKIE_NAME } from '../constants/common';

import cookie from 'react-cookies';

export const isAdministrator = () => {
  const userinfo = cookie.load(COOKIE_NAME.USER);
  const permissions = cookie.load(COOKIE_NAME.PERMISSIONS);
  if (userinfo) {
    const roles = Array.isArray(userinfo.role) ? userinfo.role : [userinfo.role];
    return (
      roles.some((role: any) => role === 'A239AAC5-48FE-4446-BC0E-239AB1E659DD') &&
      userinfo.userName === 'admin@hcmue.edu.vn'
    );
  }
  return false;
};

export const canViewPermission = (expectRoles: any[]) => {
  if (isAdministrator()) return true; // Full quyền
  if (!expectRoles || expectRoles.length === 0) return true;
  const permissions = cookie.load(COOKIE_NAME.PERMISSIONS);
  if (!permissions || permissions.length === 0) return false;
  return permissions.some((p: any) => expectRoles.some((roleID) => roleID === p.permission));
};

export const canModifyPermission = (operations: any[]) => {
  if (isAdministrator()) return true; // Full quyền
  if (!operations || operations.length === 0) return true;

  const permissions = cookie.load(COOKIE_NAME.PERMISSIONS);
  if (!permissions || permissions.length === 0) return false;

  return permissions.some((p: any) => operations.some((roleID) => roleID === p.permission));
};
