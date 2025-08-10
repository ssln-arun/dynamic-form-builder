import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FormSchema } from '../types';

const load = (): FormSchema[] => {
  const raw = localStorage.getItem('forms');
  return raw ? JSON.parse(raw) : [];
};

const save = (forms: FormSchema[]) => {
  localStorage.setItem('forms', JSON.stringify(forms));
};

const initialState: FormSchema[] = load();

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addForm: (state, action: PayloadAction<FormSchema>) => {
      state.push(action.payload);
      save(state);
    },
    updateForm: (state, action: PayloadAction<FormSchema>) => {
      const index = state.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        save(state);
      }
    },
  },
});

export const { addForm, updateForm } = formsSlice.actions;
export default formsSlice.reducer;