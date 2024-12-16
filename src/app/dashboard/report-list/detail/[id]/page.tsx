import React from 'react'
import ReportDetailView from 'src/sections/report-list/ReportDetail'

type Props = {
  params: {
    id: string;
  };
};

export const metadata = {
  title: 'Chi tiết báo cáo',
};
const page = ({params}:Props) => {
  
  const {id} = params;

  return (
    <ReportDetailView id={id}/>
  )
}

export default page