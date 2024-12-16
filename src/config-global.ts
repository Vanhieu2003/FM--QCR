import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;
export const IDENTITY_SERVER_ENDPOINT = process.env.NEXT_PUBLIC_IDENTITY_SERVER_ENDPOINT;
export const API_ENDPOINT = process.env.NEXT_PUBLIC_API;
export const LOGIN_PAGE = process.env.NEXT_PUBLIC_LOGIN_PAGE;
export const CLIENTID = process.env.NEXT_PUBLIC_CLIENTID;
export const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN;
export const REDIRECTURL = process.env.NEXT_PUBLIC_REDIRECTURL;
export const MAINPAGE = process.env.NEXT_PUBLIC_MAIN_PAGE;
export const CALENDAR_LICENSE_KEY = process.env.NEXT_PUBLIC_CALENDAR_LICENSE_KEY;
export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
export const VERSION = process.env.NEXT_PUBLIC_VERSION

export const FIREBASE_API = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const AMPLIFY_API = {
  userPoolId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID,
  region: process.env.NEXT_PUBLIC_AWS_AMPLIFY_REGION,
};

export const AUTH0_API = {
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  callbackUrl: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
};

export const SUPABASE_API = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export const MAPBOX_API = process.env.NEXT_PUBLIC_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
