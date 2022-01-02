const Reducer = (state, action) => {
  switch (action.type) {
    case 'userData':
      return {
        ...state,
        userData: action.payload,
      };

    case 'Exam':
      return {
        ...state,
        Exam: [action.payload],
      };

    case 'ExamStartTime':
      return {
        ...state,
        ExamStartTime: action.payload,
      };

    case 'studentAnswers':
      return {
        ...state,
        studentAnswers: [...action.payload],
      };

    case 'studentName':
      return {
        ...state,
        studentName: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        userData: {},
        Exam: [],
      };

    default:
      break;
  }
};

export default Reducer;
