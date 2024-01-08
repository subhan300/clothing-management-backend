import { errorPopup, showPopup } from "../redux-slice/UserSliceAuth";


const postApi=async(postApi,values,id,sucessMsg,errorMsg,dispatch)=>{
  return await  postApi({ payload: values,id:id})
    .unwrap()
    .then((res) => {
      dispatch(showPopup({ state: true, message: sucessMsg }));
      return res;
    })
    .catch((error) => {
      dispatch(
        errorPopup({
          state: true,
          message: errorMsg,
        })
      );
      return false
    });
}



export default {
    postApi
}

