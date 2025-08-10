export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  password?: boolean;
}

export interface DerivedField {
  parents: string[];
  formula: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  defaultValue?: string;
  options?: string[];
  validation?: ValidationRule;
  derived?: DerivedField;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
}