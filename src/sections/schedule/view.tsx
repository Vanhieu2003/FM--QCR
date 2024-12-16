'use client';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import numberingSystems from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';
import gregorian from '@syncfusion/ej2-cldr-data/main/vi/ca-gregorian.json';
import numbers from '@syncfusion/ej2-cldr-data/main/vi/numbers.json';
import timeZoneNames from '@syncfusion/ej2-cldr-data/main/vi/timeZoneNames.json';

import CalendarView from '../components/calendar/calenda-view';
import { CALENDAR_LICENSE_KEY } from 'src/config-global';
import { L10n, loadCldr, registerLicense } from '@syncfusion/ej2-base';
import { ScheduleComponent, Inject, Day, Week, WorkWeek, Month, Agenda } from '@syncfusion/ej2-react-schedule';
registerLicense(CALENDAR_LICENSE_KEY as string);
// ----------------------------------------------------------------------


L10n.load({
  vi: {
    "schedule": {
      "day": "Ngày",
      "week": "Tuần",
      "workWeek": "Tuần công việc",
      "month": "Tháng",
      "year": "Năm",
      "agenda": "Chương trình nghị sự",
      "weekAgenda": "Chương trình nghị sự tuần",
      "workWeekAgenda": "Chương trình làm việc trong tuần",
      "monthAgenda": "Chương trình nghị sự tháng",
      "today": "Hôm nay",
      "noEvents": "Không có lịch làm việc",
      "emptyContainer": "Không có sự kiện theo lịch trình vào ngày này.",
      "allDay": "Cả ngày",
      "start": "Khởi đầu",
      "end": "Kết thúc",
      "more": "Hơn",
      "close": "Đóng",
      "cancel": "Hủy bỏ",
      "noTitle": "(Không tiêu đề)",
      "delete": "Xóa bỏ",
      "deleteEvent": "Xóa sự kiện",
      "deleteMultipleEvent": "Xóa nhiều sự kiện",
      "selectedItems": "Các mục được chọn",
      "deleteSeries": "Xóa toàn bộ loạt sự kiện",
      "edit": "Chỉnh sửa",
      "editSeries": "Chỉnh sửa toàn bộ loạt sự kiện",
      "editEvent": "Chỉnh sửa sự kiện",
      "createEvent": "Tạo sự kiện",
      "subject": "Tiêu đề sự kiện",
      "addTitle": "Thêm tiêu đề",
      "moreDetails": "Thêm chi tiết",
      "moreEvents": "Thêm sự kiện",
      "save": "Lưu",
      "editContent": "Bạn muốn thay đổi cuộc hẹn trong chuỗi như thế nào?",
      "deleteContent": "Bạn có chắc chắn muốn xóa sự kiện này không?",
      "deleteMultipleContent": "Bạn có chắc chắn muốn xóa các sự kiện đã chọn không?",
      "newEvent": "Sự kiện mới",
      "title": "Tiêu đề",
      "location": "Vị trí",
      "description": "Sự miêu tả",
      "timezone": "Múi giờ",
      "startTimezone": "Bắt đầu múi giờ",
      "endTimezone": "Múi giờ kết thúc",
      "repeat": "Lặp lại",
      "saveButton": "Lưu",
      "cancelButton": "Hủy bỏ",
      "deleteButton": "Xóa bỏ",
      "recurrence": "Sự lặp lại",
      "wrongPattern": "Mẫu tái phát không hợp lệ.",
      "seriesChangeAlert": "Bạn có muốn hủy các thay đổi được thực hiện cho các phiên bản cụ thể của chuỗi này và khớp lại với toàn bộ chuỗi không?",
      "createError": "Thời gian của sự kiện phải ngắn hơn tần suất xảy ra. Rút ngắn thời lượng hoặc thay đổi mẫu lặp lại trong trình chỉnh sửa sự kiện lặp lại.",
      "sameDayAlert": "Hai lần xuất hiện của cùng một sự kiện không thể xảy ra trong cùng một ngày.",
      "occurenceAlert": "Không thể lên lịch lại lần xuất hiện của cuộc hẹn định kỳ nếu cuộc hẹn đó bỏ qua lần xuất hiện sau của cùng một cuộc hẹn.",
      "editRecurrence": "Chỉnh sửa tái phát",
      "repeats": "Lặp lại",
      "alert": "Thông báo",
      "startEndError": "Ngày kết thúc được chọn xảy ra trước ngày bắt đầu.",
      "invalidDateError": "Giá trị ngày nhập không hợp lệ.",
      "blockAlert": "Sự kiện không thể lên lịch trong thời gian bị chặn.",
      "ok": "Đồng ý",
      "of": "Của",
      "yes": "Đúng",
      "no": "Không",
      "occurrence": "Tần suất xảy ra",
      "series": "Loạt",
      "previous": "Trước",
      "next": "Kế tiếp",
      "timelineDay": "Mốc thời gian theo ngày",
      "timelineWeek": "Mốc thời gian theo tuần",
      "timelineWorkWeek": "Mốc thời gian theo tuần làm việc",
      "timelineMonth": "Mốc thời gian theo tháng",
      "timelineYear": "Mốc thời gian theo năm",
      "editFollowingEvent": "Sự kiện sau",
      "deleteTitle": "Xóa sự kiện",
      "editTitle": "Chỉnh sửa sự kiện",
      "beginFrom": "Bắt đầu từ",
      "endAt": "Kết thúc tại",
      "expandAllDaySection": "Mở rộng phần cả ngày",
      "collapseAllDaySection": "Thu gọn cả ngày phần",
      "searchTimezone": "Tìm kiếm múi giờ",
      "noRecords": "Không có dữ liệu được tìm thấy"
    },
    "recurrenceeditor": {
      "none": "Không có",
      "daily": "Hằng ngày",
      "weekly": "Hàng tuần",
      "monthly": "Hàng tháng",
      "month": "Tháng",
      "yearly": "Hàng năm",
      "never": "Không bao giờ",
      "until": "Cho đến khi",
      "count": "Đếm",
      "first": "Đầu tiên",
      "second": "Thứ hai",
      "third": "Thứ ba",
      "fourth": "Thứ tư",
      "last": "Cuối cùng",
      "repeat": "Lặp lại",
      "repeatEvery": "Lặp lại mỗi",
      "on": "Lặp lại trên",
      "end": "Kết thúc",
      "onDay": "Ngày",
      "days": "Ngày",
      "weeks": "Tuần",
      "months": "Tháng",
      "years": "Năm",
      "every": "Mỗi",
      "summaryTimes": "Thời gian",
      "summaryOn": "Trên",
      "summaryUntil": "Cho đến khi",
      "summaryRepeat": "Lặp lại",
      "summaryDay": "Ngày",
      "summaryWeek": "Tuần",
      "summaryMonth": "Tháng",
      "summaryYear": "Năm",
      "monthWeek": "Tháng tuần",
      "monthPosition": "Vị trí tháng",
      "monthExpander": "Mở rộng tháng",
      "yearExpander": "Mở rộng năm",
      "repeatInterval": "Khoảng lặp lại"
    },
    "calendar": {
      "today": "Hôm nay"
    },
  }
});

export default function SixView() {
  loadCldr(numbers, timeZoneNames, gregorian, numberingSystems);
  const settings = useSettingsContext();

  return (
    <CalendarView />
  );
}
