import React, { useEffect, useState } from 'react';
import './index.css'

import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout/Layout.jsx';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Authentication/Login/Login.jsx';
import Services from './pages/Services/Sevices.jsx';
import ArrivalAtOccurence from './pages/ArrivalAtOccurence/ArrivalAtOccurence.jsx';
import ClosingOccurence from './pages/ClosingOccurence/ClosingOccurence.jsx';
import Guoftheday from './pages/GuOfTheDay/GuOfTheDay.jsx';
import StaffRegistration from './pages//Registation/StaffRegistration/StaffRegistration.jsx';
import VehicleRegistration from './pages/Registation/VehicleRegistration/VehicleRegistration.jsx';
import ApplicantRegistration from './pages/Registation/ApplicantRegistration/ApplicantRegistration.jsx';
import OccurenceCodeRegistration from './pages/Registation/OccurenceCodeRegistration/OccurenceCodeRegistration.jsx';
import GuRegistration from './pages/Registation/guRegistration/guRegistration.jsx';
import StreetRegistration from './pages/Registation/StreetRegistration/StreetRegistration.jsx';
import NewServices from './pages/Services/ServiceNew.jsx';
import ListServices from "./pages/Services/ServiceList.jsx";
import ListServiceChild from './pages/Services/ServiceListChild.jsx';
import SearchData from './pages/SearchData/SearchData.jsx';
import AdminPage from './pages/Authentication/AdminPage/AdminPage.jsx';
import ViewItems from './pages/Authentication/AdminPage/ViewItems.jsx'
import Report from './pages/Report/Report.jsx';
import EditService from './pages/Services/EditService.jsx'
// import ViewReport from './pages/Report/ViewReport.jsx';



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage on component initialization
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    return storedLoginStatus === 'true';
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // Store login state
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" />}
        >
          <Route path="" element={<Home />} />
          <Route path="service/" element={<Services />} >
            <Route path="newservice" element={<NewServices />} />
            <Route path="editservice" element={<EditService />} />
            <Route path="listservice/" element={<ListServices />} />
            <Route path="listchild/:id" element={<ListServiceChild />} />
          </Route>
          <Route path="arrival" element={<ArrivalAtOccurence />} />
          <Route path="guoftheday" element={<Guoftheday />} />
          <Route path="closing" element={<ClosingOccurence />} />
          <Route path="staffregistration" element={<StaffRegistration />} />
          <Route path="vehicleregistration" element={<VehicleRegistration />} />
          <Route path="guregistration" element={<GuRegistration />} />
          <Route path="appilcantregistration" element={<ApplicantRegistration />} />
          <Route path="streetregistration" element={<StreetRegistration />} />
          <Route path="occurencecode" element={<OccurenceCodeRegistration />} />
          <Route path="search/:id" element={<SearchData />} />
          <Route path="report" element={<Report />} />
          {/* <Route path="report/:id" element={<ViewReport />} /> */}
          
        </Route>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/admin/dashboard/" element={isLoggedIn ? <AdminPage onLogout={handleLogout}/> : <Navigate to="/login" />} /> 
        <Route path='/admin/dashboard/viewitems' element={<ViewItems  />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(
  
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
