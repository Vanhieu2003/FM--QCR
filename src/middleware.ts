import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_NAME } from './@core/constants/common';
import { PermissionConstants } from './@core/constants/permission';
import { CLIENTID, DOMAIN, LOGIN_PAGE, MAINPAGE, ORIGIN, REDIRECTURL } from './config-global';


enum UserRole {
    ROLE_MEMBER = PermissionConstants.AccessQCR,
    ROLE_MANAGER = PermissionConstants.ModifyReport,
  }
  
  // Định nghĩa mapping giữa role và trang redirect
  const ROLE_REDIRECTS = {
    [UserRole.ROLE_MANAGER]: ['/dashboard/'],
    [UserRole.ROLE_MEMBER]: ['/dashboard/report-list/','/dashboard/schedule']
  };

const isAdministrator =  (request: NextRequest) => {
    try {
        const userCookie =  request.cookies.get(COOKIE_NAME.USER);
        
        if (!userCookie?.value) {
            return false;
        }

        // Parse cookie value từ JSON string
        const userInfo = JSON.parse(userCookie.value);
        
        if (!userInfo) {
            return false;
        }

        // Kiểm tra role
        const roles = Array.isArray(userInfo.role) ? userInfo.role : [userInfo.role];
        
        return (
            roles.some((role: string) => 
                role === 'A239AAC5-48FE-4446-BC0E-239AB1E659DD'
            ) &&
            userInfo.userName === 'admin@hcmue.edu.vn'
        );

    } catch (error) {
        console.error('Error checking administrator status:', error);
        return false;
    }
}

const getUserRole = (request: NextRequest) => {
    try {
        const userCookie = request.cookies.get(COOKIE_NAME.PERMISSIONS);
 
        if (!userCookie?.value) return null;

        const userPermission = JSON.parse(userCookie.value);


        // Kiểm tra role theo thứ tự ưu tiên
        // Ưu tiên ROLE_MANAGER trước

        if (userPermission.some((p:any)=>p.permission === UserRole.ROLE_MANAGER)) {
            return UserRole.ROLE_MANAGER;
        }
        
        // Sau đó đến ROLE_MEMBER
        if (userPermission.some((p:any)=>p.permission === UserRole.ROLE_MEMBER)) {
            return UserRole.ROLE_MEMBER;
        }

        return null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
}

export function middleware(request: NextRequest) {
    // Lấy token từ cookie
    const auth = request.cookies.get(COOKIE_NAME.AUTH);
    const permissions = JSON.parse(request.cookies.get(COOKIE_NAME.PERMISSIONS)?.value || '[]');

    if(isAdministrator(request) && !permissions.some((p: any) =>
        [PermissionConstants.AccessQCR].includes(p.permission)
    )){
        const href = `${MAINPAGE}`
        const response = NextResponse.redirect(new URL(href,request.url));
        return response;
    }
    if (!auth) {
        const href = `${LOGIN_PAGE}?clientID=${CLIENTID}&origin=${ORIGIN}&redirectURL=${REDIRECTURL}`;
        return NextResponse.redirect(new URL(href, request.url));
    }
    if (!permissions.some((p: any) =>
        [PermissionConstants.AccessQCR].includes(p.permission)
    )) {
        // const href = `${LOGIN_PAGE}?clientID=${CLIENTID}&origin=${ORIGIN}&redirectURL=${REDIRECTURL}`;
        const href = `${MAINPAGE}`;
        const response = NextResponse.redirect(new URL(href, request.url))

        // request.cookies.getAll().forEach(item => {
        //     response.cookies.set(item.name, '', {
        //         expires: new Date(0), 
        //         domain: `${DOMAIN}`, 
        //         path: '/',    
        //     });
        // });

        return response
    }
    

    const userRole = getUserRole(request);
    if (userRole) {
        const allowedPaths = ROLE_REDIRECTS[userRole];
        const currentPath = request.nextUrl.pathname;  
        const isPathAllowed = allowedPaths.some(path => 
            currentPath.startsWith(path)
        );
   
        if (!isPathAllowed) {
            return NextResponse.redirect(new URL(allowedPaths[0], request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*']
};