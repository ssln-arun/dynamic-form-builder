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

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedType, setSelectedType] = useState("");
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
      validation: {}
    };
    setFields((prev) => [...prev, newField]);
    setSelectedType("");
  };

  const updateField = (id: string, key: keyof FormField, value: any) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const updateValidation = (id: string, rule: string, value: any) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, validation: { ...f.validation, [rule]: value } }
          : f
      )
    );
  };

  const moveField = (id: string, dir: "up" | "down") => {
    const index = fields.findIndex((f) => f.id === id);
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

  const saveForm = () => {
    if (fields.length === 0) {
      alert("Please add at least one field before saving.");
      return;
    }
    const name = prompt("Enter form name:");
    if (!name || !name.trim()) {
      alert("Form name cannot be empty.");
      return;
    }

    const stored = localStorage.getItem("forms");
    const existingForms: FormSchema[] = stored ? JSON.parse(stored) : [];
    if (
      existingForms.some(
        (form) => form.name.trim().toLowerCase() === name.trim().toLowerCase()
      )
    ) {
      alert("A form with this name already exists.");
      return;
    }

    const newForm: FormSchema = {
      id: uuid(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      fields
    };

    dispatch(addForm(newForm));
    localStorage.setItem("forms", JSON.stringify([...existingForms, newForm]));
    alert("Form saved successfully!");
    setFields([]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Form
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="" disabled>
            Select Field Type
          </MenuItem>
          {[
            "text",
            "number",
            "textarea",
            "select",
            "radio",
            "checkbox",
            "date"
          ].map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={addField}>
          Add Field
        </Button>
      </Stack>

      {/* Fields List */}
      <Stack spacing={2}>
        {fields.map((f, index) => (
          <Paper
            key={f.id}
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <Stack spacing={2}>
              <TextField
                size="small"
                fullWidth
                label="Label"
                value={f.label}
                onChange={(e) => updateField(f.id, "label", e.target.value)}
              />
              <TextField
                size="small"
                fullWidth
                label="Default Value"
                value={f.defaultValue}
                onChange={(e) => updateField(f.id, "defaultValue", e.target.value)}
              />

              {f.type === "text" || f.type === "textarea" ? (
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={f.validation?.required || false}
                        onChange={(e) =>
                          updateValidation(f.id, "required", e.target.checked)
                        }
                      />
                    }
                    label="Required"
                  />
                  <TextField
                    type="number"
                    size="small"
                    label="Min Length"
                    value={f.validation?.minLength || ""}
                    onChange={(e) =>
                      updateValidation(
                        f.id,
                        "minLength",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                  <TextField
                    type="number"
                    size="small"
                    label="Max Length"
                    value={f.validation?.maxLength || ""}
                    onChange={(e) =>
                      updateValidation(
                        f.id,
                        "maxLength",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={f.validation?.email || false}
                        onChange={(e) =>
                          updateValidation(f.id, "email", e.target.checked)
                        }
                      />
                    }
                    label="Email Format"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={f.validation?.password || false}
                        onChange={(e) =>
                          updateValidation(f.id, "password", e.target.checked)
                        }
                      />
                    }
                    label="Password Rule"
                  />
                </Stack>
              ) : f.type === "number" ? (
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={f.validation?.required || false}
                        onChange={(e) =>
                          updateValidation(f.id, "required", e.target.checked)
                        }
                      />
                    }
                    label="Required"
                  />
                  <TextField
                    type="number"
                    size="small"
                    label="Min Value"
                    value={f.validation?.minLength || ""}
                    onChange={(e) =>
                      updateValidation(
                        f.id,
                        "minValue",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                  <TextField
                    type="number"
                    size="small"
                    label="Max Value"
                    value={f.validation?.maxLength || ""}
                    onChange={(e) =>
                      updateValidation(
                        f.id,
                        "maxValue",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                </Stack>
              ) : ["select", "radio", "checkbox", "date"].includes(f.type) ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={f.validation?.required || false}
                      onChange={(e) =>
                        updateValidation(f.id, "required", e.target.checked)
                      }
                    />
                  }
                  label="Required"
                />
              ) : null}

              {["select", "radio", "checkbox"].includes(f.type) && (
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Options:</Typography>
                  {f.options?.map((opt, i) => (
                    <Stack key={i} direction="row" spacing={1}>
                      <TextField
                        size="small"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...(f.options || [])];
                          newOpts[i] = e.target.value;
                          updateField(f.id, "options", newOpts);
                        }}
                      />
                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          updateField(
                            f.id,
                            "options",
                            (f.options || []).filter((_, idx) => idx !== i)
                          )
                        }
                      >
                        Delete
                      </Button>
                    </Stack>
                  ))}
                  <Button
                    size="small"
                    onClick={() =>
                      updateField(f.id, "options", [
                        ...(f.options || []),
                        `Option ${f.options?.length! + 1}`
                      ])
                    }
                  >
                    Add Option
                  </Button>
                </Stack>
              )}

              <Divider />
              <ButtonGroup size="small" variant="outlined">
                <Button onClick={() => moveField(f.id, "up")} disabled={index === 0}>
                  Up
                </Button>
                <Button
                  onClick={() => moveField(f.id, "down")}
                  disabled={index === fields.length - 1}
                >
                  Down
                </Button>
                <Button color="error" onClick={() => deleteField(f.id)}>
                  Delete
                </Button>
              </ButtonGroup>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {fields.length > 0 && (
        <Button
          variant="contained"
          color="success"
          onClick={saveForm}
          sx={{ mt: 3 }}
        >
          Save Form
        </Button>
      )}
    </Box>
  );
}