import React, { useState, useEffect } from "react";
import { Form, Select, Input, Button } from "antd";
import { p1, p2, p3 } from "../../assets/images";
import {
  useAddNewEmployeeMutation,
  useGetAllCompaniesQuery,
  useGetProductsByCompanyIdQuery,
} from "../../apis";
import { useDispatch, useSelector } from "react-redux";
import { showPopup, errorPopup } from "../../redux-slice/UserSliceAuth";
import { CustomSelect } from "../../global-functions/globalStyle";
import { adminEditGlobalFunctions } from "../../global-functions/adminEditGlobalFunction";
import { useTranslation } from "react-i18next";
const { Option } = Select;

function AddEmployeeTab() {
  const [form] = Form.useForm();
  const {t}=useTranslation();
  const [addNewEmployee, response] = useAddNewEmployeeMutation();
  const { data, isLoading, error } = useGetAllCompaniesQuery();
 
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState({});
  const [products, setProducts] = useState([]);
 
  const companyProductsData = useGetProductsByCompanyIdQuery({
    companyId: company?._id,
  });
  const productArrayTemper = (productsSpecific) => {
    
    return productsSpecific.map((val) => ({
      productName: val,
      productSize: "",
      productPrice: 0,
      productQuantity: 1,
      productImage: products.filter((val1) => val1.productName === val)[0]
        .productImage,
    }));
  };
 
  const dispatch = useDispatch();
  const onFinish = (values) => {
    const companyName = data.filter((val) => val._id === values.companyId)[0]
      .companyName;
    const products = productArrayTemper(values.products);
    values = {
      ...values,
      companyName,
      employeePassword: adminEditGlobalFunctions.generateRandomPassword(
        values.employeeEmail
      ),
      products,
    };
    addNewEmployee(values)
      .unwrap()
      .then((res) => {
        dispatch(showPopup({ state: true, message: t("Employee Created") }));
        form.resetFields();
      })
      .catch((error) => {
        dispatch(
          errorPopup({
            state: true,
            message: `company not ceated due to ${error.data}`,
          })
        );
      });
  };

  const companySelected = (value) => {
    const company = companies.filter((val) => val._id === value)[0];
    setCompany(company);
  };
  const productApi=async()=>{
    const productData= await companyProductsData.refetch();

    setProducts(productData?.data?.products??[]);
    
  }
  useEffect(() => {
    companyProductsData.refetch({ companyId: company?._id });
    if (data) {
      setCompanies(data);
    }
  }, [isLoading]);
  useEffect(() => {
  
    productApi()
  
    
  }, [company]);
  useEffect(() => {
    if (companyProductsData.data) {
      setProducts(companyProductsData.data.products);
    }
  }, [companyProductsData.isLoading]);

  useEffect(() => {}, [companyProductsData.data]);
  return (
    <div>
      <h1 className="text-2xl font-semibold">{t("Add New Employee")}</h1>
      <Form
        form={form}
        name="myForm"
        className="space-y-2 mt-2"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="employeeName"
          label={t("Name")}
          rules={[{ required: true, message: t("Please enter your name") }]}
        >
          <Input placeholder={t("Enter your name")} />
        </Form.Item>

        <Form.Item
          name="companyId"
          label={t("Company")}
          rules={[{ required: true, message: t("Please select a company") }]}
        >
          <Select
            listHeight={350}
            virtual={false}
            placeholder={t("Select company")}
            onChange={(e) => {
              companySelected(e);
            }}
          >
            {companies.map((company) => (
              <Option key={company._id} value={company._id}>
                {company.companyName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {company?.budget && (
          <Form.Item
            name="budget"
            label={t("Enter Budget")}
            rules={[{ required: true, message: t("Please enter  Budget") }]}
          >
            <Input placeholder={t("Enter your Budget")} type="number" />
          </Form.Item>
        )}

        <Form.Item
          name="products"
          label={t("Products")}
          rules={[
            { required: true, message: t("Please select at least one product") },
          ]}
        >
          <CustomSelect
            listHeight={350}
            virtual={false}
            mode="multiple"
            placeholder={t("Select Products")}
          >
            {products.map((product) => (
              <Option key={product._id} value={product.productName}>
                <div className="flex items-center">
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-6 h-6 mr-2"
                  />
                  {t(product.productName)}
                </div>
              </Option>
            ))}
          </CustomSelect>
        </Form.Item>

        <Form.Item
          name="gender"
          label={t("Gender")}
          rules={[{ required: true, message: t("Please select a Gender") }]}
        >
          <Select placeholder={t("Select Gender")}>
  <Option value={t("M")}>{t("Male")}</Option>
  <Option value={t("F")}>{t("Female")}</Option>
</Select>

        </Form.Item>
        <Form.Item
          name="employeeEmail"
          label={t("Email")}
          rules={[{ required:company?.budgetStatus?true:false, message: t("Please enter Employee email") }]}
        >
          <Input placeholder={t("Enter your email")} type="email" />
        </Form.Item>

       

        <Form.Item
          name="employeePhone"
          label={t("Phone Number")}
          rules={[{ required: false, message: t("Please enter  phone number") }]}
        >
          <Input placeholder={t("Enter your phone number")} type="tel" />
        </Form.Item>

        <Form.Item>
          <Button
            type=""
            className="bg-black hover:bg-black text-white"
            htmlType="submit"
          >
            {t("Add Employee")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddEmployeeTab;
