import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';

// handle loading
const loadingSubject = new Subject<string>();

export const toggleError = (value: string) => {
  loadingSubject.next(value);
};

export const useCustomSnackbar = () => {
  const { enqueueSnackbar, ...others } = useSnackbar();

  useEffect(() => {
    const subscribe = loadingSubject.subscribe((value) => {
      toggleError(value);
      console.log(value);
    });
    return () => {
      subscribe.unsubscribe();
    };
  }, []);

  const toggleError = (value: string) => {
    if (value?.length > 0) {
      showError(value);
    }
  };

  const showSuccess = (message: string) => {
    return enqueueSnackbar(message, { variant: 'success' });
  };
  const showError = (message: string) => {
    return enqueueSnackbar(message, { variant: 'error' });
  };

  const showWarning = (message: string) => {
    return enqueueSnackbar(message, { variant: 'warning' });
  };

  const showInfo = (message: string) => {
    return enqueueSnackbar(message, { variant: 'info' });
  };

  return { showSuccess, showError, showWarning, showInfo, ...others };
};
