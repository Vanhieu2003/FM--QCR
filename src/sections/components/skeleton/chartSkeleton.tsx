import { Card, CardContent, Skeleton } from "@mui/material";


interface props{
  customHeight?:number
}
export const ChartSkeleton = ({customHeight}:props) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Skeleton variant="rectangular" width="100%" height={customHeight ?? 300} />
      </CardContent>
    </Card>
  );