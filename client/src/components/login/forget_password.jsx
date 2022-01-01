/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useContext } from 'react';
import { Box, Button } from '@mui/material';
import { useStyles } from '../../style_jsx/styles';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { NumberOutlined } from '@ant-design/icons';
import TextFieldsComponent from '../../common/text_field/text_field';
import Password_fields from '../../common/password_field/password_field';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { message, notification } from 'antd';
import withWelcome from '../../common/welcome_hoc/with_welcome';
import { getNotificationStyle } from '../../common/getNotificarionStyle.ts';
import { context } from '../../store/store';
import APICallManager from '../../services/api_manager';

const checkConfirmPassword = (password, confirmPasssword) => {
  if (password !== confirmPasssword) {
    notification['error']({
      message: 'An Error occurred',
      description: 'Password and Confirm Password shoulde be same.',
      style: getNotificationStyle('error'),
      duration: 10,
    });
  }
  else {
    return true;
  }
};

const Forget_password = (props) => {
  const classes = useStyles(),
        { state } = useContext(context),
        { Header, Logo, PageContent } = props,
        { from } = props,
        { register, formState: { errors }, handleSubmit } = useForm({ reValidateMode: 'onBlur' }),
        [fields, setFields] = useState({
          password: '',
          confirmPassword: '',
          security_answer: '',
          otp: '',
        }),
        history = useHistory(),
        { password, confirmPassword, /*  security_question, */ security_answer, otp } = fields,
        setStateData = useCallback(async (stateName, value) => {
          let default_Value = value;
          if (stateName === 'otp') {
            default_Value = value.replace(/\D+/g, '');
          }
          setFields((prevState) => ({
            ...prevState,
            [stateName]: default_Value }));
        }, []),
        [isEmailVerify, setIsEmailVerify] = useState(false),
        errorCheckPassword = (passwordType) => {
          const errorData = (passwordType === 'minLength' || passwordType === 'required') ?
            'minimum 8 characters required'
            : passwordType === 'hasCharNumSpecialChar' ?
              `password should contains uppercase, lowercase, numbers or special characters.`
              : passwordType === 'hasNotSpace' ?
                `The password cannot contain space`
                : passwordType === 'hasNotDollar' &&
                `The password cannot contain a $ sign.`;
          return errorData;
        },
        validate = {
          hasNotSpace: (value) => value && /^\S+$/i.test(value),
          hasNotDollar: (value) => value && /^[^$]+$/i.test(value),
          hasCharNumSpecialChar: (value) => value && /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value),
        },
        onVerifyOtp = () => {
          const obj = { url: state.config.baseUrl + state.config.verifyEmail + '/' + otp };
          APICallManager.getCall(obj, null, async (res) => {
            if (res.success) {
              message.success('Email verified successfully');
              setIsEmailVerify(true);
            }
          });
        },
        onSubmit = () => {
          if (checkConfirmPassword(password, confirmPassword)) {
            const obj = { url: state.config.baseUrl + state.config.forgetPassword };
            const data = { ...fields, username: state.userData.username };
            APICallManager.putCall(obj, data, async (res) => {
              if (res.success) {
                history.push(`/login`);
              }
            });
          }
        };

  return (
    <>
      {Header}
      <Box className={`d-flex login-main login-main--${from}`}>
        <Box className="login-main__logo">
          <Box className="login-main__logo_div">
            {Logo}
          </Box>
          <Box className="mt-3 login-main__form">
            <Box className="login-main__div">
              <p component="legend"
                className={`${classes.label_form} labels mt-2 heading content_26`}>
                {(isEmailVerify && 'Answer security question to Change Your Password.') ||
          'Enter an otp sent to your email.'}
              </p>
            </Box>
            {!isEmailVerify && <form className="login-main__form_div" onSubmit={handleSubmit(() => onVerifyOtp())}>
              <TextFieldsComponent {...{ classes, label: 'Otp', icon: <NumberOutlined />, required: true,
                value: otp, setValue: setStateData, name: 'otp', register, errors, maxLength: '6' }} />
              <Button type="submit" class="btn btns mt-3" variant="outlined" title="Forget Password">
                Verify Email
              </Button>
            </form>}
            {isEmailVerify && <form className="login-main__form_div" onSubmit={handleSubmit(() => onSubmit())}>
              <Box className="me-5 d-flex flex-column justify-content-start">
                <Box className="d-flex flex-wrap">
                  <span style={{ color: 'red' }}>Security Question:</span>
                  <p className="text-capitalize ms-2">{state?.userData?.security_question}</p>
                </Box>
                <TextFieldsComponent {...{ classes, label: 'Security Answer', icon: <QuestionAnswerIcon />, required: true,
                  value: security_answer, setValue: setStateData, name: 'security_answer', register, errors }} />
              </Box>
              <Box className="me-5"><Password_fields {...{ classes, label: 'Password', value: password, name: 'password',
                setValue: setStateData, register, errors, validate,
                errorCheckPassword }} /></Box>
              <Box className="me-5"><Password_fields {...{ classes, label: 'Confirm Password',
                value: confirmPassword, name: 'confirmPassword', setValue: setStateData,
                register, errors, validate, errorCheckPassword }} /></Box>
              <Box className="mt-3 login-main__button_div">
                <Box className="login-main__button justify-content-between">
                  <Box className="d-flex mt-2">
                    <Link className="heading" to={{ pathname: '/register', from: 'register' }}>Register with new?</Link>
                  </Box>
                  <Button type="submit" class="btn btns" variant="outlined" title="Forget Password">
                Change Password
                  </Button>
                </Box>
                <Box className="d-flex justify-content-between mt-2">
                  <p className="mt-1">Already on Exam Portal?</p>
                  <Link className="heading" to={{ pathname: '/login', from: 'login' }}> Login Now</Link>
                </Box>
              </Box>
            </form>}
          </Box>
        </Box>
      </Box>
      <Box>
        {PageContent}
      </Box>
    </>
  );
};

export default withWelcome(Forget_password, 'Forget_password');
