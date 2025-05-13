import { Card, CardContent, Typography } from '@mui/material';

type DashboardCardProps = {
  count: number;
  title: string;
  description: string;
  selected?: boolean;
};

const DashboardCard = ({ count, title, description, selected }: DashboardCardProps) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: selected ? '1px solid #1f1f1f':"",
        boxShadow: selected ? 3 : 1,
        background: selected ? '#f1f5f9' :'#ffffff' ,
        cursor: 'pointer',
        transition: '0.2s ease-in-out',
        width:"100%"
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="h4">
          {count}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
