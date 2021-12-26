/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useRef, useContext } from 'react';
import { Box, Button } from '@mui/material';
import { useStyles } from '../../style_jsx/styles';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { NumberOutlined } from '@ant-design/icons';
import HomeIcon from '@mui/icons-material/Home';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
// import { pink } from '@mui/material/colors';
import DropDownComponent from '../../common/drop_down/drop_down';
// import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import TextFieldsComponent from '../../common/text_field/text_field';
import Password_fields from '../../common/password_field/password_field';
import Phone_number from '../../common/phone_number/phone_number';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import useGetRoute from '../../common/use_Get_Route';
import { context } from '../../store/store';
import APICallManager from '../../services/api_manager';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import { message, notification } from 'antd';
import { getNotificationStyle } from '../../common/getNotificarionStyle.ts';

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

const FormLoginRegister = (props) => {
  const classes = useStyles(),
        { state, dispatch } = useContext(context),
        { from, apiCall } = props,
        { getRoute } = useGetRoute(),
        { register, formState: { errors }, handleSubmit } = useForm({ reValidateMode: 'onBlur' }),
        inputRef = useRef(),
        history = useHistory(),
        [phoneError, setPhoneError] = useState(false),
        [fields, setFields] = useState({
          admin_username: '',
          admin_password: '',
          username: '',
          name: '',
          email: '',
          age: null,
          father_name: '',
          address: '',
          course: '',
          // zip_code: '',
          phone: '',
          password: '',
          confirmPassword: '',
          security_question: '',
          security_answer: '',
          admin: false,

        }),
        hasValidEmail = (value) => /\S+@\S+\.\S+/i.test(value),
        { username, email, phone, password, confirmPassword, /*  admin_password, admin_username, */
          father_name, address, security_question, security_answer, age, /* admin, */ course, name } = fields,
        setStateData = useCallback(async (stateName, value) => {
          let stateValue = value;
          if (stateName === 'age') {
            stateValue = stateValue.replace(/[^\d]/g, '');
          }
          setFields((prevState) => ({
            ...prevState,
            [stateName]: stateValue }));
        }, []),
        data = [
          {
            label: 'Select Security Question',
            value: '',
          },
          {
            label: 'Enter Your Birth Place',
            value: 'Enter Your Birth Place',
          },
          {
            label: 'Enter Your Pet Name',
            value: 'Enter Your Pet Name',
          },
          {
            label: 'Enter Your Favorite Color',
            value: 'Enter Your Favorite Color',
          },
        ],
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
        // handleChange = (e) => {
        //   setStateData(e.target.name, !admin);
        // },
        phone_Number_Check = () => {
          if (phone) {
            if (phone.replace(/\D+/g, '').length < 10) {
              setPhoneError(true);
              return false;
            }
          }
          if (!phone) {
            setPhoneError(true);
            return false;
          }

          setPhoneError(false);
          return true;
        },
        onSubmit = () => {
          if (from === 'login') {
            apiCall({ ...fields });
          }
          else {
            if (phone_Number_Check()) {
              if (checkConfirmPassword(password, confirmPassword))
                apiCall({ ...fields });
            }
            else {
              inputRef.current.handleInputFocus();
              return;
            }

          }
        };

  const onForgetPassword = () => {
    if (username) {
      const obj = { url: state.config.baseUrl + state.config.securityQuestion };
      const data = { username };
      APICallManager.postCall(obj, data, async (res) => {
        if (res.success) {
          message.success('Otp has been sent to your registered email id.');
          dispatch({ type: 'userData', payload: { ...res.data } });
          history.push({ pathname: '/forgetpassword', from: 'Login' });
        }
      });
    }
    else {
      message.error('Please enter username');
    }
  };

  return (
    <>
      <Box className="login-main__div">
        <p component="legend"
          className={`${classes.label_form} labels mt-2 heading content_26 ${from === 'register' && 'ms-5'}`}>
          {from === 'login' && 'Welcome Back' || 'Register a student'}
        </p>
      </Box>
      <>
        <form className="login-main__form_div login-main__form_div--register" onSubmit={handleSubmit(() => onSubmit())}>
          {/* {from === 'register' &&
            <Box className="mt-4 me-5">
              <TextFieldsComponent {...{ classes, label: 'Admin Username', icon: <SupervisorAccountIcon />, required: true,
                value: admin_username, setValue: setStateData, name: 'admin_username', register, errors }} />
            </Box>}
          {from === 'register' &&
            <Box className="me-5">
              <Password_fields {...{ classes, label: 'Admin Password', value: admin_password, name: 'admin_password',
                setValue: setStateData, register, errors }} />
            </Box>} */}
          <p>{from === 'login' && 'Login and start giving test'}</p>
          <Box className="me-5">
            <TextFieldsComponent {...{ classes, label: 'Username', icon: <PersonIcon />, required: true,
              value: username, setValue: setStateData, name: 'username', register, errors }} />
          </Box>
          {from === 'register' && <Box className="mt-4 me-5">
            <TextFieldsComponent {...{ classes, label: 'Name', icon: <AlternateEmailIcon />, required: true,
              value: name, setValue: setStateData, name: 'name', register, errors }} />
          </Box>}
          {from === 'register' && <Box className="mt-4 me-5">
            <TextFieldsComponent {...{ classes, label: 'Father Name', icon: <PersonIcon />, required: true,
              value: father_name, setValue: setStateData, name: 'father_name', register, errors }} />
          </Box>}
          {from === 'register' && <Box className="me-5 mt-4">
            <TextFieldsComponent {...{ classes, label: 'Address', icon: <HomeIcon />, required: true,
              value: address, setValue: setStateData, name: 'address', register, errors, maxLength: 'unset' }} />
          </Box>}
          {from === 'register' && <Box className="me-5 mt-4">
            <TextFieldsComponent {...{ classes, label: 'Email', icon: <EmailIcon />, required: true,
              value: email, setValue: setStateData, name: 'email', register, errors,
              validate: hasValidEmail, type: 'validate', maxLength: '' }} />
          </Box>}
          {from === 'register' && <Box className="me-5 mt-4">
            <TextFieldsComponent {...{ classes, label: 'Course', icon: <LibraryBooksIcon />, required: true,
              value: course, setValue: setStateData, name: 'course', register, errors }} />
          </Box>}
          {from === 'register' && <Box className="me-5 mt-4">
            <TextFieldsComponent {...{ classes, label: 'Age', icon: <NumberOutlined />, required: true,
              value: age === 0 && '' || age, setValue: setStateData, name: 'age', register, errors,
              maxLength: 3 }} />
          </Box>}
          {from === 'register' && <Box className="me-5">
            <Phone_number {...{ classes, label: 'Phone Number', value: phone, name: 'phone',
              setValue: setStateData, inputRef, phone_Number_Check, phoneError, required: true }} />
          </Box>}
          <Box className="me-5">
            <Password_fields {...{ classes, label: 'Password', value: password, name: 'password',
              setValue: setStateData, register, errors, validate: from === 'register' && validate,
              errorCheckPassword }} />
          </Box>
          {from === 'register' && <Box className="me-5 ">
            <Password_fields {...{ classes, label: 'Confirm Password',
              value: confirmPassword, name: 'confirmPassword', setValue: setStateData,
              register, errors, validate, errorCheckPassword }} />
          </Box>}
          {from === 'register' && <Box className="mt-4 me-5">
            <DropDownComponent {...{ classes, value: security_question, data,
              name: 'security_question', setValue: setStateData, required: true,
              label: data[0].label }} />
          </Box>}
          {from === 'register' && <Box className="mt-4 me-5">
            <TextFieldsComponent {...{ classes, label: 'Security Answer', icon: <QuestionAnswerIcon />, required: true,
              value: security_answer, setValue: setStateData, name: 'security_answer', register, errors }} />
          </Box>}
          <Box className="mt-3 login-main__button_div">
            <Box className={`login-main__button ${from === 'login' && 'justify-content-between'
        || 'justify-content-end'}`}>
              <Box className="d-flex mt-2">
                {from === 'login' && <Button className="heading" onClick={onForgetPassword}>
                Forget Password?</Button> || <Box />
                // <FormGroup>
                //   <FormControlLabel control={<Checkbox checked={admin} onChange={handleChange} name="admin"
                //     value={admin} />}
                //   label={<Box style={{ color: 'black' }}>Admin</Box>}
                //   sx={{
                //     color: pink[800],
                //     '&.Mui-checked': {
                //       color: pink[600],
                //     },
                //   }} />
                // </FormGroup>
                }
              </Box>
              <Button type="submit" class="btn btns" variant="outlined" title={from === 'register' && 'Register' || 'Login'}
                onClick={() => { from === 'register' && phone_Number_Check() }}>
                {from === 'register' && 'Register' || 'Login'}
              </Button>
            </Box>
            <Box className="d-flex justify-content-between mt-2">
              <p className="mt-1">{from === 'login' && 'Not' || 'Already'} on Exam Portal?</p>
              <Link className="heading" to={{ pathname: getRoute(from === 'login' && 'register' || 'login'),
                from: from === 'login' && 'login' || 'register' }}>
                {from === 'login' && 'Register' || 'Login'} Now</Link>
            </Box>
          </Box>
        </form>
      </>
    </>
  );
};

export default FormLoginRegister;
