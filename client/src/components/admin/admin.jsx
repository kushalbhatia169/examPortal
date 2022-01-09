import React, { useContext, useEffect, useState } from 'react';
import { Box, Table, TableBody, TableRow, TableCell, TableContainer, TableHead } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
// import DownloadIcon from '@mui/icons-material/Download';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { context } from '../../store/store';
import '../profile/profile.scss';
import 'antd/dist/antd.css';
import '../instruction/instruction.scss';
import { getCookie } from '../../common/globalCookies';
import withProfile from '../../common/profile_hoc/with_profie_hoc';
import APICallManager from '../../services/api_manager';

const Admin = (props) => {
  const { state, dispatch } = useContext(context),
        { userData } = state || {},
        history = useHistory(),
        [answer, setAnswer] = useState([]);
  const [_isMounted, _setIsMounted] = useState(true);
  const { children } = props;
  const fileProps = {
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
    dispatch({ type: 'studentAnswers', payload: [...JSON.parse(fileContent)] });
    dispatch({ type: 'studentName', payload: name });
    history.push('/answer/' + name);
    //document.body.removeChild(element);
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
        <Box className="instruction-main__body mt-5 d-flex justify-content-center">
          <Upload {...fileProps}>
            <Button icon={<UploadOutlined />}>Click to Upload Exam Paper</Button>
          </Upload>
        </Box>
        <Box className="profile-main__content w-100">
          <TableContainer component={Box}>
            <Table key="ContactsTable" className="table w-100 mt-3 table-responsive-sm">
              <colgroup>
                <col span="1" style={{ 'width': '50%' }} />
                <col span="1" style={{ 'width': '50%' }} />
              </colgroup>
              <TableHead key="ContactsHead" className="w-100">
                <TableCell key="ContactsCell" component="th" scope="row" className="profile-main__labelHeading">
                            Name
                </TableCell>
                <TableCell key="ContactsCell" component="th" scope="row" className="profile-main__labelHeading">
                            Phone Number
                </TableCell>
                <TableCell key="ContactsCell" component="th" scope="row" className="profile-main__labelHeading">
                            File
                </TableCell>
              </TableHead>
              <TableBody key="ContactsBody">
                {answer.map((item) => (
                  <><TableRow>
                    <TableCell component="th" scope="row" className="profile-main__labelHeading">{item.name}</TableCell>
                    <TableCell component="th" scope="row" className="profile-main__labelHeading">{item.phoneNumber}</TableCell>
                    <TableCell className="span_div_text_color">
                      {/* eslint-disable-next-line jsx-a11y/anchor-has-content*/}
                      <Button className="btn btns" onClick={() => openAnswer(item.name, item.answers)}>Open Answers</Button>
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