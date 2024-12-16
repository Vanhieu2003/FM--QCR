export enum RoleDefault {
    Administrator = 'Administrator',
    Member = 'Member',
    Guest = 'Guest',
  }
  
  export enum PermissionConstants {
    AccessDashboard = 'ACCESS_DASHBOARD',
  
    ManageRole = 'MANAGE_ROLE',
  
    ViewRequest = 'VIEW_REQUEST',
    ModifyRequest = 'MODIFY_REQUEST',
    DeleteRequest = 'DELETE_REQUEST',
  
    ViewMyRequest = 'VIEW_MY_REQUEST',
    ModifyMyRequest = 'MODIFY_MY_REQUEST',
    DenyMyRequest = 'DENY_REQUEST',
    ApproveMyRequest = 'APPROVE_REQUEST',
  
    ViewRoom = 'VIEW_ROOM',
    ModifyRoom = 'MODIFY_ROOM',
    DeleteRoom = 'DELETE_ROOM',
  
    ViewStaff = 'VIEW_STAFF',
    ModifyStaff = 'MODIFY_STAFF',
    DeleteStaff = 'DELETE_STAFF',
  
    ViewStudent = 'VIEW_STUDENT',
    ModifyStudent = 'MODIFY_STUDENT',
    DeleteStudent = 'DELETE_STUDENT',
  
    ViewVisitor = 'VIEW_VISITOR',
    ModifyVisitor = 'MODIFY_VISITOR',
    DeleteVisitor = 'DELETE_VISITOR',
  
    AccessAdmin = 'ACCESS_ADMIN',
  
    ViewUser = 'VIEW_USER',
    ModifyUser = 'MODIFY_USER',
  
    AccessDSM = 'ACCESS_DSM',
    ViewGateway = 'VIEW_GATEWAY',
    ModifyGateway = 'MODIFY_GATEWAY',
    ViewAccessZone = 'VIEW_ACCESSZONE',
    ModifyAccessZone = 'MODIFY_ACCESSZONE',
    DeleteAccessZone = 'DELETE_ACCESSZONE',
    ViewDoorStaff = 'VIEW_DOORSTAFF',
    ModifyDoorStaff = 'MODIFY_DOORSTAFF',
    ViewSchedule = 'VIEW_SCHEDULE',
    ModifySchedule = 'MODIFY_SCHEDULE',
    DeleteSchedule = 'DELETE_SCHEDULE',

    ManageDevice = 'Manage_LD_ACTION',
    ModifyDevice = 'MODIFY_LD_PERMISSION',
    AccessLD = 'ACCESS_LD',


    AccessQCR = 'ACCESS_QCR',
    ModifyReport = 'MODIFY_REPORT',
    ViewReport = 'VIEW_REPORT',
    ViewFormDG = 'VIEW_FORMDG',
    AccessAdminQCR = 'ACCESS_ADMIN_QCR'

  }

  export enum RoleConstants {
    ADMIN = '8247b087-6581-4065-a99c-7972a4ab3a6f',
    STAFF = '',
    MANAGER = 'a6ae625d-b750-44dc-8d48-99d2374d1b9b',
    MEMBER = '0059ba04-c9eb-4431-9da2-b565ecb1756d'
  }
  