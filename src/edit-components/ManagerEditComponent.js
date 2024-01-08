import { Button, Form, Input, Spin, Table } from "antd";
import React, { useEffect, useState, useTransition } from "react";
import {
  useDeleteManagerMutation,
  useEditManagerMutation,
  useGetAllManagersQuery,
  useGetManagersByCompanyIdQuery,
} from "../apis";
import { adminEditGlobalFunctions } from "../global-functions/adminEditGlobalFunction";
import { useDispatch } from "react-redux";
import { errorPopup, showPopup } from "../redux-slice/UserSliceAuth";
import useGlobalApi from "../global-functions/useGlobalApi";
import { useTranslation } from "react-i18next";

export default function ManagerEditComponent({ selected }) {
  const { t } = useTranslation();
  const { data, error, isLoading, refetch } = useGetManagersByCompanyIdQuery({
    companyId: selected.record._id,
  });
  const isEditing = (record) => record._id === editingRow.record._id;
  const [form] = Form.useForm();
  const [editManager, response] = useEditManagerMutation();
  const [deleteManagerApi, deleteResponse] = useDeleteManagerMutation();
  const [managers, setManagers] = useState([]);
  const dispatch = useDispatch();
  const [editingRow, setEditingRow] = useState({
    state: false,
    record: {},
    updatedValues: {},
  });
  // const handleSave = async (id) => {
  //   let values = await form.validateFields();
  //   if (modalFileList.length) {
  //     const url = await handleCreateUrl();
  //     values = { ...values, companyLogo: url };
  //   }
  //   if (editingRow.pricingStatus != undefined) {
  //     values = { ...values, pricingStatus: editingRow.pricingStatus };
  //   }
  //   if (editingRow.budgetStatus != undefined) {
  //     values = { ...values, budgetStatus: editingRow.budgetStatus };
  //   }

  //   const companyRes = await useGlobalApi.postApi(
  //     editCompany,
  //     values,
  //     editingRow.record._id,
  //     t("company data updated"),
  //     t("company data not updated due to some error"),
  //     dispatch
  //   );
 
  //   dispatch(selectedCompany(companyRes.result));
  //   companyRes && setData(id, companyRes);
  //   setEditingRow((prev) => ({
  //     ...prev,
  //     state: false,
  //     record: companyRes.result,

  //   }));
  // };

  const handleSave = async (record) => {
    let values = await form.validateFields();
    // let values = { ...editingRow.updatedValues };
    editManager({ payload: values, id: editingRow.record._id })
      .unwrap()
      .then((res) => {
        setData(record._id, res);

        dispatch(showPopup({ state: true, message: "Manager record updated" }));
      })
      .catch((error) => {
        dispatch(
          errorPopup({
            state: true,
            message: `Manager edit  not due to ${error}`,
          })
        );
      });
  };
  const handleEdit = (record) => {
    form.setFieldsValue({
      name: "",
      companyEmail: "",
      managerPhone: "",
      companyName: "",
      companyPhone: "",

      ...record,
    });
    // setSelected({ isSelected: true, record: { ...record } });
    setEditingRow((prev) => ({
      ...prev,
      state: !prev.state,
      record: record,
    }));
    // const editRecord = { [key]: val };
    // const updatedRecord = { ...editingRow.record, [key]: val };

    // setEditingRow((prev) => ({
    //   ...prev,
    //   state: true,
    //   updatedValues: editRecord,
    //   record: updatedRecord,
    // }));
    // setManagerUpdatedData(updatedRecord, selectedRecord);
  };

  const customHandleSave = async (record) => {
    let values = { ...record };
    // editManager({ payload: values, id: record._id })
    //   .unwrap()
    //   .then((res) => {
    //     const removeManagers = managers.filter((val) => val._id !== record._id);

    //     const sortedData = adminEditGlobalFunctions.sortData(
    //       [...removeManagers, { ...res.result, SNO: record.SNO }],
    //       "SNO"
    //     );

    //     setManagers((prev) => sortedData);
    //     dispatch(showPopup({ state: true, message: "Manager record updated" }));
    //   })
    //   .catch((error) => {
    //     dispatch(
    //       errorPopup({
    //         state: true,
    //         message: `Manager edit  not due to ${error}`,
    //       })
    //     );
    //   });
    const managerRes = await useGlobalApi.postApi(
      editManager,
      record,
      record._id,
      t("Credentials will be sent to manager."),
      t("Failed To Send Credentials"),
      dispatch
    );

    managerRes && customSetData(record._id, managerRes, record);
  };
  const customSetData = async (key, res, rows) => {
    try {
      // const row = await tableForm[0].validateFields();
      let row = rows;
      const newData = [...managers];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          //  products
        });
      } else {
        newData.push(row);
      }
      setEditingRow({
        state: false,
        record: {},
      });
      setManagers((prev) => newData);

      return newData;
    } catch (errInfo) {}
  };
  const deleteManager = async (id) => {
    const deleteRes = await useGlobalApi.postApi(
      deleteManagerApi,
      "",
      id,
      "Manager deleted successfully",
      "Manager not deleted",
      dispatch
    );

    if (deleteRes) {
      const dataRes = await refetch();
      const filterData = data.filter((val) => val._id !== id);
      setManagers(filterData);
    }
  };
  const sendCredentials = (record) => {
   
    let generatedPassword = adminEditGlobalFunctions.generateRandomPassword(
      record.employeeEmail
    );

    // passwordSetInTable("managerPassword", generatedPassword, record);
    let tempRecord = { ...record, managerPassword: generatedPassword };
    handleCustomEdit(tempRecord);
    customHandleSave(tempRecord);
  };
  const handleCustomEdit = (record) => {
    form.setFieldsValue({
      name: "",
      companyEmail: "",
      managerPhone: "",
      companyName: "",
      companyPhone: "",

      ...record,
    });
    setEditingRow((prev) => ({
      ...prev,
      state: false,
      record: { ...record, _id: "73773" },
    }));
  };
  const setManagerUpdatedData = (updatedRecords, selectedRecord) => {
    let filterManagers = managers.filter(
      (val) => val._id === selectedRecord._id
    )[0];
    filterManagers = { ...updatedRecords };
    const removeManagers = managers.filter(
      (val) => val._id !== selectedRecord._id
    );

    setManagers([...removeManagers, filterManagers]);
  };
  const passwordSetInTable = (key, val, selectedRecord) => {
    const editRecord = { [key]: val };
    const updatedRecord = { ...selectedRecord, [key]: val };

    setEditingRow((prev) => ({
      ...prev,
      state: false,
      updatedValues: editRecord,
      record: updatedRecord,
    }));
    setManagerUpdatedData(updatedRecord, selectedRecord);
    customHandleSave(updatedRecord);
  };
  const setData = async (key, res) => {
    try {
      const row = await form.validateFields();
      const newData = [...managers];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          //  products
        });
      } else {
        newData.push(row);
      }
      setEditingRow({
        state: false,
        record: {},
      });
      setManagers((prev) => newData);

      return newData;
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const mergedColumns = adminEditGlobalFunctions
    .managerColumns(
      handleEdit,
      handleSave,
      editingRow,
      setEditingRow,
      deleteManager,
      sendCredentials,
      t
    )
    .map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: "text",

          dataIndex: col.dataIndex,
          title: col.title,

          editing: isEditing(record),
        }),
      };
    });

  useEffect(() => {
    if (data) {
      const addSerialNoToData = adminEditGlobalFunctions.addSerialNo(data);

      setManagers(addSerialNoToData);
    }
  }, [isLoading]);

  return (
    <div>
      <h1 className="font-bold mt-5">Managers</h1>
      <Spin
        spinning={isLoading || deleteResponse.isLoading || response.isLoading}
      >
        <Form form={form} component={false}>
          <Table
            columns={mergedColumns}
            components={{
              body: {
                cell: adminEditGlobalFunctions.EditableCell,
              },
            }}
            // columns={adminEditGlobalFunctions.managerColumns(
            //   handleEdit,
            //   handleSave,
            //   editingRow,
            //   setEditingRow,
            //   deleteManager,
            //   sendCredentials,t
            // )}
            dataSource={managers}
            pagination={false}
            // rowKey="key"
            rowKey={(record) => {
              return record._id;
            }}
            className="mt-2"
          />
        </Form>
      </Spin>
    </div>
  );
}
