import React, { useEffect } from 'react'
import AdminTab from '../../components/AdminTab'
import { Header } from '../../components/index';
import { companySettingsAction } from '../../redux-slice/AdminSliceReducer';
import { useGetCompanyDetailsQuery } from '../../apis';
import { useDispatch } from 'react-redux';

function AdminLayout({children}) {

  return (
    <div>
        <Header/>
        <AdminTab elements={children}  />
    </div>
  )
}

export default AdminLayout
