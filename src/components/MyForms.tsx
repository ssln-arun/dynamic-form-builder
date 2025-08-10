import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FormSchema } from '../types';

export default function MyForms() {
  const [forms, setForms] = useState<FormSchema[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('forms');
    if (stored) {
      try {
        setForms(JSON.parse(stored));
      } catch (err) {
        console.error('Error parsing stored forms:', err);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      const updatedForms = forms.filter((form) => form.id !== id);
      setForms(updatedForms);
      localStorage.setItem('forms', JSON.stringify(updatedForms));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Forms
      </Typography>

      {forms.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No forms created yet. Go to{' '}
          <Link to="/create" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Create Form
          </Link>{' '}
          to start.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {forms.map((form) => (
            <Card
              key={form.id}
              variant="outlined"
              sx={{
                flex: '1 1 calc(33.333% - 16px)',
                minWidth: '250px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  noWrap
                  title={form.name}
                >
                  {form.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(form.createdAt).toLocaleString()}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  variant="contained"
                  component={Link}
                  to={`/preview/${form.id}`}
                >
                  Preview
                </Button>
                <Tooltip title="Delete Form">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(form.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}