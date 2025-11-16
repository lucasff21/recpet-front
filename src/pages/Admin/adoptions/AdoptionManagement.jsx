import React from 'react';
import '../../../styles/UserManagement.css';
import { Route, Routes } from 'react-router-dom';
import AdoptionsPage from './AdoptionsPage';
import AdoptionDetailsPage from './AdoptionDetailsPage';

const AdoptionManagement = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdoptionsPage />} />
        <Route path="/:id" element={<AdoptionDetailsPage />} />
      </Routes>
    </>
  );
};

export default AdoptionManagement;
