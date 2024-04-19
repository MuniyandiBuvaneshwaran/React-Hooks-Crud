
import * as types from '../../../../Hooks/types/Type';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    isLoading: false,
    employees: [],
    selectedEmployee:"",
    selectedProducts: [],
    employeeId: null
};



const reducer = (state = initialState, action) => {
    console.log(state)
    console.log(action)
    switch (action.type) {

        case types.CREATE_SUCCESS:
            console.log(action)
            return {
                ...state,
                employees: [...state.employees, {...action.payload,id:uuidv4()}], loading: false,
                error: null,
                
            };

            case types.GET_SUCCESS:
      return { ...state, employees: action.payload, };

      case types.GETID_SUCCESS:
        const selectedEmployee = state.employees.find(
          (employee) => employee.id === action.payload
        );
  
        return {
          ...state,
          // employeeId: action.payload,
          selectedEmployee, // Store the selected employee in the state
          loading: false,
          error: null,
        };



        case types.UPDATE_SUCCESS:
            const updatedEmployees = state.employees.map((employee) =>
                employee.id === action.payload.id ? action.payload : employee
            );
            return { ...state, employees: updatedEmployees, selectedEmployee:null   };

            

            case types.DELETE_SUCCESS:
                const filteredEmployees = state.employees.filter(
                  (employee) => employee.id !== action.payload
                );
                return { ...state, employees: filteredEmployees };
          
          

        default:
            return state;
    }
};

export default reducer;
