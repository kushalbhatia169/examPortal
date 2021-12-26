import React, { useContext } from 'react';
import { Box, Button, Table, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import { /* Link, */ useHistory } from 'react-router-dom';
import { Menu, Dropdown, message, Space } from 'antd';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import DownloadIcon from '@mui/icons-material/Download';
import { context } from '../../store/store';
import download from '../../images/download.png';
import './profile.scss';
import 'antd/dist/antd.css';

const Profile = () => {
  const { state, dispatch } = useContext(context),
        { userData } = state;
  const history = useHistory();
  const handleMenuClick = () => {
          message.info('User successfully logged out.');
          dispatch({ type: 'LOGOUT' });
          history.push('/home');
        },
        menu = (
          <Menu onClick={handleMenuClick}>
            <Menu.Item key="1" className="icon" icon={<LogoutOutlined />}>
        Logout
            </Menu.Item>
          </Menu>
        );

  return (
    <Box className="profile-main">
      <Box className="profile-main__head">
        <h1>Online Exam Portal</h1>
        <Space wrap className="mb-3 me-2">
          <Dropdown overlay={menu}>
            <Button>
                Menu <DownOutlined className="ms-2 mt-1" />
            </Button>
          </Dropdown>
        </Space>
      </Box>
      <Box className="profile-main__body mt-5">
        <Box className="profile-main__img">
          <img src={download} alt="user" style={{ border: '1px solid black' }} />
          <h3 className="text-capitalize mt-1">{state?.userData?.username || 'Unamed'}</h3>
        </Box>
        <Box className="profile-main__content w-100">
          <TableContainer component={Box}>
            <Table key="ContactsTable" className="table w-100 mt-3 table-responsive-sm">
              <colgroup>
                <col span="1" style={{ 'width': '50%' }} />
                <col span="1" style={{ 'width': '50%' }} />
              </colgroup>
              <TableBody key="ContactsBody">
                <TableRow>
                  <TableCell component="th" scope="row" className="profile-main__labelHeading">Name</TableCell>
                  <TableCell className="span_div_text_color">
                    {userData?.name || ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" className="profile-main__labelHeading">Father Name</TableCell>
                  <TableCell className="span_div_text_color">
                    {userData?.father_name || ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" className="profile-main__labelHeading">Address</TableCell>
                  <TableCell className="span_div_text_color">
                    <Box component="span" className="text-break" style={{ fontWeight: 'unset' }}>
                      {userData?.address}</Box></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" className="profile-main__labelHeading">Age</TableCell>
                  <TableCell className="span_div_text_color">
                    <Box component="span" className="text-break" style={{ fontWeight: 'unset' }}>
                      {userData?.age}</Box></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" className="profile-main__labelHeading">E-Mail</TableCell>
                  <TableCell className="span_div_text_color">{userData?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" className="profile-main__labelHeading">Phone Number</TableCell>
                  <TableCell className="span_div_text_color">{userData?.phoneNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" className="profile-main__labelHeading">Course</TableCell>
                  <TableCell className="span_div_text_color">{userData?.course}</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell component="th" scope="row" className="profile-main__labelHeading">
                      Click to download your pervious results
                  </TableCell>
                  <TableCell className="span_div_text_color">
                    <Button className="btn btns ms-3">
                      <span style={{ color: 'red' }}>
                        Download <DownloadIcon className="ms-1 mb-1" />
                      </span>
                    </Button>
                  </TableCell>
                </TableRow> */}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Box className="profile-main__footer">
        <Box className="profile-main__footer-content">
          <h5>Do you want to take test?</h5>
          <button className="btn btns ms-3 p-2">
            <span style={{ color: 'red', padding: 10 }}>
                Proceed to text <ArrowForwardIcon className="ms-1 mb-1" />
            </span>
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;