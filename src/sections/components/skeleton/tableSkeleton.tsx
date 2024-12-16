import { Card, CardContent, Skeleton } from "@mui/material";

export const TableSkeleton = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={50} />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" width="100%" height={40} sx={{ my: 1 }} />
        ))}
      </CardContent>
    </Card>
  );