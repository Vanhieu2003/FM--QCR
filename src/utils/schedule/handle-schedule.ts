import { CurrentAction, ScheduleComponent } from "@syncfusion/ej2-react-schedule";
import { useCallback } from "react";
import { User } from "../type/Type";
import { Theme, useTheme } from "@mui/material";



interface CalendarItem {
  id: string;
  groupName: string;
  color: string;
  isChecked: boolean;
}

export const getResponsibleGroupText = (id: string, calendars: CalendarItem[]) => {
  const calendar = calendars.find(cal => cal.id === id);
  return calendar ? calendar.groupName : 'Không xác định';
};

export const userMapping = (userList: User[]) => {
  const users = userList.map((user: User) => ({
    id: user.id,
    text: `${user.firstName} ${user.lastName}`,
    
  }))
  return users;
}

export const syncfusionStyles = (theme: Theme) => {
  return {
    dateTimePicker: {
      '& .e-input-group': {
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          borderColor: theme.palette.text.primary,
        },
        '&.e-input-focus': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
        },
      },
      '& .e-input': {
        color: theme.palette.text.primary,
      },
      '& .e-input-group-icon': {
        color: theme.palette.text.primary,
      },
    },
    checkbox: {
      '& .e-frame': {
        borderColor: theme.palette.divider,
      },
      '& .e-check': {
        color: theme.palette.primary.main,
      },
      '& .e-label': {
        color: theme.palette.text.primary,
      },
    },
    recurrenceEditor: {
      '& .e-recurrence-editor': {
        color: theme.palette.text.primary,
      },
      '& .e-btn': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
      '& .e-input': {
        borderColor: theme.palette.divider,
        color: theme.palette.text.primary,
      },
    },
  }
};
