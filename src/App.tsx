import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormBuilder from './components/FormBuilder';
import FormPreview from './components/FormPreview';
import MyForms from './components/MyForms';
import HomePage from './components/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<FormBuilder />} />
        <Route path="/preview/:id" element={<FormPreview />} />
        <Route path="/myforms" element={<MyForms />} />
      </Routes>
    </BrowserRouter>
  );
}