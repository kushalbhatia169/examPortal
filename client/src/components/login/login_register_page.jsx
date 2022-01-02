import React, { useContext /*, useState */ } from 'react';
import { Box } from '@mui/material';
import { useHistory } from 'react-router';
import FormLoginRegister from './form_login_register';
import { context } from '../../store/store';
import APICallManager from '../../services/api_manager';
/* import { notification } from 'antd';
import { getNotificationStyle } from '../../common/getNotificarionStyle.ts'; */
import './login.scss';
import { setCookie } from '../../common/globalCookies';

const LoginRegisterPage = (props) => {
  const { state, dispatch } = useContext(context);
  const { Header, Logo, PageContent, from } = props,
        history = useHistory();

  const apiCallLogin = props = e => {
    const { username, password } = e;
    const obj = { url: state.config.baseUrl + state.config.loginUser };
    const data = { username, password };
    APICallManager.getCall(obj, data, async (res) => {
      if (res.success) {
        res?.data?.jwt && setCookie('token', res?.data?.jwt, 1);
        dispatch({ type: 'userData', payload: { ...res.data, isLoggedIn: true } });
        localStorage.setItem('userData', JSON.stringify(res.data));
        history.push(`/profile/${res.data.username}`);
      }
    });
  };

  const apiCallRegister = props = e => {
    const { username, password, phone, email, admin_password, admin_username, name,
      father_name, address, security_question, security_answer, age, admin, course } = e;
    // dispatch({ type: 'userData', payload: { ...e } });
    onSignInSubmit({ phoneNumber: phone.replace(/\D+/g, ''), email, password, username, name,
      father_name, address, security_question, security_answer, age, admin, course },
    admin_password, admin_username);
  };

  const onSignInSubmit = async (props, admin_password, admin_username) => {
    const obj = { url: state.config.baseUrl + state.config.createUser };
    const data = { data: { ...props }, admin_password, admin_username };
    APICallManager.postCall(obj, data, async () => {
      history.push(`/login`);
    });
  };

  return (
    <>
      {Header}
      <Box className={`d-flex login-main login-main--${from}`}>
        <Box className="login-main__logo">
          {from === 'login' && <Box className="login-main__logo_div">
            {Logo}
          </Box>}
          <Box className={`mt-3 login-main__form ${from === 'register' && 'login-main__form--register w-100'}`}>
            <FormLoginRegister {...{ from, apiCall: from === 'login' ? apiCallLogin : apiCallRegister }} />
          </Box>
        </Box>
      </Box>
      <Box>
        {PageContent}
      </Box>
    </>
  );
};

export default LoginRegisterPage;