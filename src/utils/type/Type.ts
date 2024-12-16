export interface Schedule{
    id: string;
    title: string;
    description: string | null;
    groupName: string | null;
    recurrenceRule: string | null;
    responsibleGroupId: string;
    allDay: boolean;
    users: {
        id: string;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
    }[];
    place: {
        level: string;
        rooms: {
            id: string;
            name: string;
        }[];
    }[];
    startDate: string;
    endDate: string;
    index: number;
}

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
}
export interface CalendarItem {
    groupName: string;
    id: string;
    color: string;
    isChecked: boolean;
  }