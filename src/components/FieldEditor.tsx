import { useState } from 'react';
import type { FormField } from '../types';
import { TextField, FormControlLabel, Checkbox, Button } from '@mui/material';

interface Props {
  field: FormField;
  onSave: (updated: FormField) => void;
}

export default function FieldEditor({ field, onSave }: Props) {
  const [editField, setEditField] = useState<FormField>(field);

  const handleChange = (key: keyof FormField, value: any) => {
    setEditField(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ padding: 10 }}>
      <TextField
        fullWidth
        label="Label"
        value={editField.label}
        onChange={e => handleChange('label', e.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={editField.validation?.required || false}
            onChange={e =>
              setEditField(prev => ({
                ...prev,
                validation: { ...prev.validation, required: e.target.checked },
              }))
            }
          />
        }
        label="Required"
      />
      <Button variant="contained" onClick={() => onSave(editField)}>
        Save
      </Button>
    </div>
  );
}