import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';
import { PermissionConstants } from 'src/@core/constants/permission';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  smartControl: icon('ic_smartcontrol'),
  publicDocument: icon('ic_publicdocument'),
  template: icon('ic_template'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Tính năng',
        permissions: [PermissionConstants.AccessQCR],
        items: [
          { title: 'Đánh giá', path: paths.dashboard.root, icon: ICONS.dashboard, permissions: [PermissionConstants.ModifyReport] },
          { title: 'Danh sách đánh giá', path: paths.dashboard.two, icon: ICONS.ecommerce, permissions: [PermissionConstants.ModifyReport,PermissionConstants.ViewReport] },
          {
            title: 'Báo cáo thống kê',
            path: paths.dashboard.three,
            icon: ICONS.analytics,
            permissions: [PermissionConstants.ModifyReport]
          },
          { title: 'Lịch', path: paths.dashboard.six, icon: ICONS.calendar, permissions: [PermissionConstants.AccessQCR, PermissionConstants.ViewSchedule] },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'Quản lý',
        permissions: [PermissionConstants.AccessAdminQCR,PermissionConstants.ViewFormDG],
        items: [
          // {
          //   title: 'Quản lý form',
          //   path: paths.dashboard.group.root,
          //   icon: ICONS.user,
          //   children: [

          //   ],
          // },
          { title: 'Form', path: paths.dashboard.group.root,icon:ICONS.file,permissions: [PermissionConstants.AccessAdminQCR,PermissionConstants.ViewFormDG], },
          { title: 'Tiêu chí', path: paths.dashboard.group.five,icon:ICONS.publicDocument,permissions: [PermissionConstants.AccessAdminQCR,PermissionConstants.ViewFormDG], },
          { title: 'Danh sách ca', path: paths.dashboard.group.shiftList,icon:ICONS.smartControl,permissions: [PermissionConstants.AccessAdminQCR,PermissionConstants.ViewFormDG], },
          { title: 'Danh sách nhóm phòng', path: paths.dashboard.group.roomGroup, icon:ICONS.file,permissions: [PermissionConstants.AccessAdminQCR,PermissionConstants.ViewFormDG],},
          // {
          //   title: 'Quản lý Nhóm Phòng',
          //   path: paths.dashboard.roomgroup.root,
          //   icon: ICONS.lock,
          //   children: [
          //     { title: 'Danh sách nhóm', path: paths.dashboard.roomgroup.list },
          //   ],
          // },

          {
            title: 'Nhóm người chịu trách nhiệm',
            path: paths.dashboard.responsiblegroup.root,
            icon: ICONS.lock,
            permissions: [PermissionConstants.AccessAdminQCR],
            children: [
              { title: 'Danh sách nhóm', path: paths.dashboard.responsiblegroup.list },
              { title: 'Danh sách tag cho từng nhóm', path: paths.dashboard.responsiblegroup.createUserPerTag },
            ],
          },

          // {
          //   title: 'Quản lý ca làm việc',
          //   path: paths.dashboard.shift.root,
          //   icon: ICONS.menuItem,
          //   children: [
          //     { title: 'Danh sách ca', path: paths.dashboard.shift.list },
          //   ],
          // },
        ],
      },
    ],
    []
  );

  return data;
}
