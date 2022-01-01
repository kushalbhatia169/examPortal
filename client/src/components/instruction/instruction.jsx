import React, { useContext } from 'react';
import { Box, Button } from '@mui/material';
import { /* Link, */ } from 'react-router-dom';
// import DownloadIcon from '@mui/icons-material/Download';
import { context } from '../../store/store';
import '../profile/profile.scss';
import 'antd/dist/antd.css';
import './instruction.scss';
import withProfile from '../../common/profile_hoc/with_profie_hoc';
import { commonNodeModules } from '../../common/index.jsx';

const { bootbox } = commonNodeModules;
const Instruction = (props) => {
  const { state, dispatch } = useContext(context),
        { userData } = state,
        { children } = props;
  //   const history = useHistory();
  const showConsent = () => {
    bootbox.alert('msg');
  };
  return (
    <Box className="profile-main instruction-main">
      {children}
      <Box className="instruction-main__body d-flex flex-column flex-wrap">
        <Box className="instruction-main__header mt-5 d-flex justify-content-center">
          <h1 className="mt-3" style={{ fontSize: 44 }}>Instruction</h1>
        </Box>
        <Box className="instruction-main__body mt-5">
          <ul className="mt-3 ms-5">
            <li className="mt-3" style={{ fontSize: 18 }}>Welcome to Online Exam Portal</li>
            <li className="mt-3" style={{ fontSize: 18 }}>Exam has total 120 question</li>
            <li className="mt-3" style={{ fontSize: 18 }}>Total time in Exam is 120 Minutes</li>
            <li className="mt-3" style={{ fontSize: 18 }}>Negative Marking Exam : <b style={{ fontSize: 20 }}>No</b></li>
          </ul>
        </Box>
        <Box className="instruction-main__footer mt-5 ms-3 pb-4">
          <i className="mb-5" style={{ fontSize: 38 }}>Best of luck for your exam {userData?.username}.</i>
        </Box>
        <Box className="d-flex justify-content-center">
          <Button className="btn btns w-25 mt-4" onClick={() => { showConsent }}>
            <span style={{ fontSize: 18 }}>Start Exam</span>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default withProfile(Instruction);