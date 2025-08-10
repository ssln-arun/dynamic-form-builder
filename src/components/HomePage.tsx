import { Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '3rem' }}>
      <Typography variant="h3" gutterBottom>
        Dynamic Form Builder
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Create, manage, and preview forms with ease.
      </Typography>

      <Stack spacing={2} mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/create')}
        >
          Create New Form
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/myforms')}
        >
          View My Forms
        </Button>
      </Stack>
    </Container>
  );
}