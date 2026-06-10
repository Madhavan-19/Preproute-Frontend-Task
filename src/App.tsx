import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import CreateTest from "./pages/CreateTest/CreateTest";
import TestTracking  from "./pages/TestTrack/TestTracking";
import Dashboard  from "./pages/Dashboard/Dashboard";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path='/create-test' element={<CreateTest />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/test-tracking' element={<TestTracking />} /> 
        
      

        {/* 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;