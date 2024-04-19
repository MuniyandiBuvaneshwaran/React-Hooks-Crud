import { all } from "redux-saga/effects";
import watchFetchData from "./sagaapi";


export default function* rootSaga() {
  yield all([watchFetchData()]);
}