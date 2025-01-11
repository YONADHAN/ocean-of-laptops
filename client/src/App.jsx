import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AdminRoutes from './routes/adminRoutes';
import UserRoutes from './routes/userRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Error404Page from './pages/others/Error404';
import PublicRoutes from './routes/PublicRoutes'
// import PublicRoutes from './routes/PublicRoutes'
const App = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error('Google Client ID is missing! Please set it in your environment variables.');
    return <p>Error: Missing Google Client ID</p>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>         
          
          <Route path="/*" element={<PublicRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/user/*" element={<UserRoutes />} />
          {/* <Route path='/' element={<PublicRoutes/>}/> */}
          <Route path="*" element={<Error404Page />} />     

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
