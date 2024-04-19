import { actionTypes } from "../Action/Action";

export const initialState = {
  isLoading: false,
  formData: {
    name: "",
    email: "",
    phone: "",
    password: "",
    cpass: "",
    language: "",
    gender: "",
    dob: "",
  },
  errors: {},
  isEditing: false,
  showPassword: false,
  cshowPassword: false,
  employees: [],
  searchText: "",
   selectedProducts: [],
};



export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_FIELD:
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };
    case actionTypes.SET_ERRORS:
      return { ...state, errors: action.errors };
    case actionTypes.SET_IS_EDITING:
      return { ...state, isEditing: action.value };
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.value };
    default:
      return state;
  }
}




