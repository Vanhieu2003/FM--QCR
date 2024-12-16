'use client';



import { useSettingsContext } from 'src/components/settings';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import ChartService from 'src/@core/service/chart';
import {
  Container, MenuItem, Select, TableContainer, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Paper,
  CardContent,
  Card,
  Box,
  Skeleton
} from '@mui/material';
import DataChart from 'src/components/DataChart/DataChart';
import AnalyticsWidgetSummary from '../components/Overview/OverViewAnalytics';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import HomeIcon from '@mui/icons-material/Home';
import SpeedIcon from '@mui/icons-material/Speed';
import CampusService from 'src/@core/service/campus';
import ReportCount from '../components/chart/reportCount';
import { donutData, lineChartData } from 'src/_mock/chartData';
import ReportCountChart from '../components/chart/reportCountChart';
import ReportCompareChart from '../components/chart/reportCompareChart';
import ResponsibleUserForChart from '../components/table/chart/responsibleUserForChart';
import ResponsibleGroupForChart from '../components/table/chart/responsibleGroupForChart';
import DailyDetailReport from '../components/table/chart/dailyDetailReport';
import RenderHorizontalBarChart from '../components/chart/barChart.tsx/reportHorizontalBarForTop5Criteria';
import { ChartSkeleton } from '../components/skeleton/chartSkeleton';
import { TableSkeleton } from '../components/skeleton/tableSkeleton';
import DailyShiftByCampus from '../components/table/chart/dailyShiftByCampus';


// ----------------------------------------------------------------------


export default function ThreeView() {
  const [data, setData] = useState<any>({});
  const [campus, setCampus] = useState<any[]>([]);
  const [dailyTagByUserData, setDailyTagByUserData] = useState<any>();
  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [dailyRoomGroupData, setDailyRoomGroupData] = useState<any>();
  const [dailyReportData, setDailyReportData] = useState<any>();
  const [dailyTop5CriteriaValueData, setDailyTop5CriteriaValueData] = useState<any>();
  const [dailyShiftValueData, setDailyShiftValueData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const settings = useSettingsContext();


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: any = await CampusService.getAllCampus();
        setCampus(response);

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [
          donutResponse,
          tagUserResponse,
          roomGroupResponse,
          dailyReportResponse,
          criteriaResponse,
          shiftResponse
        ] = await Promise.all([
          ChartService.GetCleaningProgressByCampusId(selectedCampus === 'All' ? '' : selectedCampus),
          ChartService.GetDailyTagAndUserByCampus(selectedCampus === 'All' ? '' : selectedCampus),
          ChartService.GetDailyRoomGroupReportByCampus(selectedCampus === 'All' ? '' : selectedCampus),
          ChartService.GetDailyReportStatusTableByCampus(selectedCampus === 'All' ? '' : selectedCampus),
          ChartService.GetAverageValueForCriteriaPerCampus(selectedCampus === 'All' ? '' : selectedCampus),
          ChartService.GetDailyComparisionByCampus(selectedCampus === 'All' ? '' : selectedCampus)
        ]);

        setData(donutResponse);
        setDailyTagByUserData(tagUserResponse);
        setDailyRoomGroupData(roomGroupResponse);
        setDailyReportData(dailyReportResponse);
        setDailyTop5CriteriaValueData(criteriaResponse);
        setDailyShiftValueData(shiftResponse)
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [selectedCampus]);


  if (isLoading) {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
              <ChartSkeleton />
              <ChartSkeleton />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
              <ChartSkeleton />
              <TableSkeleton />
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <TableSkeleton />
          </Grid>
          <Grid item xs={6}>
            <ChartSkeleton />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <TableSkeleton />
          </Grid>
          <Grid item xs={6}>
            <ChartSkeleton />
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h3'>Báo cáo thống kê</Typography>
        <Select
          labelId="base-select-label1"
          id="base-select1"
          style={{ float: 'right', border: '1px solid #000' }}
          value={selectedCampus || 'All'}
          onChange={(e) => setSelectedCampus(e.target.value)}
        >
          <MenuItem value="All">
            <Typography variant='subtitle1'>
              Tất cả cơ sở
            </Typography>
          </MenuItem>
          {campus.map((c: any) => (
            <MenuItem key={c.id} value={c.id}>
              <Typography variant='subtitle1'>
                {c.campusName}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        <Grid item xs={8} sx={{ height: 'revert' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <ReportCount data={data} />
            <ReportCompareChart />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <ReportCountChart data={data} />
            {dailyReportData && < DailyDetailReport data={dailyReportData} campusName={selectedCampus === 'All' ? "tất cả cơ sở" : campus.find(c => c.id === selectedCampus).campusName} />}
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        <Grid item xs={6} sx={{ height: 'revert' }}>
          {dailyTagByUserData && <ResponsibleUserForChart data={dailyTagByUserData} />}
        </Grid>
        <Grid item xs={6}>
          {dailyTop5CriteriaValueData && <RenderHorizontalBarChart data={dailyTop5CriteriaValueData} campusName={selectedCampus === 'All' ? "tất cả cơ sở" : campus.find(c => c.id === selectedCampus).campusName} />}
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        <Grid item xs={6} sx={{ height: 'revert' }}>
          {dailyRoomGroupData && <ResponsibleGroupForChart data={dailyRoomGroupData} />}
        </Grid>
        <Grid item xs={6}>
          {dailyShiftValueData && <DailyShiftByCampus data={dailyShiftValueData} campusName={selectedCampus === 'All' ? "tất cả cơ sở" : campus.find(c => c.id === selectedCampus).campusName} />}
        </Grid>
      </Grid>

    </Container>
  );
}
