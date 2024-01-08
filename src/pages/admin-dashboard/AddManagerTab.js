import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import { useDispatch } from "react-redux";
import {
  useGetAllCompaniesQuery,
  useAddNewManagerMutation,
} from "../../apis/Admin";
import { showPopup, errorPopup } from "../../redux-slice/UserSliceAuth";
import { CustomSelect } from "../../global-functions/globalStyle";
import { adminEditGlobalFunctions } from "../../global-functions/adminEditGlobalFunction";
import { useTranslation } from "react-i18next";
const { Option } = Select;

function AddManagerTab() {
  const {t}=useTranslation();
  const [form] = Form.useForm();
  const [addNewManager, response] = useAddNewManagerMutation();
  const { data, error, isLoading, refetch } = useGetAllCompaniesQuery();

  const [companies, setCompanies] = useState(data);
  const dispatch = useDispatch();
  const onFinish = (values) => {
    const companyName = data.filter((val) => val._id === values.companyId)[0]
      .companyName;
    values = {
      ...values,
      companyName,
      managerPassword: adminEditGlobalFunctions.generateRandomPassword(
        values.managerPassword
      ),
    };
    addNewManager(values)
      .unwrap()
      .then((res) => {
        dispatch(showPopup({ state: true, message: t("Manager Created") }));
        form.resetFields();
      })
      .catch((error) => {
        dispatch(
          errorPopup({
            state: true,
            message: `company not created due to ${error.data.message}`,
          })
        );
      });
  };

  useEffect(() => {
    refetch();
    if (data) {
      setCompanies(data);
    }
  }, [isLoading]);
  return (
    <div>
      <h1 className="text-2xl font-semibold">{t("Add New Manager")}</h1>
      <Form
        className="space-y-2 mt-2"
        name="myForm"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          label={t("Manager Name")}
          name="name"
          rules={[{ required: true, message: t("Please enter Manager Name") }]}
        >
          <Input placeholder={t("Name")} />
        </Form.Item>

        <Form.Item
          label={t("Email")}
          name="managerEmail"
          rules={[
            { required: true, message: t("Please enter Manager email") },
            { type: "email", message: t("Please enter a valid email") },
          ]}
        >
          <Input placeholder={t("Email")} />
        </Form.Item>

        <Form.Item label={t("Phone Number")} name="managerPhone">
          <Input type="number" placeholder={t("Phone Number")} />
        </Form.Item>

        <Form.Item
          label={t("Company")}
          name="companyId"
          rules={[{ required: true, message: t("Please select a company") }]}
        >
          <Select listHeight={350} virtual={false} placeholder={t("Select Company")}>
            {companies?.map((val) => (
              <Option value={val?._id}>{t(val?.companyName)}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="submit"
            htmlType="submit"
            className="mt-6 bg-black text-white hover:bg-black"
          >
            {t("Add Manager")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddManagerTab;
