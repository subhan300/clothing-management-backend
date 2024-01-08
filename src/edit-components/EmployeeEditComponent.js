import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  Space,
  Form,
  Row,
  Col,
  Spin,
} from "antd";
import {
  useAddEmployeeProductsMutation,
  useAddNewEmployeeMutation,
  useDeleteEmployeeMutation,
  useDeleteEmployeeProductByIdMutation,
  useDeleteManagerMutation,
  useEditEmployeeMutation,
  useGetAllEmployeesProductsByCompanyIdQuery,
  useGetEmployeesByCompanyIdQuery,
  useGetProductsByCompanyIdQuery,
  useSendEmailMutation,
  useUpdateEmployeeProductsByCompanyIdMutation,
} from "../apis";
import { useDispatch, useSelector } from "react-redux";
import { showPopup, errorPopup } from "../redux-slice/UserSliceAuth";
import { adminEditGlobalFunctions } from "../global-functions/adminEditGlobalFunction";
import debounce from "lodash.debounce";
import { globalFunctions } from "../global-functions/GlobalFunctions";
import useGlobalApi from "../global-functions/useGlobalApi";
import ProductsModal from "../components/products-modal/ProductsModal";
import { useTranslation } from "react-i18next";

const { Option } = Select;

function EmployeeEditComponent(EmployeeEditComponentProps) {
  const { t } = useTranslation();
  const { selected } = EmployeeEditComponentProps;
  const getAdminReduxStoreData = useSelector((val) => val.admin);

  const { data, isLoading, refetch } = useGetEmployeesByCompanyIdQuery({
    companyId: selected.record._id,
  });

  const [emp, setEmp] = useState({
    empId: "",
    productId: "",
    employeeName: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isEmployeeAddProductModalOpen, setIsEmployeeAddProductModalOpen] =
    useState(false);
  // all 3 state for employee modals
  const [products, setProducts] = useState([]);
  const [updateproducts, setUpdateProducts] = useState([]);
  const [employeeAddProductsCollection, setEmployeeAddProductsCollection] =
    useState([]);

  const [employeeModalState, setEmployeeModalState] = useState(false);
  const [addProductModalState, setAddProductModalState] = useState(false);
  const [productValidated, setProductValidated] = useState(false);
  const employeesProductsData = useGetAllEmployeesProductsByCompanyIdQuery({
    companyId: selected.record?._id,
  });
  const companyProductsData = useGetProductsByCompanyIdQuery({
    companyId: selected.record?._id,
  });

  const [selectedProduct, setSelectedProduct] = useState([]);
  const [triggerState,setTriggerState]=useState(false)
  const [editEmployee, response] = useEditEmployeeMutation();
  const [editEmployeeProduct, editEmployeeProductRes] =
    useUpdateEmployeeProductsByCompanyIdMutation();
  const [addNewEmployee, response2] = useAddNewEmployeeMutation();
  const [deleteEmployeeApi, deleteResponse] = useDeleteEmployeeMutation();
  const [deleteEmployeeProductsApi, deleteEmployeeProductRes] =
    useDeleteEmployeeProductByIdMutation();
  const [addProductToEmployee, AddProductApiRes] =
    useAddEmployeeProductsMutation();
  const [employees, setEmployees] = useState([]);
  const [
    employeeProductOriginalCollection,
    setEmployeeProductOriginalCollection,
  ] = useState([]);
  const [updateState, setUpdateState] = useState(false);
  const [form] = Form.useForm();
  const tableForm = Form.useForm();

  const dispatch = useDispatch();
  const [editingRow, setEditingRow] = useState({
    state: false,
    record: {},
    updatedValues: {},
  });

  const deleteEmployee = async (id) => {
    const deleteRes = await useGlobalApi.postApi(
      deleteEmployeeApi,
      "",
      id,
      t("Employee deleted successfully"),
      t("Employee not deleted"),
      dispatch
    );

    if (deleteRes) {
      const dataRes = await refetch();
      const filterData = data.filter((val) => val._id !== id);
      const addDataSNO = filterData.map((val, i) => ({ ...val, SNO: i + 1,budget:globalFunctions.formatPrice(val.budget)}));
      setEmployees(addDataSNO);
    }
  };
  const openAddProductModal = (record) => {
    setIsEmployeeAddProductModalOpen(true);
    openSelectCompanyModal(
      setEmployeeAddProductsCollection,
      setAddProductModalState,
      addProductModalState,
      setIsEmployeeAddProductModalOpen
    );
    setEmp((prev) => ({
      productId: record.productId,
      empId: record._id,
      employeeName: record.employeeName,
    }));
  };
  const onFinish = (values) => {
    const companyName = selected.record.companyName;
    values = {
      companyId: selected.record._id,
      ...values,
      companyName,
      products: [
        {
          productName: "t-shirt",
          productImage: "https://image.com",
          productSize: "M",
          productPrice: 20,
        },
      ],
      budget: 200,
    };
    if (!selectedProduct.length || !productValidated) {
      return dispatch(
        errorPopup({ state: true, message: t("Please Select Products") })
      );
    }
    let generatedPassword = adminEditGlobalFunctions.generateRandomPassword(
          values.employeeEmail      
    );
    values = { ...values, products: getSelectedProducts(),employeePassword:generatedPassword };
    addNewEmployee(values)
      .unwrap()
      .then((res) => {
        debugger
        const updatedEmployees = [res.employee, ...employees];
        const addDataSNO = updatedEmployees.map((val, i) => ({
          ...val,
          SNO: i + 1,
         budget:i===0?globalFunctions.formatPrice(val.budget):val.budget
         
        }));
        setEmployees(addDataSNO);
        dispatch(showPopup({ state: true, message: t("Employee Created") }));
        setSelectedProduct([]);
        form.resetFields();
      })
      .catch((error) => {
        dispatch(
          errorPopup({
            state: true,
            message: `Employee not created due to ${error.data}`,
          })
        );
      });
  };
  const deleteEmployeeProducts = async (id) => {
    try {
      await useGlobalApi.postApi(
        deleteEmployeeProductsApi,
        "",
        id,
        t("Employee Product Deleted"),
        t("Failed To Delete Product"),
        dispatch
      );
      const filterProducts = updateproducts.filter((val) => val._id !== id);
      setUpdateProducts(filterProducts);
    } catch (err) {
      dispatch(errorPopup({ state: true, message: t("some unknown issue") }));
    }
  };
  const getSelectedProducts = () => {
    return selectedProduct.map((val) => {
      return {
        productImage: val.productImage,
        productName: val.productName ? val.productName : "",
        productSize: val.productSize ? val.productSize : "",
        productPrice: val.productPrice ? `${val.productPrice}` : 0,
        productQuantity: val.productQuantity ? val.productQuantity : 1,
      };
    });
  };
 
  const productsSelected = async () => {
    const requiredFields = getAdminReduxStoreData.companySetting.budgetStatus
      ? ["productPrice"]
      : [];

    const validationResult = globalFunctions.validateData(
      selectedProduct,
      requiredFields
    );
    if (selectedProduct.length > 0 && validationResult.valid) {
     
      setProductValidated(true);
      handleModal(false);

      dispatch(showPopup({ state: true, message: t("Products Selected") }));
    } else if (!validationResult.valid) {
      return dispatch(
        errorPopup({
          state: true,
          message: t("Price is required"),
        })
      );
    } else {
      dispatch(
        errorPopup({ state: true, message: t("No Products Are Selected") })
      );
    }
  };
  const editProductsSelected = async () => {
    const requiredFields = getAdminReduxStoreData.budgetStatus
      ? ["productPrice"]
      : [];

    const validationResult = globalFunctions.validateData(
      selectedProduct,
      requiredFields
    );
    if (selectedProduct.length > 0 && validationResult.valid) {
      try {
        const editEmployeeProductRes = await useGlobalApi.postApi(
          editEmployeeProduct,
          [...selectedProduct],
          selected.record._id,
          "Employee products data updated ",
          "Employee products data not updated due to some error",
          dispatch
        );

        setIsEmployeeModalOpen(false);
      } catch (err) {
        return dispatch(
          errorPopup({
            state: true,
            message: t("some unknown issue ,refresh and try again"),
          })
        );
      }
    } else if (!validationResult.valid) {
      return dispatch(
        errorPopup({
          state: true,
          message: t("Price is required"),
        })
      );
    } else {
      dispatch(
        errorPopup({ state: true, message: t("No Products Are Selected") })
      );
    }
  };
  const handleModal = (val) => {
    setIsModalOpen(val);
  };
  const handleSave = async (id) => {
    let values = await tableForm[0].validateFields();

    const employeeRes = await useGlobalApi.postApi(
      editEmployee,
      values,
      editingRow.record._id,
      t("Employee data updated"),
      t("Employee data not updated due to some error"),
      dispatch
    );
    employeeRes && setData(id, employeeRes);
  };
  const customHandleSave = async (record) => {
    // let values = await tableForm[0].validateFields();

    const employeeRes = await useGlobalApi.postApi(
      editEmployee,
      record,
      record._id,
      t("Credentials will be sent to employee."),
      t("Failed To Send Credentials"),
      dispatch
    );
    employeeRes && customSetData(record._id, employeeRes, record);
  };
  const sendCredentials = (record) => {
    let generatedPassword = adminEditGlobalFunctions.generateRandomPassword(
      record.employeeEmail
    );
  
    
 
    let tempRecord = { ...record, employeePassword: generatedPassword };
    delete tempRecord.budget
    handleCustomEdit(tempRecord);
    customHandleSave(tempRecord);
  };
  const setData = async (key, res) => {
    try {
      let row = await tableForm[0].validateFields();
      row={...row};
      const newData = [...employees];
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
      setEmployees((prev) => newData);

      return newData;
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const customSetData = async (key, res, rows) => {
    try {
      // const row = await tableForm[0].validateFields();
      let row = {...rows,budget:globalFunctions.formatPrice(res.result.budget)};
      
      const newData = [...employees];
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
      setEmployees((prev) => newData);

      return newData;
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const isEditing = (record) => record._id === editingRow.record._id;

  const handleSearch = (value) => {
    const searchResult = globalFunctions.searchContacts(data, value);
    setEmployees(searchResult);
  };

  const handleEdit = (record) => {
    tableForm[0].setFieldsValue({
      employeeName: "",
      employeeEmail: "",
      budget: 0,
      employeePassword: "",
      employeePhone: "",
      gender: "",
      ...record,
    });
    setEditingRow((prev) => ({
      ...prev,
      state: true,
      record: record,
    }));
  };
  const handleCustomEdit = (record) => {
    tableForm[0].setFieldsValue({
      employeeName: "",
      employeeEmail: "",
      budget: 0,
      employeePassword: "",
      employeePhone: "",
      gender: "",
      ...record,
    });
    setEditingRow((prev) => ({
      ...prev,
      state: false,
      record: { ...record, _id: "73773" },
    }));
  };
  const attachProducts = async (record) => {
    setSelectedProduct([]);
    setEmp((prev) => ({
      ...prev,
      productId: record.productId,
      employeeName: record.employeeName,
    }));
    const tempData = await employeesProductsData.refetch();
    const selectedEmployee = tempData?.data[0].products.filter(
      (val) => val._id === record.productId
    );
    //  setSelectedProduct([...selectedEmployee[0].products])
    setUpdateProducts((prev) => [...selectedEmployee[0].products]);
    setEmployeeProductOriginalCollection([...selectedEmployee[0].products]);
    setEmployeeModalState(!employeeModalState);
  };
  const addEmployeeProductsApi = async () => {
    try {
      const tempProduct = getSelectedProducts();
      const addRes = await useGlobalApi.postApi(
        addProductToEmployee,
        tempProduct,
        emp.productId,
        t("Products Added To Employee"),
        t("Products Failed To Add In Employee"),
        dispatch
      );
      setUpdateProducts((prev) => [...addRes.results, ...prev]);
      setSelectedProduct([]);
      setIsEmployeeAddProductModalOpen(false);
    } catch (err) {
      dispatch(
        errorPopup({ state: true, message: t("UnKnown Issue, Try Again") })
      );
    }
  };
  const openSelectCompanyModal = async (
    setProductCollection,
    setStateHandler,
    stateHandler,
    closeModal
  ) => {
    let tempData;
    try {
      setSelectedProduct([]);
      const data = await companyProductsData.refetch();
      tempData = data.data.products;
      setProductCollection(tempData);
      setStateHandler(!stateHandler);
    } catch (err) {
      dispatch(errorPopup({ state: true, message: t("Plz Open Modal Again") }));
      // handleModal(false)
      closeModal(false);
    }
  };
  const mergedColumns = adminEditGlobalFunctions
    .employeesColumn(
      handleEdit,
      handleSave,
      editingRow,
      setEditingRow,
      deleteEmployee,
      attachProducts,
      getAdminReduxStoreData.companySetting,
      openAddProductModal,
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
          inputType:
            col.dataIndex === "budget"
              ? "budget"
              : col.dataIndex === "employeeEmail"
              ? "employeeEmail"
              : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });
  useEffect(() => {
    if (data) {
      const addDataSNO = data.map((val, i) => ({ ...val, SNO: i + 1,budget:globalFunctions.formatPrice(val.budget) }));
      setEmployees(addDataSNO);
    }
  }, [isLoading]);
  useEffect(() => {
    if (products.length > 0) {
      handleModal(true);
    }
  }, [products, updateState]);
  useEffect(() => {
    if (employeeAddProductsCollection.length > 0) {
      setIsEmployeeAddProductModalOpen(true);
    }
  }, [employeeAddProductsCollection, addProductModalState]);
  useEffect(() => {
    if (updateproducts.length > 0) {
      setIsEmployeeModalOpen(true);
    }
  }, [employeeModalState]);
  
  return (
    <>
      <ProductsModal
        open={isModalOpen}
        saveBtn={false}
        onOk={() => {
          productsSelected();
        }}
        onCancel={() => {
          handleModal(false);
        }}
        products={products}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        type="companyAdd"
        editable={false}
        setProducts={setProducts}
        data={companyProductsData?.data?.products}
        companySetting={getAdminReduxStoreData.companySetting}
        showSize={true}
        modalTitle={`${getAdminReduxStoreData.company.companyName} ${"Company Products"}`}
        triggerState={triggerState}
        setTriggerState={setTriggerState}
      />

      <ProductsModal
        open={isEmployeeModalOpen}
        saveBtn={false}
        onOk={() => {
          editProductsSelected();
        }}
        onCancel={() => {
          setIsEmployeeModalOpen(false);
        }}
        products={updateproducts}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        type="companyAdd"
        editable={false}
        setProducts={setUpdateProducts}
        data={employeeProductOriginalCollection}
        companySetting={getAdminReduxStoreData.companySetting}
        deleteProducts={deleteEmployeeProducts}
        showSize={true}
        modalTitle={`${emp.employeeName} ${t("Products")}`}
        triggerState={triggerState}
        setTriggerState={setTriggerState}
      />
      <ProductsModal
        open={isEmployeeAddProductModalOpen}
        saveBtn={false}
        onOk={() => {
          addEmployeeProductsApi();
        }}
        onCancel={() => {
          setIsEmployeeAddProductModalOpen(false);
        }}
        products={employeeAddProductsCollection}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        type="companyAdd"
        editable={false}
        setProducts={setEmployeeAddProductsCollection}
        data={companyProductsData?.data?.products}
        companySetting={getAdminReduxStoreData.companySetting}
        showSize={true}
        modalTitle={`${getAdminReduxStoreData.company.companyName} ${"Company Products"}`}
        triggerState={triggerState}
        setTriggerState={setTriggerState}
      />
      <h1 className="font-bold mt-5">{t("Employees")}</h1>

      <div className="flex justify-between p-2 bg-gray-200 mt-2">
        <Form form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col xs={24} sm={5} md={5}>
              <Form.Item
                name="employeeName"
                rules={[
                  {
                    required: true,
                    message: t("Please enter the new employee name"),
                  },
                ]}
              >
                <Input placeholder={t("Name")} required />
              </Form.Item>
            </Col>

            <Col xs={24} sm={5} md={4}>
              <Form.Item
                name="employeeEmail"
                rules={[
                  {
                    required: getAdminReduxStoreData.companySetting.budgetStatus?true:false,
                    message: t("Please enter the email"),
                  },
                ]}
              >
                <Input placeholder={t("Email")} />
              </Form.Item>
            </Col>

            {/* <Col xs={24} sm={5} md={4}>
              <Form.Item
                name="employeePassword"
                rules={[
                  {
                    required: getAdminReduxStoreData.companySetting.budgetStatus?true:false,
                    message: t("Please enter the Password"),
                  },
                ]}
              >
                <Input placeholder={t("Password")} />
              </Form.Item>
            </Col> */}

            <Col xs={24} sm={5} md={4}>
              <Form.Item
                name="employeePhone"
                rules={[
                  {
                    required: false,
                    message: t("Please enter the Phone Number"),
                  },
                ]}
              >
                <Input type="number" placeholder={t("Phone Number")} />
              </Form.Item>
            </Col>
            {employees?.budget && (
              <Col xs={24} sm={5} md={4}>
                <Form.Item
                  name="budget"
                  label={t("Enter Budget")}
                  rules={[{ required: true, message: t("Please enter  Budget")}]}
                >
                  <Input min={0} onInput={adminEditGlobalFunctions.restrictInputToPositiveIntegers} placeholder={t("Enter your Budget")} type="number" />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={5} md={4}>
              <Form.Item
                name="gender"
                label={t("Gender")}
                rules={[{ required: true, message: t("Please select a Gender") }]}
              >
                <Select style={{ width: "100%" }} placeholder={t("Gender")}>
                  <Option value={"M"}>{t("M")}</Option>
                  <Option value={"F"}>{t("F")}</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={5} md={4}>
              <Button
                type=""
                className="bg-black text-white hover:bg-black"
                style={{ backgroundColor: "green" }}
                onClick={() => {
                  openSelectCompanyModal(
                    setProducts,
                    setUpdateState,
                    updateState,
                    handleModal
                  );
                }}
              >
                {t("Select Products")}
              </Button>
            </Col>
            <Col className="ml-8" xs={24} sm={5} md={4}>
              <Button
                htmlType="submit"
                className="bg-black text-white hover:bg-black"
                // onClick={handleAddUser}
              >
                {t("Add User")}
              </Button>
            </Col>

            <Col xs={24} sm={8}>
              <Input.Search
                placeholder={t("Search")}
                onSearch={handleSearch}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                enterButton
              />
            </Col>
          </Row>
        </Form>
      </div>

      <Spin spinning={isLoading || response.isLoading || response2.isLoading}>
        <Form form={tableForm[0]} component={false}>
          <Table
            columns={mergedColumns}
            components={{
              body: {
                cell: adminEditGlobalFunctions.employeeEditableCell,
              },
            }}
            dataSource={employees}
            // pagination={false}
            rowKey={(record) => record._id}
            pagination={{
              position: "bottomRight",
              pageSize: 12,
            }}
            className="mt-2"
          />
        </Form>
      </Spin>
    </>
  );
}

export default EmployeeEditComponent;
