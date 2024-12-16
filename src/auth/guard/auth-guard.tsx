import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { usePathname, useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import { PermissionConstants } from 'src/@core/constants/permission';
import { canViewPermission } from 'src/@core/utils/checkPermission';
import { COOKIE_NAME } from 'src/@core/constants/common';
import cookie from 'react-cookies';
import { CLIENTID, LOGIN_PAGE, ORIGIN, REDIRECTURL } from 'src/config-global';

// ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
  jwt: paths.auth.jwt.login,
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const auth = cookie.load(COOKIE_NAME.AUTH);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const pathname = usePathname();
  
  useEffect(() => {
    if (!auth) {
      setAuthenticated(false);
      const href = `${LOGIN_PAGE}?clientID=${CLIENTID}&origin=${ORIGIN}&redirectURL=${REDIRECTURL}`;
      router.replace(href);
      return;
    }
    setAuthenticated(true);
    
  }, [auth, pathname]);

  // Kiểm tra quyền truy cập cho trang hiện tại

  if (authenticated && canViewPermission([PermissionConstants.AccessQCR])) {
    return <>{children}</>;
  }

}
