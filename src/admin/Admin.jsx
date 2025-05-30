import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Admin from './admin/Admin';
// ...existing imports...

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        {/* ...route อื่นๆ */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;