import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useDispatch } from "react-redux";
import { addForm } from "../slices/formSlice";
import type { FormField, FormSchema } from "../types";
import {
  Box,
  Stack,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  ButtonGroup,
  Divider
} from "@mui/material";
import type {  SelectChangeEvent, TextFieldProps } from "@mui/material";

const SmallTextField = (props: TextFieldProps) => (
  <TextField
    size="small"
    {...props}
    sx={{
      "& .MuiInputBase-root": {
        height: 34,
        fontSize: "0.875rem",
      },
      "& .MuiInputBase-input": {
        padding: "4px 8px",
      },
      ...props.sx,
    }}
  />
);

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const dispatch = useDispatch();

  const addField = () => {
    if (!selectedType) return;
    const newField: FormField = {
      id: uuid(),
      type: selectedType as FormField["type"],
      label: `${selectedType} field`,
      defaultValue: "",
      options: ["select", "radio", "checkbox"].includes(selectedType)
        ? ["Option 1", "Option 2"]
        : undefined,
      validation: {},
    };
    setFields((prev) => [...prev, newField]);
    setSelectedType("");
    setFormErrors(null);
  };

  const updateField = (id: string, key: keyof FormField, value: unknown) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const updateValidation = (id: string, rule: string, value: unknown) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, validation: { ...f.validation, [rule]: value } } : f
      )
    );
  };

  const moveField = (id: string, dir: "up" | "down") => {
    const index = fields.findIndex((f) => f.id === id);
    if (index === -1) return;
    const updated = [...fields];
    if (dir === "up" && index > 0) {
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      setFields(updated);
    }
    if (dir === "down" && index < fields.length - 1) {
      [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
      setFields(updated);
    }
  };

  const deleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const validateBeforeSave = (): string | null => {
    if (fields.length === 0) return "Add at least one field before saving.";
    for (const f of fields) {
      if (!f.label || !f.label.trim()) return `Field label is required (id: ${f.id}).`;
      if (["select", "radio", "checkbox"].includes(f.type)) {
        if (!f.options || f.options.length === 0) return `Add options for "${f.label}".`;
        for (const opt of f.options) {
          if (!opt || !String(opt).trim()) return `Option values cannot be empty (field: ${f.label}).`;
        }
      }
      if (f.type === "number") {
        const minV = f.validation?.minLength;
        const maxV = f.validation?.maxLength;
        if (minV !== undefined && maxV !== undefined && Number(minV) > Number(maxV)) {
          return `For "${f.label}", Min Value cannot be greater than Max Value.`;
        }
      }
      if (f.type === "text" || f.type === "textarea") {
        const minL = f.validation?.minLength;
        const maxL = f.validation?.maxLength;
        if (minL !== undefined && maxL !== undefined && Number(minL) > Number(maxL)) {
          return `For "${f.label}", Min Length cannot be greater than Max Length.`;
        }
      }
    }
    return null;
  };

  const saveForm = () => {
    const err = validateBeforeSave();
    if (err) {
      setFormErrors(err);
      return;
    }
    setFormErrors(null);

    const name = prompt("Enter form name:");
    if (!name || !name.trim()) {
      setFormErrors("Form name cannot be empty.");
      return;
    }

    const stored = localStorage.getItem("forms");
    const existingForms: FormSchema[] = stored ? JSON.parse(stored) : [];
    const exists = existingForms.some((sf) => sf.name.trim().toLowerCase() === name.trim().toLowerCase());
    if (exists) {
      setFormErrors("A form with this name already exists. Choose another name.");
      return;
    }

    const schema: FormSchema = {
      id: uuid(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      fields,
    };

    dispatch(addForm(schema));
    localStorage.setItem("forms", JSON.stringify([...existingForms, schema]));
    setFields([]);
    alert("Form saved!");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Create Form
      </Typography>

      {formErrors && (
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          {formErrors}
        </Typography>
      )}

      <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
        <Select
          value={selectedType}
          onChange={(e: SelectChangeEvent<string>) => setSelectedType(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="" disabled>
            Select Field Type
          </MenuItem>
          {["text", "number", "textarea", "select", "radio", "checkbox", "date"].map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </Select>

        <Button variant="contained" onClick={addField} size="small">
          Add Field
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => {
            setFields([]);
            setFormErrors(null);
          }}
        >
          Clear
        </Button>
      </Stack>

      <Stack spacing={1}>
        {fields.map((f, idx) => (
          <Paper key={f.id} sx={{ p: 1, borderRadius: 1 }}>
            <Stack spacing={1}>
              <SmallTextField
                fullWidth
                label="Label"
                value={f.label}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField(f.id, "label", e.target.value)
                }
              />

              <SmallTextField
                fullWidth
                label="Default Value"
                value={f.defaultValue as string}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField(f.id, "defaultValue", e.target.value)
                }
              />

              {f.type === "text" || f.type === "textarea" ? (
                <Stack spacing={0.5}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={!!f.validation?.required}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateValidation(f.id, "required", e.target.checked)
                        }
                      />
                    }
                    label="Required"
                  />
                  <Stack direction="row" spacing={1}>
                    <SmallTextField
                      type="number"
                      label="Min length"
                      value={f.validation?.minLength ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateValidation(f.id, "minLength", e.target.value ? parseInt(e.target.value, 10) : undefined)
                      }
                      sx={{ flex: 1 }}
                    />
                    <SmallTextField
                      type="number"
                      label="Max length"
                      value={f.validation?.maxLength ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateValidation(f.id, "maxLength", e.target.value ? parseInt(e.target.value, 10) : undefined)
                      }
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                </Stack>
              ) : f.type === "number" ? (
                <Stack spacing={0.5}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={!!f.validation?.required}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateValidation(f.id, "required", e.target.checked)
                        }
                      />
                    }
                    label="Required"
                  />
                  <Stack direction="row" spacing={1}>
                    <SmallTextField
                      type="number"
                      label="Min value"
                      value={f.validation?.minLength ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateValidation(f.id, "minValue", e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                      sx={{ flex: 1 }}
                    />
                    <SmallTextField
                      type="number"
                      label="Max value"
                      value={f.validation?.maxLength ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateValidation(f.id, "maxValue", e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                </Stack>
              ) : (
                ["select", "radio", "checkbox", "date"].includes(f.type) && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={!!f.validation?.required}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateValidation(f.id, "required", e.target.checked)
                        }
                      />
                    }
                    label="Required"
                  />
                )
              )}

              {["select", "radio", "checkbox"].includes(f.type) && (
                <Stack spacing={1}>
                  <Typography variant="caption">Options</Typography>
                  {f.options?.map((opt, i) => (
                    <Stack key={i} direction="row" spacing={1}>
                      <SmallTextField
                        value={opt}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newOpts = [...(f.options || [])];
                          newOpts[i] = e.target.value;
                          updateField(f.id, "options", newOpts);
                        }}
                        sx={{ flex: 1 }}
                      />
                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          updateField(f.id, "options", (f.options || []).filter((_, idx) => idx !== i))
                        }
                      >
                        Delete
                      </Button>
                    </Stack>
                  ))}
                  <Button
                    size="small"
                    onClick={() =>
                      updateField(f.id, "options", [...(f.options || []), `Option ${f.options?.length! + 1}`])
                    }
                  >
                    Add Option
                  </Button>
                </Stack>
              )}

              <Divider />

              <Stack direction="row" spacing={1} justifyContent="space-between">
                <ButtonGroup size="small" variant="outlined">
                  <Button onClick={() => moveField(f.id, "up")} disabled={idx === 0}>
                    Up
                  </Button>
                  <Button onClick={() => moveField(f.id, "down")} disabled={idx === fields.length - 1}>
                    Down
                  </Button>
                </ButtonGroup>

                <Button size="small" color="error" variant="outlined" onClick={() => deleteField(f.id)}>
                  Delete
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button variant="contained" color="success" onClick={saveForm} size="small" disabled={fields.length === 0}>
          Save Form
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={() => {
            const preview = { fields };
            alert("Preview (schema):\n" + JSON.stringify(preview, null, 2));
          }}
        >
          View Schema
        </Button>
      </Stack>
    </Box>
  );
}