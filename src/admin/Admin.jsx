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

export default function Admin() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>ยินดีต้อนรับเข้าสู่หน้า Admin. เพิ่มเนื้อหาที่คุณต้องการแสดงที่นี่.</p>
    </div>
  );
}

