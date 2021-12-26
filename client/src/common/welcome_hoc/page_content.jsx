import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

const PageContent = () => {
  return (
    <Box className="welcome-page-content">
      <Introduction />
    </Box>
  );
};

const Introduction = () => {
  return <Box className="welcome-page-content__intro d-flex align-items-center justify-content-evenly mt-5">
    <h2 className="me-5 p-1 mt-3 p_box d-flex w-50 h-75 justify-content-center">
      Already on Exam Portal? <Link to="/login" className="ms-2 heading welcome-head__link__list"style={{ fontSize: 28 }}>Login</Link>
    </h2>
    <h2 className="me-1 p-1 mt-3 d-flex align-items-center w-50">
        Click to register
      <Link to="/register" className="ms-2 heading welcome-head__link__list" style={{ fontSize: 28 }}>
        Register</Link>
    </h2>
  </Box>;
};

export default PageContent;
