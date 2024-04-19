import {legacy_createStore as  createStore, applyMiddleware, compose } from "redux"; // Import createStore and compose from Redux
import createSagaMiddleware from "redux-saga";
import rootSaga from "./Components/Pages/reduxsaga/saga/index";
import reducers from "./Components/Pages/reduxsaga/Reducer/SagaReducer";

const sagaMiddleware = createSagaMiddleware();

// Use compose to combine applyMiddleware and any other enhancers
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const Store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export default Store;
