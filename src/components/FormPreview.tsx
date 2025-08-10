import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  Alert
} from "@mui/material";
import type { RootState } from "../store";
import type { FormField } from "../types";

export default function FormPreview() {
  const { id } = useParams();
  const form = useSelector((state: RootState) =>
    state.forms.find((f) => f.id === id)
  );

  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (form) {
      const initial: Record<string, any> = {};
      form.fields.forEach((f) => {
        if (f.type === "checkbox") {
          initial[f.id] = Array.isArray(f.defaultValue) ? f.defaultValue : [];
        } else {
          initial[f.id] = f.defaultValue || "";
        }
      });
      setValues(initial);
    }
  }, [form]);

  const validateField = useCallback((field: FormField, value: any) => {
    const v = field.validation || {};

    if (v.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return "This field is required";
    }

    if (field.type === "number") {
      const numVal = Number(value);
      if (isNaN(numVal)) return "Please enter a valid number";
      if (v.minLength !== undefined && numVal < v.minLength) {
        return `Minimum value is ${v.minLength}`;
      }
      if (v.maxLength !== undefined && numVal > v.maxLength) {
        return `Maximum value is ${v.maxLength}`;
      }
    } else {
      if (v.minLength && String(value).length < v.minLength) {
        return `Minimum length is ${v.minLength}`;
      }
      if (v.maxLength && String(value).length > v.maxLength) {
        return `Maximum length is ${v.maxLength}`;
      }
    }

    if (v.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Invalid email format";
    }

    if (v.password && value && !/^(?=.*[0-9]).{8,}$/.test(value)) {
      return "Password must be at least 8 characters and contain a number";
    }

    return "";
  }, []);

  const handleChange = (field: FormField, value: any) => {
    const updated = { ...values, [field.id]: value };
    setValues(updated);
    setErrors((prev) => ({
      ...prev,
      [field.id]: validateField(field, value)
    }));
  };

  const isFormValid = useCallback(() => {
    if (!form) return false;
    return form.fields.every((f) => !validateField(f, values[f.id]));
  }, [form, values, validateField]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const newErrors: Record<string, string> = {};
    form.fields.forEach((f) => {
      const err = validateField(f, values[f.id]);
      if (err) newErrors[f.id] = err;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }
  };

  if (!form) {
    return <Alert severity="error">Form not found</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 600, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {form.name}
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        {form.fields.map((f) => {
          const v = f.validation || {};
          const rulesText = [
            v.required ? "Required" : "",
            f.type === "number"
              ? v.minLength !== undefined
                ? `Min: ${v.minLength}`
                : ""
              : v.minLength !== undefined
              ? `Min length: ${v.minLength}`
              : "",
            f.type === "number"
              ? v.maxLength !== undefined
                ? `Max: ${v.maxLength}`
                : ""
              : v.maxLength !== undefined
              ? `Max length: ${v.maxLength}`
              : "",
            v.email ? "Email format" : "",
            v.password ? "Password with number" : ""
          ]
            .filter(Boolean)
            .join(" • ");

          return (
            <Box key={f.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {f.label}
                {v.required && <span style={{ color: "red" }}> *</span>}
              </Typography>
              {rulesText && (
                <Typography variant="caption" color="text.secondary">
                  {rulesText}
                </Typography>
              )}

              {["text", "number", "date", "textarea"].includes(f.type) && (
                <TextField
                  fullWidth
                  type={f.type === "textarea" ? "text" : f.type}
                  value={values[f.id] || ""}
                  multiline={f.type === "textarea"}
                  minRows={f.type === "textarea" ? 3 : undefined}
                  onChange={(e) => handleChange(f, e.target.value)}
                  error={Boolean(errors[f.id])}
                  helperText={errors[f.id]}
                  size="small"
                />
              )}

              {f.type === "select" && (
                <TextField
                  select
                  fullWidth
                  value={values[f.id] || ""}
                  onChange={(e) => handleChange(f, e.target.value)}
                  error={Boolean(errors[f.id])}
                  helperText={errors[f.id]}
                  size="small"
                >
                  <MenuItem value="">Select...</MenuItem>
                  {(f.options || []).map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {f.type === "radio" && (
                <>
                  <RadioGroup
                    value={values[f.id] || ""}
                    onChange={(e) => handleChange(f, e.target.value)}
                  >
                    {(f.options || []).map((opt) => (
                      <FormControlLabel
                        key={opt}
                        value={opt}
                        control={<Radio size="small" />}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>
                  {errors[f.id] && (
                    <Typography variant="caption" color="error">
                      {errors[f.id]}
                    </Typography>
                  )}
                </>
              )}

              {f.type === "checkbox" && (
                <>
                  {(f.options || []).map((opt) => (
                    <FormControlLabel
                      key={opt}
                      control={
                        <Checkbox
                          size="small"
                          checked={(values[f.id] || []).includes(opt)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const prevVals = values[f.id] || [];
                            const newVals = checked
                              ? [...prevVals, opt]
                              : prevVals.filter((v: string) => v !== opt);
                            handleChange(f, newVals);
                          }}
                        />
                      }
                      label={opt}
                    />
                  ))}
                  {errors[f.id] && (
                    <Typography variant="caption" color="error">
                      {errors[f.id]}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          );
        })}

        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={!isFormValid()}
        >
          Submit
        </Button>
      </form>

      {submitted && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Form submitted successfully
        </Alert>
      )}
    </Box>
  );
}