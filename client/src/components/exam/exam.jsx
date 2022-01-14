import React, { useContext, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useHistory, Redirect } from 'react-router-dom';
// import DownloadIcon from '@mui/icons-material/Download';
import download from '../../images/download.png';
import { context } from '../../store/store';
import '../profile/profile.scss';
import 'antd/dist/antd.css';
import withProfile from '../../common/profile_hoc/with_profie_hoc';
import { Modal, Radio, Space } from 'antd';
import Timer from './timer';
import './exam.scss';
import APICallManager from '../../services/api_manager';

const { confirm } = Modal;

const Exam = (props) => {
  const { state } = useContext(context),
        { userData, userData: { testInfo } } = state || {};
  if (state.Exam.length === 0) {
    return <Redirect to={`/profile/${userData._id}`} />;
  }
  const { children } = props,
        [selectedQues, setSelectedQues] = useState(1),
        [selectedRadioAns, setSelectedRadioAns] = useState(''),
        [selectedAns, setSelectedAns] = useState([]),
        history = useHistory(),
        [questions, setQuestions] = useState(...state.Exam),
        { no, question, options, isDisabled } = questions && questions[selectedQues - 1 || 0] || {},
        onChange = e => {
          const isAnswerd = selectedAns.find(e => e.quesNo === no);
          setSelectedRadioAns(e.target.value);
          if (isAnswerd && e.target.value) {
            selectedAns && selectedAns.map(data => {
              if (data?.quesNo === no) {
                data.answer = e?.target?.value;
              }
            });
            setSelectedAns([...selectedAns]);
          }
          else {
            setSelectedAns(
              [...selectedAns,
                {
                  quesNo: no,
                  answer: e.target.value,
                },
              ]);
          }
        };

  const clearResponse = () => {
    if (isDisabled && selectedRadioAns) {
      return;
    }
    else {
      const index = selectedAns.findIndex(e => e.quesNo === no);
      selectedAns.splice(index, 1);
      setSelectedRadioAns('');
    }
  };
  const reviewAndNext = () => {
    if (selectedQues === questions.length) {
      confirm({
        title: 'Do you want to submit the exam?',
        content: '',
        onOk() {
          history.push(`submit/${userData._id}`);
        },
        onCancel() {},
      });
    }
    else {
      const question = questions.find(e => e.no === selectedQues);
      if (question) {
        questions && questions.map((e) => {
          if (e.no === question.no) {
            e.isVisited = true;
          }
        });
        setQuestions([...questions]);
      }
      setSelectedQues(selectedQues + 1);
      const isAnswerd = selectedAns.find(e => e.quesNo === selectedQues + 1);
      setSelectedRadioAns(isAnswerd?.answer);
    }
  };
  const saveAndNext = () => {
    const question = questions.find(e => e.no === selectedQues);
    if (question) {
      questions && questions.map((e) => {
        if (e.no === question.no) {
          e.isDisabled = true;
          e.isVisited = true;
        }
      });
      setQuestions([...questions]);
    }
    setSelectedQues(selectedQues + 1);
    const isAnswerd = selectedAns.find(e => e.quesNo === selectedQues + 1);
    setSelectedRadioAns(isAnswerd?.answer);
  };
  const submitAnswer = async (timeUp) => {
    const endTime = new Date().getTime();
    !timeUp && confirm({
      title: 'Do you want to submit the exam?',
      content: 'You can not change your answer after submitting',
      onOk() {
        apiCall(endTime);
      },
      onCancel() {},
    });
    if (timeUp) {
      await apiCall(endTime);
    }
  };

  const apiCall = async (endTime) => {
    const obj = { url: state.config.baseUrl + state.config.submitExam };
    const data = { answers: selectedAns, examTime: state.ExamStartTime, examEndTime: endTime,
      userId: userData._id, testTime: testInfo[0]?.TestTime };
    APICallManager.postCall(obj, data, async (res) => {
      if (res.success) {
        history.push(`/result/${userData._id}`);
      }
    });
  };
  const openQuestion = (selected) => {
    setSelectedQues(selected.no);
    const isAnswerd = selectedAns.find(e => e.quesNo === selected.no);
    setSelectedRadioAns(isAnswerd?.answer);
  };

  return (
    <Box className="profile-main exam-main">
      {window.scroll(0, 0)}
      {children}
      <Box className="exam-main__body d-flex flex-wrap justify-content-between  ms-3 align-items-center">
        <Box>
          <span> Question Type | Single | </span>
          <span> Marks | 1 </span>
          {/* <span> Negative Marking | No</span> */}
        </Box>
        <Box>
          <span> Time | {testInfo[0]?.TestTime} min</span>
        </Box>
        <Box className="exam-main__img me-2">
          <img src={download} alt="user" />
          <p className="d-flex flex-column mt-1">
            <span>Time Left</span>
            <Timer initialMinute={testInfo[0]?.TestTime} submitAnswer={submitAnswer} />
            <span className="text-capitalize mt-1">{state?.userData?.username || 'Unamed'}</span>
          </p>
        </Box>
      </Box>
      <Box className="d-flex flex-wrap">
        <Box className="exam-main__ques d-flex flex-column mb-3 w-75">
          <h4 className="p-3 pb-2">Question No. {no}</h4>
          <Box className="ms-3 exam-main__sec" style={{ borderTop: '2px solid lightgray' }}>
            <Box className="mt-3"><b>{question}</b></Box>
            <Box className="mt-3">
              <Radio.Group onChange={onChange} value={selectedRadioAns} disabled={isDisabled}>
                <Space direction="vertical">
                  {options && options.map((option, index) => {
                    return <Radio key={index} value={option}>{option}</Radio>;
                  })}
                </Space>
              </Radio.Group>
            </Box>
          </Box>
        </Box>
        <Box className="d-flex flex-column w-25" style={{ borderLeft: '1px solid lightgray' }}>
          <Box className="exam-main__btn d-flex flex-wrap ms-2">
            {questions && questions.map((item, key) => {
              const answered = selectedAns.find(e => e.quesNo === item.no);
              return <Button className={`m-2 ${(!answered && item.isVisited && 'exam-main__notAnswered') ||
              (answered && item.isDisabled && 'exam-main__answered') || (
                answered && !item.isDisabled && 'exam-main__reviewAnswered') ||
                item.no === selectedQues && 'exam-main__selected'}`}
              key={key} onClick={() => openQuestion(item)}>
                {item.no}
              </Button>;
            })}
          </Box>
          <Box className="exam-main__btn_show d-flex flex-wrap">
            <Button className="exam-main__answered m-2" /><span className="m-2 mt-3">Answered</span>
            <Button className="exam-main__notAnswered m-2" /><span className="m-2 mt-3">Not Answered</span>
            <Button className="exam-main__reviewAnswered m-2" /><span className="m-2 mt-3">Marked</span>
            <Button className="m-2" /><span className="m-2 mt-3">Not Vistited</span>
          </Box>
        </Box>
      </Box>
      <Box className="mt-4 mb-4 me-3 d-flex justify-content-between" style={{ borderTop: '1px solid lightgray' }}>
        <Box>
          <Button className="btn btns mt-4 ms-4" onClick={reviewAndNext}>Mark As Review & Next</Button>
          <Button className="btn btns mt-4 ms-3" onClick={clearResponse}>Clear Response</Button>
        </Box>
        <Button className="btn btns mt-4 me-3" onClick={(no === questions.length && submitAnswer) || saveAndNext}>
          {no === questions.length && 'Submit' || 'Save & Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default withProfile(Exam);