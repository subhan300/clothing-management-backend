import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Row,
  Col,
  Select,
  Input,
  Button,
  Modal,
  Upload,
  Spin,
  Popconfirm,
  notification,
} from "antd";
import ImgCrop from "antd-img-crop";

import ProductsModal from "../../components/products-modal/ProductsModal";
import { PlusOutlined } from "@ant-design/icons";
import { BsTrash } from "react-icons/bs";

import {
  useAddNewCompanyMutation,
  useGetAllProductsApiQuery,
  useGetCompanyAllProductsQuery,
} from "../../apis";
import { showPopup, errorPopup } from "../../redux-slice/UserSliceAuth";
import { useDispatch } from "react-redux";

import useCustomGenerateUrls from "../../global-functions/useUpdateImageCustomHook";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { adminEditGlobalFunctions } from "../../global-functions/adminEditGlobalFunction";

import { useTranslation } from "react-i18next";

function AddCompanyTab() {
  const { t } = useTranslation();
  const [addNewCompany, response] = useAddNewCompanyMutation();
  const { data, isLoading, refetch } = useGetAllProductsApiQuery();
  console.log("data=====",data,isLoading)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productFormValues, setProductFormValues] = useState([]);
  const [productValidated, setProductValidated] = useState(false);
  const [products, setProducts] = useState([]);
  const [companySetting, setCompanySetting] = useState({
    pricingStatus: false,
    budgetStatus: false,
    companyId: "",
  });
  const [triggerState, setTriggerState] = useState(false);
  const { Option } = Select;

  const budgetOptions = [t("Show Budget Settings"), t("No Budget Settings")];
  const pricingOptions = [t("yes"), t("no")];

  const [selectedProduct, setSelectedProduct] = useState([]);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { generateLinks, loading } = useCustomGenerateUrls();

  const config = {
    title: t("WARNING-INFORMATION"),
    content: (
      <>
        <div>
          <p>{t("You must set all prices for products and ")}</p>
          <p>{t("budget for employees in order for budget to")}</p>
          <p>{t("work correctly")}</p>
        </div>
      </>
    ),
    okButtonProps: { style: { backgroundColor: "orange" } },
  };
  const [modal, contextHolder] = Modal.useModal();

  const [modalFileList, setModalFileList] = useState("");
  const handleCreateUrl = async () => {
    let imageUrls = await generateLinks(modalFileList);
    setModalFileList([]);
    return imageUrls[0];
  };
  const handleModalFileDrop = (files) => {
    setModalFileList([files]);
  };
  const handleModalFileRemove = (file) => {
    setModalFileList([]);
  };

  const onFinish = async (values) => {
   
    if (!selectedProduct.length || !productValidated) {
      return dispatch(
        errorPopup({ state: true, message: t("Please Select Products") })
      );
    }

    if (modalFileList.length) {
      const url = await handleCreateUrl();
      values = { ...values, companyLogo: url };
    } else {
      return dispatch(
        errorPopup({ state: true, message: t("Please Select Company Logo") })
      );
    }
    const tempProduct = selectedProduct.map((val) => {
      return {
        productImage: val.productImage,
        productName: val.productName,
        productSize: val.productSize ? val.productSize : "",
        productPrice: val.productPrice ? val.productPrice : 0,
        productQuantity: val.productQuantity ? val.productQuantity : 1,
      };
    });
    values = { status: 1, ...values, products: [...tempProduct] };

    addNewCompany(values)
      .unwrap()
      .then((res) => {
        dispatch(showPopup({ state: true, message: t("Company Created") }));
        setSelectedProduct([]);
        setProducts(data);
        setCompanySetting({
          pricingStatus: false,
          budgetStatus: false,
          companyId: "",
        });
        form.resetFields();
      })
      .catch((error) => {
        dispatch(
          errorPopup({
            state: true,
            message: `company not created due to ${error.message}`,
          })
        );
      });
  };
  const companySettingFunc = (key, val) => {
    setCompanySetting((prev) => ({ ...prev, [key]: val }));
    if (key === "budgetStatus" && val) {
      modal.warning(config);
    }
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const productsSelected = () => {
    const requiredFields = companySetting.budgetStatus ? ["productPrice"] : [];

    const validationResult = globalFunctions.validateData(
      selectedProduct,
      requiredFields
    );
    if (selectedProduct.length > 0 && validationResult.valid) {
      dispatch(showPopup({ state: true, message: t("Products Selected") }));
      setProductValidated(true);
      handleModal(false);
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
  const formRef = useRef(null);

  useEffect(() => {
    debugger

    if (data) {
      const tempData = data.map((val) => {
        return { ...val, productId: val._id };
      });
      setProducts(tempData);
    }
  }, [isLoading]);

  return (
    <div>
      {contextHolder}
      <h1 className="text-2xl font-semibold">{t("Create New Company")}</h1>
      <Form form={form} className="mt-6" onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t("New Company Name")}
              name="companyName"
              rules={[
                {
                  required: true,
                  message: t("Please enter the new company name"),
                },
              ]}
            >
              <Input placeholder={t("Company Name")} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={t("Pricing Setting")}
              name="pricingStatus"
              rules={[{ required: true, message: t("Pricing is required") }]}
            >
              <Select
                placeholder={t("Pricing Status")}
                onChange={(val) => companySettingFunc("pricingStatus", val)}
              >
                {pricingOptions.map((options) => (
                  <Option key={options} value={options === t("yes") ? 1 : 0}>
                    {options}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {companySetting.pricingStatus ? (
            <Col xs={24} sm={12}>
              <Form.Item rules={[{required:true,message:"pricing setting is required"}]} label={t("Budget Setting")} name="budgetStatus">
                <Select
                  placeholder={t("Budget Status")}
                  onChange={(val) => companySettingFunc("budgetStatus", val)}
                >
                  {budgetOptions.map((options) => (
                    <Option
                      key={options}
                      value={options === t("Show Budget Settings") ? 1 : 0}
                    >
                      {options}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          ) : (
            ""
          )}
          {companySetting.pricingStatus && companySetting.budgetStatus ? (
            <Col xs={24} sm={12}>
              <Form.Item
                placeholder={t("Budget Amount")}
                label={t("Budget Amount")}
                name="pricing"
                rules={[
                  {
                    required: true,
                    message: t("Please enter the new Budget Amount"),
                  },
                ]}
              >
    {/* <Input onInput={adminEditGlobalFunctions.restrictInputToPositiveIntegers} /> */}
    <Select
                placeholder={t("Select Budget")}
                style={{ width: "100%", textAlign: "left" }}
                optionFilterProp="children"
                options={globalFunctions.budgetOptions}
              />
              </Form.Item>
            </Col>
          ) : (
            ""
          )}
          <Col xs={24} sm={12}>
            <Form.Item label={t("Company Phone")} name="companyPhone">
              <Input type="number" placeholder={t("Company Phone")} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label={t("Company Email")} name="companyEmail">
              <Input type="email" placeholder={t("Company Email")} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label={t("Company Fax")} name="companyFax">
              <Input placeholder={t("Fax")} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={t("Company Location")}
              name="companyLocation"
              rules={[{ required: true, message: t("Location is required") }]}
            >
              <Select
                placeholder={t("Select Company Location")}
                style={{ width: "100%", textAlign: "left" }}
                optionFilterProp="children"
                options={[
                  {
                    value: "Germany",
                    label: "Germany",
                  },
                  {
                    value: "Luxembourg",
                    label: "Luxembourg",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12} className="mt-4">
          <Col xs={24} sm={12}>
            <div
              style={{
                display: "flex",
                width: "400px",
                justifyContent: "flex-start",
              }}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <div>
                <ImgCrop
                  modalTitle={t("Logo Upload")}
                  rotationSlider
                  modalProps={{
                    okButtonProps: {
                      style: {
                        border: "1px solid #d9d9d9",
                        color: "rgba(0, 0, 0, 0.88)",
                      },
                    },
                  }}
                >
                  <Upload
                    listType="picture-card"
                    multiple={false}
                    showUploadList={false}
                    onChange={({ fileList, file }) => handleModalFileDrop(file)}
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: "11px",
                          fontWeight: "bold",
                          padding: ".2rem",
                        }}
                      >
                        {t("Company Logo")}
                      </div>
                    </div>
                  </Upload>
                </ImgCrop>
              </div>
              {modalFileList.length > 0 && (
                <div
                  className="flex items-center flex-wrap mt-2"
                  style={{ width: "300px" }}
                >
                  {modalFileList.map((file) => (
                    <div
                      key={file.uid}
                      className="flex items-center justify-between bg-gray-300 rounded-md p-1 m-1"
                    >
                      <img
                        src={URL.createObjectURL(file.originFileObj)}
                        alt="File"
                        className="h-16 w-16 rounded-md"
                      />
                      <p className="text-xs font-semibold mx-2">{file.name}</p>
                      <Button
                        className="flex items-center justify-center border-none"
                        danger
                        shape="circle"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleModalFileRemove(file);
                        }}
                      >
                        <BsTrash style={{ fontSize: "1.4rem", color: "red" }} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item label={t("Add Company Products")}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="dashed"
                  onClick={() => {
                    handleModal(true);
                  }}
                >
                  {t("Select")}
                </Button>

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
                  data={data}
                  companySetting={companySetting}
                  setProductFormValues={setProductFormValues}
                  productFormValues={productFormValues}
                  formRef={formRef}
                  triggerState={triggerState}
                  setTriggerState={setTriggerState}
                />
              </div>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Spin spinning={response.isLoading || loading}>
              <Button
                type=""
                className="bg-black !hover:bg-black text-white mt-5"
                htmlType="submit"
              >
                {t("Add Company")}
              </Button>
            </Spin>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default AddCompanyTab;
