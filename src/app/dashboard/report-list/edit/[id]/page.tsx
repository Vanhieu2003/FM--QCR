import React from 'react'
import ReportEditView from 'src/sections/report-list/EditReport'

type Props = {
  params: {
    id: string;
  };
};

export const metadata = {
  title: 'Chỉnh sửa báo cáo',
};

const page = ({params}:Props) => {
  
  const {id} = params;

  return (
    <ReportEditView reportId={id}/>
  )
}

export default page