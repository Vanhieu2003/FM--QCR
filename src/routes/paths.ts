// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  page404: `/error/404`,
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/report-list`,
    three: `${ROOTS.DASHBOARD}/analyst`,
    six: `${ROOTS.DASHBOARD}/schedule`,
    group: {
      root: `${ROOTS.DASHBOARD}/manage`,
      five: `${ROOTS.DASHBOARD}/manage/criteria-list`, 
      roomGroup: `${ROOTS.DASHBOARD}/room-group/list`,
      shiftList: `${ROOTS.DASHBOARD}/shift/list`,
    },
    roomgroup:{
      root: `${ROOTS.DASHBOARD}/room-group`,
     
    } ,
    responsiblegroup:{
      root: `${ROOTS.DASHBOARD}/responsible-group`,
      list: `${ROOTS.DASHBOARD}/responsible-group/list`,
      createUserPerTag: `${ROOTS.DASHBOARD}/responsible-group/createUserPerTag`,
    } ,

    shift:{
      root: `${ROOTS.DASHBOARD}/shift`,
    } ,
  },
};
