"use client"
import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Box, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import CleaningReportService from 'src/@core/service/cleaningReport';

import ReportDetail from '../components/table/reportDetail';
import { useSettingsContext } from 'src/components/settings';
import BreadCrumbsComponent from '../components/BreadCrumbs';
import { checkRole } from 'src/@core/utils/checkUserRole';
import { RoleConstants } from 'src/@core/constants/permission';




const ReportDetailView = ({ id }: { id: string }) => {
  const items = [
    {
      title: 'Danh sách tiêu chí',
      link: '/dashboard/report-list'
    },
    {
      title: 'Chi tiết',
      link: `/detail/${id}`
    }
  ]
  const [report, setReport] = useState<any>(null);
  const theme = useTheme();
  const settings = useSettingsContext();
  const isMember = checkRole(RoleConstants.MEMBER);
  useEffect(() => {
    const fetchData = async () => {
      const response: any = await CleaningReportService.getCleaningReportById(id);
      setReport(response);
    }
    fetchData();
  }, [id]);
  if (!report) {
    return
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Box sx={{ marginY: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h3" sx={{
            flexGrow: 1,
            textAlign: 'center',
          }}>Báo cáo vệ sinh</Typography>
          <BreadCrumbsComponent items={items} />
        </Box>

        <Button
          variant="contained"
          onClick={() => window.location.href = `/dashboard/report-list/edit/${id}`}
          sx={{
            display: !isMember ? 'block' : 'none',
            boxShadow: theme.shadows[3],
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: theme.shadows[10],
              transform: 'translateY(-2px)',
            },
          }}
        >
          Chỉnh sửa
        </Button>
      </Box>
      <ReportDetail report={report} />
    </Container>
  );
};

export default ReportDetailView;
