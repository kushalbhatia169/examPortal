import React, { useContext } from 'react';
import { Box, Button } from '@mui/material';
import { useHistory, Redirect } from 'react-router-dom';
// import DownloadIcon from '@mui/icons-material/Download';
import { context } from '../../store/store';
import '../profile/profile.scss';
import 'antd/dist/antd.css';
import './instruction.scss';
import withProfile from '../../common/profile_hoc/with_profie_hoc';
import { Modal } from 'antd';
import { InfoCircleTwoTone } from '@ant-design/icons';
import APICallManager from '../../services/api_manager';

const { confirm } = Modal;

const Instruction = (props) => {
  const { state, dispatch } = useContext(context),
        { userData, userData: { testInfo } } = state || {};
  if (!userData._id) {
    return <Redirect to="/login" />;
  }
  const { children } = props,
        history = useHistory();
  const showConfirm = () => {
    confirm({
      title: 'Are you ready to start test?',
      icon: <InfoCircleTwoTone />,
      content: `After clicking the OK button, test will start don't refresh the page otherwise
       your progress will be lost.`,
      onOk() {
        const obj = { url: state.config.baseUrl + state.config.getExam };
        const data = { userId: userData._id };
        APICallManager.postCall(obj, data, (res) => {
          const questions = [];
          if (res.success) {
            res.data.map((item, index) => {
              const { option1, option2, option3, option4, question } = item;
              questions.push({
                no: index + 1,
                question: question,
                options: [option1, option2, option3, option4],
                isDisabled: false,
              });
            });
            dispatch({ type: 'Exam', payload: [...questions] });
            dispatch({ type: 'ExamStartTime', payload: res.timeStamp });
            history.push(`/exam/${userData?._id}`);
          }
        });
      },
      onCancel() {},
    });
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
            <li className="mt-3 text-capitalize" style={{ fontSize: 18 }}>
              Welcome to {testInfo[0]?.TestName} Exam Portal.
            </li>
            <li className="mt-3" style={{ fontSize: 18 }}>You have total {testInfo[0]?.TestTime} minutes</li>
            <li className="mt-3" style={{ fontSize: 18 }}>Total time in Exam is {testInfo[0]?.TestTime} Minutes</li>
            <li className="mt-3" style={{ fontSize: 18 }}>If you reload your exam will end without submission you will moved
            back to profile page.</li>
            <li className="mt-3" style={{ fontSize: 18 }}>Negative Marking Exam : <b style={{ fontSize: 20 }}>No</b></li>
          </ul>
        </Box>
        <Box className="instruction-main__footer mt-5 ms-3 pb-4">
          <i className="mb-5" style={{ fontSize: 38 }}>Best of luck for your exam {userData?.name}.</i>
        </Box>
        <Box className="d-flex justify-content-center">
          <Button className="btn btns w-25 mt-4" onClick={showConfirm}>
            <span style={{ fontSize: 18 }}>Start Exam</span>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default withProfile(Instruction);