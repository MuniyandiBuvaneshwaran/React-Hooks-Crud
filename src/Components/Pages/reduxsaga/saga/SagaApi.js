import { put, takeLatest, call } from "redux-saga/effects";
import {
  createEmployee,
  fetchEmployeeData,
  fetchEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../../../../Services/Api';

import * as types from "../Sagatypes/Types";
import {
  addUserSuccess,
  addUserError,
  getUserSuccess,
  getUserError,
  getidUserSuccess,
  getidUserError,
  updateUserSuccess,
  updateUserError,
  deleteUserSuccess,
  deleteUserError,
  getUserRequest,
} from "../Actions/Actions";

export function* postData({ payload }) {
  try {
    const response = yield call(createEmployee, payload);
    if (response.status === 200 || response.status === 201) {
      yield put(addUserSuccess(payload));
    }
  } catch (error) {
    yield put(addUserError(error));
  }
}

export function* getData() {
  try {
    const getDatas = yield call(fetchEmployeeData);
    if (getDatas.status === 200 || getDatas.status === 201) {
      yield put(getUserSuccess(getDatas.data));
    }
  } catch (error) {
    yield put(getUserError(error));
  }
}

export function* getidData(action) {
  try {
    const id = action.payload;
    const getidDatas = yield call(fetchEmployeeById, id);
    if (getidDatas.status === 200 || getidDatas.status === 201) {
      yield put(getidUserSuccess(getidDatas.data));
    }
  } catch (error) {
    yield put(getidUserError(error));
  }
}

export function* updateData(action) {
  try {
    const updateData = action.payload;
    const id = updateData.id;
    const updateDatas = yield call(updateEmployee, id, updateData);
    if (updateDatas.status === 200 || updateDatas.status === 201) {
      yield put(updateUserSuccess(id,updateDatas));
    }
  } catch (error) {
    yield put(updateUserError(error));
  }
}

export function* deleteData(action) {
  try {
    const id = action.payload;
    const response = yield call(deleteEmployee, id);
    if (response.status === 200 || response.status === 201) {
      yield put(deleteUserSuccess(response));
      yield put(getUserRequest(response));
    }
  } catch (error) {
    yield put(deleteUserError(error));
  }
}

function* watchFetchData() {
  yield takeLatest(types.CREATEUSER_REQUEST, postData);
  yield takeLatest(types.GETUSER_REQUEST, getData);
  yield takeLatest(types.GETIDUSER_REQUEST, getidData);
  yield takeLatest(types.UPDATEUSER_REQUEST, updateData);
  yield takeLatest(types.DELETEUSER_REQUEST, deleteData);
}

export default watchFetchData;
