import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
// import DownloadIcon from '@mui/icons-material/Download';
import { context } from '../../store/store';
import '../profile/profile.scss';
import 'antd/dist/antd.css';
import '../instruction/instruction.scss';
import withProfile from '../../common/profile_hoc/with_profie_hoc';

const Result = (props) => {
  const { state, dispatch } = useContext(context),
        { userData } = state || {};
  const [_isMounted, _setIsMounted] = useState(true);
  const { children } = props;

  useEffect(() => {
    if (_isMounted) {
      dispatch({ type: 'Exam', payload: [] });
    }
    return () => {
      _setIsMounted(false);
    };
  }, []);
  return (
    <Box className="profile-main instruction-main">
      {children}
      <Box className="instruction-main__body d-flex flex-column flex-wrap">
        <Box className="instruction-main__header mt-5 d-flex justify-content-center">
          <h1 className="mt-3" style={{ fontSize: 44 }}>Congratulations</h1>
        </Box>
        <Box className="instruction-main__body mt-5 d-flex justify-content-center">
          <h1>Your Text is successully submitted.</h1>
        </Box>
        <Box className="instruction-main__footer mt-5 ms-3 pb-4 d-flex justify-content-center">
          <Link to={`/profile/${userData._id}`}>Move Back to Profile Page</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default withProfile(Result);