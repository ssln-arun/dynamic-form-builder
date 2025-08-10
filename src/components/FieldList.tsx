import type { FormField } from '../types';
import { Button } from '@mui/material';

interface Props {
  fields: FormField[];
  onEdit: (field: FormField) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export default function FieldList({
  fields,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  return (
    <div>
      {fields.map((f, index) => (
        <div
          key={f.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
            padding: 8,
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        >
          <div>{f.label} ({f.type})</div>
          <div>
            <Button size="small" onClick={() => onMoveUp(f.id)} disabled={index === 0}>↑</Button>
            <Button size="small" onClick={() => onMoveDown(f.id)} disabled={index === fields.length - 1}>↓</Button>
            <Button size="small" onClick={() => onEdit(f)}>Edit</Button>
            <Button size="small" color="error" onClick={() => onDelete(f.id)}>Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
}