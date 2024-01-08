import React, { useEffect } from 'react'
import { Header, Tab } from '../../components/index';
import { companySettingsAction } from '../../redux-slice/AdminSliceReducer';
import { useGetCompanyDetailsQuery } from '../../apis';
import { useDispatch } from 'react-redux';

function Layout({children}) {
  const dispatch=useDispatch();
  const companyApiRes =useGetCompanyDetailsQuery();
  useEffect(()=>{
    if(companyApiRes.data){
     dispatch(
       companySettingsAction({
         pricingStatus: companyApiRes.data.pricingStatus,
         budgetStatus: companyApiRes.data.budgetStatus,
         companyId: companyApiRes.data._id,
       })
     );
    }
  },[companyApiRes.isLoading]);
  return (
    <div>
      <Header/>
      <Tab element={children} />
    </div>
  )
}

export default Layout