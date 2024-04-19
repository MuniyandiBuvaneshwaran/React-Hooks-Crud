import { combineReducers } from "redux";
// import reducer from "./ReduxReducer"
import sagareducers from "../../reduxsaga/Reducer/SagaReducer";


const parentReducer = combineReducers ({
    // reducer:reducer,
    sagareducers:sagareducers,
})

export default parentReducer;