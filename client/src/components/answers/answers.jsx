import React, { useContext } from 'react';
import { Box, Table, TableBody, TableRow, TableCell, TableContainer, TableHead } from '@mui/material';
import { Link } from 'react-router-dom';
// import DownloadIcon from '@mui/icons-material/Download';
import { context } from '../../store/store';
import '../profile/profile.scss';
import 'antd/dist/antd.css';
import '../instruction/instruction.scss';
import withProfile from '../../common/profile_hoc/with_profie_hoc';

const Answer = (props) => {
  const { state } = useContext(context),
        { userData, studentAnswers, studentName } = state || {};

  const { children } = props;
  console.log(state);
  return (
    <Box className="profile-main instruction-main">
      {children}
      <Box className="instruction-main__body d-flex flex-column flex-wrap">
        <Box className="instruction-main__header mt-5 d-flex justify-content-center">
          <h1 className="mt-3" style={{ fontSize: 44 }}>{studentName}</h1>
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
                            Question Number
                </TableCell>
                <TableCell key="ContactsCell" component="th" scope="row" className="profile-main__labelHeading">
                            Answer
                </TableCell>
              </TableHead>
              <TableBody key="ContactsBody">
                {studentAnswers[0].map((item) => (
                  <><TableRow>
                    <TableCell component="th" scope="row" className="profile-main__labelHeading">{item.quesNo}</TableCell>
                    <TableCell className="span_div_text_color">
                      {item.answer}
                    </TableCell>
                  </TableRow></>))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box className="instruction-main__footer mt-5 ms-3 pb-4 d-flex justify-content-center">
          <Link to={`/admin/${userData._id}`}>Move Back to Admin Page</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default withProfile(Answer);