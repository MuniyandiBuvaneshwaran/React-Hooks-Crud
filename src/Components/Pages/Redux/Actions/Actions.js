import * as types from "../../../../Hooks/types/Type"

export function addEmployeeSuccess(data){
  console.log(data)
    return {
      type:types.CREATE_SUCCESS,
      payload:data
    }
  }
  export function updateEmployeeSuccess(data){
    console.log(data)
    return {
      type:types.UPDATE_SUCCESS,
      payload:data
    }
  }

  export function getdata(data){
    return {
      type:types.GET_SUCCESS,
      payload:data
    }
  }

  export function getidEmployeeSuccess(id){
    return {
      type:types.GETID_SUCCESS,
      payload:id 
    }
  }



  export function deletedata(data){
    return {
      type:types.DELETE_SUCCESS,
      payload:data
    }
  }

  