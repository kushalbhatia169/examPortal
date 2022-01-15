import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Box, Table, TableBody, TableRow, TableCell, TableContainer, TableHead, Button } from '@mui/material';
import TextFieldsComponent from '../../common/text_field/text_field';
import { Link, useHistory } from 'react-router-dom';
import { useStyles } from '../../style_jsx/styles';
import { useForm } from 'react-hook-form';
import { Button as Ant_Button } from 'antd';
// import DownloadIcon from '@mui/icons-material/Download';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { context } from '../../store/store';
import '../profile/profile.scss';
import 'antd/dist/antd.css';
import '../instruction/instruction.scss';
import { NumberOutlined, EditOutlined } from '@ant-design/icons';
import { getCookie } from '../../common/globalCookies';
import withProfile from '../../common/profile_hoc/with_profie_hoc';
import APICallManager from '../../services/api_manager';

const Admin = (props) => {
  const { state, dispatch } = useContext(context),
        classes = useStyles(),
        { userData } = state || {},
        history = useHistory(),
        [answer, setAnswer] = useState([]),
        [_isMounted, _setIsMounted] = useState(true),
        { children } = props,
        [fields, setFields] = useState({
          testName: '',
          testTime: '',
        }),
        { register, formState: { errors }, handleSubmit } = useForm({ reValidateMode: 'onBlur' }),
        { testName, testTime } = fields,
        setStateData = useCallback(async (stateName, value) => {
          let stateValue = value;
          if (stateName === 'testTime') {
            stateValue = stateValue.replace(/[^\d]/g, '');
          }
          setFields((prevState) => ({
            ...prevState,
            [stateName]: stateValue }));
        }, []),
        fileProps = {
          name: 'mkl',
          action: state.config.baseUrl + state.config.uploadFile,
          headers: {
            authorization: 'authorization-text',
            cookies: getCookie('token'),
          },
          onChange(info) {
            if (info.file.status === 'done') {
              message.success(`${info.file.name} file uploaded successfully`);
            }
            else if (info.file.status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
          },
        };

  useEffect(() => {
    if (_isMounted) {
      dispatch({ type: 'Exam', payload: [] });
      const obj = { url: state.config.baseUrl + state.config.getAnswers };
      const data = { };
      APICallManager.getCall(obj, data, async (res) => {
        if (res.success) {
          setAnswer(res.data);
        }
      });
    }
    return () => {
      _setIsMounted(false);
    };
  }, []);
  const openAnswer = (name, fileContent) => {
    dispatch({ type: 'studentAnswers', payload: [...fileContent] });
    dispatch({ type: 'studentName', payload: name });
    history.push('/answer/' + name);
    //document.body.removeChild(element);
  };
  const onSubmit = () => {
    const obj = { url: state.config.baseUrl + state.config.setTestInfo };
    const data = { TestName: testName, TestTime: parseInt(testTime) };
    APICallManager.putCall(obj, data, async () => {});
  };

  const onDelete = (id) => {
    const obj = { url: state.config.baseUrl + '/deleteUser' };
    const data = { id };
    APICallManager.postCall(obj, data, async (res) => {
      if (res.success) {
        window.location.reload();
      }
    });
  };
  return (
    <Box className="profile-main instruction-main">
      {children}
      <Box className="instruction-main__body d-flex flex-column flex-wrap">
        <Box className="instruction-main__header mt-5 d-flex justify-content-center">
          <h1 className="mt-3" style={{ fontSize: 44 }}>Admin Panel</h1>
        </Box>
        <Box>

        </Box>
        <Box className="instruction-main__body mt-5 d-flex flex-column align-items-center">
          <Upload {...fileProps}>
            <Ant_Button icon={<UploadOutlined />}>Click to Upload Exam Paper</Ant_Button>
          </Upload>
          <form className="p-3" onSubmit={handleSubmit(() => onSubmit())}>
            <Box className="d-flex flex-wrap flex-column align-items-center">
              <TextFieldsComponent {...{ classes, label: 'Test Name', icon: <EditOutlined />, required: true,
                value: testName, setValue: setStateData, name: 'testName', register, errors }} />
              <Box className="mt-3">
                <TextFieldsComponent {...{ classes, classnames: classes.input_time, label: 'Time In Minutes', icon: <NumberOutlined />,
                  required: true, value: testTime, setValue: setStateData, name: 'testTime',
                  register, errors, maxLength: 3 }} />
                <Button type="submit" class="btn btns ms-3" variant="outlined" title="Submit">
                Submit
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
        <Box className="profile-main__content w-100">
          <TableContainer component={Box}>
            <Table key="ContactsTable" className="table w-100 mt-3 table-responsive-sm">
              <TableHead key="ContactsHead" className="w-100">
                <TableCell key="ContactsCell" component="th" scope="row" className="profile-main__labelHeading">
                            UserName
                </TableCell>
                <TableCell key="ContactsCell" component="th" scope="row" className="profile-main__labelHeading">
                            Name
                </TableCell>
                <TableCell key="ContactsCell" component="th" scope="row" className="profile-main__labelHeading">
                            Father Name
                </TableCell>
                <TableCell key="ContactsCell" component="th" scope="row" className="profile-main__labelHeading">
                            Phone Number
                </TableCell>
                <TableCell key="ContactsCell" component="th" scope="row" className="profile-main__labelHeading">
                            Answer
                </TableCell>
                <TableCell key="ContactsCell" component="th" scope="row" className="profile-main__labelHeading">
                            Action
                </TableCell>
              </TableHead>
              <TableBody key="ContactsBody">
                {answer.map((item) => (
                  <><TableRow>
                    <TableCell component="th" scope="row" className="profile-main__labelHeading">{item.username}</TableCell>
                    <TableCell component="th" scope="row" className="profile-main__labelHeading">{item.name}</TableCell>
                    <TableCell component="th" scope="row" className="profile-main__labelHeading">{item.father_name}</TableCell>
                    <TableCell component="th" scope="row" className="profile-main__labelHeading">{item.phoneNumber}</TableCell>
                    <TableCell className="span_div_text_color">
                      {/* eslint-disable-next-line jsx-a11y/anchor-has-content*/}
                      <Button className="btn btns" onClick={() => openAnswer(item.name, item.userAnswers)}>Open Answers</Button>
                    </TableCell>
                    <TableCell className="span_div_text_color">
                      {/* eslint-disable-next-line jsx-a11y/anchor-has-content*/}
                      <Button className="btn btns" onClick={() => onDelete(item.userId)}>
                        Delete User
                      </Button>
                    </TableCell>
                  </TableRow></>))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box className="instruction-main__footer mt-5 ms-3 pb-4 d-flex justify-content-center">
          <Link to={`/profile/${userData._id}`}>Move Back to Profile Page</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default withProfile(Admin);