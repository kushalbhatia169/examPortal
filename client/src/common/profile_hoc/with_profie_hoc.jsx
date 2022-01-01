import React, { useContext } from 'react';
import { Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Menu, Dropdown, message, Space } from 'antd';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
// import DownloadIcon from '@mui/icons-material/Download';
import { context } from '../../store/store';
// import '../profile.scss';
import 'antd/dist/antd.css';

const withProfileHoc = (WrappedComponent) => {
  const profileHoc = ({ ...props }) => {
    const { dispatch } = useContext(context);
    const history = useHistory();
    const handleMenuClick = () => {
      message.info('User successfully logged out.');
      dispatch({ type: 'LOGOUT' });
      history.push('/home');
    };

    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1" className="icon" icon={<LogoutOutlined />}>
      Logout
        </Menu.Item>
      </Menu>
    );

    return (
      <WrappedComponent {...{ props }}>
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
      </WrappedComponent>
    );
  };
  return profileHoc;
};

export default withProfileHoc;
