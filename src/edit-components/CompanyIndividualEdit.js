import { Button, Form, Input, Spin, Table } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { adminEditGlobalFunctions } from "../global-functions/adminEditGlobalFunction";
import {
  useAddCompanyProductsByIdMutation,
  useDeleteCompanyProductByIdMutation,
  useEditCompanyMutation,
  useGetAllProductsApiQuery,
  useGetProductsByCompanyIdQuery,
  useUpdateCompanyProductsByCompanyIdMutation,
} from "../apis";
import { errorPopup, showPopup } from "../redux-slice/UserSliceAuth";
import { useDispatch } from "react-redux";
import useCustomGenerateUrls from "../global-functions/useUpdateImageCustomHook";
import useGlobalApi from "../global-functions/useGlobalApi";
import ProductsModal from "../components/products-modal/ProductsModal";
import { globalFunctions } from "../global-functions/GlobalFunctions";
import { companySettingsAction, selectedCompany } from "../redux-slice/AdminSliceReducer";
import { useTranslation } from "react-i18next";

function CompanyIndividualEditComponent({
  selected,
  setCompany,
  company,
  // setSelected,
}) {
  const {t}=useTranslation()
  const [editCompany, response] = useEditCompanyMutation();
  const [updateCompanyProducts, updateProductResponse] =
    useUpdateCompanyProductsByCompanyIdMutation();
  const productGetApi = useGetAllProductsApiQuery();
  const [deleteProductApi,deleteApiRes]=useDeleteCompanyProductByIdMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iscompanyProductModalOpen, setIsCompanyProductModalOpen] =
    useState(false);
    const [triggerState,setTriggerState]=useState(false)
  // for add
  const [products, setProducts] = useState([]);
  // for update
  const [companyProducts, setCompanyProducts] = useState([]);

  const companyProductsData = useGetProductsByCompanyIdQuery({
    companyId: selected.record?._id,
  });
  const [addCompanyProducts, addCompanyProductsRes] =
    useAddCompanyProductsByIdMutation();
  const [companySetting, setCompanySetting] = useState({
    pricingStatus: selected?.record?.pricingStatus,
    budgetStatus: selected?.record?.budgetStatus,
    companyId: selected?.record?._id,
  });

  const [selectedProduct, setSelectedProduct] = useState([]);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [editingRow, setEditingRow] = useState({
    state: false,
    record: {},
    updatedValues: {},
    pricingStatus: selected.record.pricingStatus,
    budgetStatus: selected.record.budgetStatus,
  });
  const onFinish = (values) => {
  
  };
  const { generateLinks, loading } = useCustomGenerateUrls();

  const handleModal = (val) => {
    setIsModalOpen(val);
  };
  const companyProductHandleModal = (val) => {
    setIsCompanyProductModalOpen(val);
  };
  const formRef = useRef(null);

  const [modalFileList, setModalFileList] = useState([]);
  const handleCreateUrl = async () => {
    let imageUrls = await generateLinks(modalFileList);
    // setModalFileList([]);
    return imageUrls[0];
  };
  const setData = async (key, res) => {
    try {
      
      const row = await form.validateFields();
      const newData = [...company];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          budgetStatus: editingRow.budgetStatus,
          pricingStatus: editingRow.pricingStatus,
        });
      } else {
        newData.push(row);
      }
      setCompany((prev) => newData);
     

      dispatch(
        companySettingsAction({
          pricingStatus: res.result.pricingStatus,
          budgetStatus: res.result.budgetStatus,
          companyId: res.result._id,
        })
      );
      setEditingRow({
        state: false,
        record: res.result,
        pricingStatus: res.result.pricingStatus,
        budgetStatus: res.result.budgetStatus,
      });
      return newData;
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const handleSave = async (id) => {
    let values = await form.validateFields();
    if (modalFileList.length) {
      const url = await handleCreateUrl();
      values = { ...values, companyLogo: url };
    }
    if (editingRow.pricingStatus != undefined) {
      values = { ...values, pricingStatus: editingRow.pricingStatus };
    }
    if (editingRow.budgetStatus != undefined) {
      values = { ...values, budgetStatus: editingRow.budgetStatus };
    }

    const companyRes = await useGlobalApi.postApi(
      editCompany,
      values,
      editingRow.record._id,
      t("company data updated"),
      t("company data not updated due to some error"),
      dispatch
    );
   
    dispatch(selectedCompany(companyRes.result));
    dispatch(
      companySettingsAction({
        pricingStatus: companyRes.result.pricingStatus,
        budgetStatus: companyRes.result.budgetStatus,
        companyId: companyRes.result._id,
      })
    );
 
    companyRes && setData(id, companyRes);
    
    localStorage.setItem("selectedCompany",JSON.stringify(companyRes.result));
    setEditingRow((prev) => ({
      ...prev,
      state: false,
      record: companyRes.result,
      
    }));
  };
  const handleEdit = (record) => {
    form.setFieldsValue({
      companyName: "",
      companyEmail: "",
      companyFax: "",
      companyFax: "",
      companyPhone: "",
      pricingStatus: editingRow.pricingStatus,
      budgetStatus: editingRow.budgetStatus,
      ...record,
    });
    // setSelected({ isSelected: true, record: { ...record } });
    setEditingRow((prev) => ({
      ...prev,
      state: !prev.state,
      record: record,
    }));
  };
  const getSelectedProducts = () => {
    return selectedProduct.map((val) => {
      return {
        productImage: val.productImage,
        productName: val.productName,
        productSize: val.productSize ? val.productSize : "",
        productPrice: val.productPrice ? `${val.productPrice}` : 0,
        productQuantity: val.productQuantity ? val.productQuantity : 1,
      };
    });
  };
  const getSelectedProductsForUpdate = () => {
    return selectedProduct.map((val) => {
      return {
        productImage: val.productImage,
        productName: val.productName,
        productSize: val.productSize ? val.productSize : "",
        productPrice: val.productPrice ? `${val.productPrice}` : 0,
        productQuantity: val.productQuantity ? val.productQuantity : 1,
        _id:val._id
      };
    });
  };
const deleteCompanyProducts=async(id)=>{
 try{
  await  useGlobalApi.postApi(deleteProductApi,"",id,"Company Product Deleted","Failed To Delete Product",dispatch);

  const filterProducts= companyProducts.filter(val=>val._id !== id);
  setCompanyProducts(filterProducts); 
}catch(err){
  dispatch(errorPopup({state:true,message:t("some unknown issue")}))
 }

}
  //  add and edit product apis functions
  const AddNewProducts = async () => {
    const requiredFields = companySetting.budgetStatus ? ["productPrice"] : [];

    const validationResult = globalFunctions.validateData(
      selectedProduct,
      requiredFields
    );
    if (selectedProduct.length > 0 && validationResult.valid) {
      const productRes = await useGlobalApi.postApi(
        addCompanyProducts,
        getSelectedProducts(),
        selected.record._id,
        t("New Products Added  In Company"),
        t("Products Failed To Add"),
        dispatch
      );
      // productRes && setData(editingRow.record._id, productRes);
      // setProductValidated(true)
      handleModal(false);
      setSelectedProduct([])
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
  const productsSelected = async () => {
    const requiredFields = companySetting.budgetStatus ? ["productPrice"] : [];

    const validationResult = globalFunctions.validateData(
      selectedProduct,
      requiredFields
    );
    if (selectedProduct.length > 0 && validationResult.valid) {
      await useGlobalApi.postApi(
      updateCompanyProducts,
        getSelectedProductsForUpdate(),
        selected.record._id,
        t("product data updated"),
        t("product data not updated due to some error"),
        dispatch
      );
      // companyRes && setData(editingRow.record._id, companyRes);
      setIsCompanyProductModalOpen(false);
      setSelectedProduct([])
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
  const addProducts = async () => {
    handleModal(true);
    setSelectedProduct([])
    let tempData;
    try {
      if (!productGetApi.data) {
        const data = await productGetApi.refetch();
        tempData = data.data.products;
        setProducts(tempData);
      }
    } catch (err) {
      dispatch(errorPopup({ state: true, message: t("Plz Open Modal Again") }));
      handleModal(false);
    }
  };
  const selectedProducts = async () => {
    setIsCompanyProductModalOpen(true);
    let tempData;
    try {
      const data = await companyProductsData.refetch();
      tempData = data.data.products;
      setCompanyProducts(tempData);
    } catch (err) {
      dispatch(errorPopup({ state: true, message: t("Plz Open Modal Again") }));
      setIsCompanyProductModalOpen(false);
    }
  };
  const dataSetsOfModalOnToggleUpdate=(originalData)=>{
   return originalData.map(val=>{
      const foundedIndex= selectedProduct.findIndex(vals=>vals._id===val._id);
      if(foundedIndex>-1){
        return val=selectedProduct[foundedIndex];
      }else{
       return val;
      }
     })
  }
  const onPreview = async (file) => {
     if(file?.originFileObj){
      let src = file.url;
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
     }
  };
 
  const mergedColumns = adminEditGlobalFunctions
    .genericCompanyColumns(
      handleEdit,
      handleSave,
      editingRow,
      setEditingRow,
      "selected",
      true,
      modalFileList,
      setModalFileList,
      handleModal,
      addProducts,
      selectedProducts,
      setIsCompanyProductModalOpen,
      onPreview,t
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
            col.dataIndex === "pricingStatus"
              ? "pricingStatus"
              : col.dataIndex === "budgetStatus"
              ? "budgetStatus"
              : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: editingRow.state,
        }),
      };
    });

  useEffect(() => {
    if (companyProductsData?.data) {
      const filterCollectionFromData= dataSetsOfModalOnToggleUpdate(companyProductsData.data.products)
      setCompanyProducts(filterCollectionFromData);
      setSelectedProduct(prev=>[...prev])
    }
  }, [companyProductsData.isLoading,triggerState]);
  
  useEffect(() => {
    if (productGetApi?.data) {
      const filterCollectionFromData= dataSetsOfModalOnToggleUpdate(productGetApi.data)
      
    
      setProducts(filterCollectionFromData);
      setSelectedProduct(prev=>[...prev])
    }
  }, [productGetApi?.isLoading,triggerState]);

  useEffect(() => {
    dispatch(
      companySettingsAction({
        pricingStatus: selected?.record?.pricingStatus,
        budgetStatus: selected?.record?.budgetStatus,
        companyId: selected?.record?._id,
      })
    );
  }, []);
 const refrehData=()=>{
    
    setProducts()

 }
  return (
    <div>
      <h1 className="font-bold mt-5">{t("Company")}</h1>
      <Spin spinning={response.isLoading || loading}>
        <Form form={form} component={false}>
          <Table
            columns={mergedColumns}
            components={{
              body: {
                cell: adminEditGlobalFunctions.EditableCell,
              },
            }}
            dataSource={[selected?.record]}
            pagination={false}
            rowKey={(record) => {
              return record._id;
            }}
            className="mt-2"
          />
        </Form>
      </Spin>
      <ProductsModal
        open={isModalOpen}
        saveBtn={false}
        onOk={() => {
          AddNewProducts();
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
        data={productGetApi.data}
        companySetting={companySetting}
        formRef={formRef}
        triggerState={triggerState}
        setTriggerState={setTriggerState}
      />
      <ProductsModal
        open={iscompanyProductModalOpen}
        saveBtn={false}
        onOk={() => {
          productsSelected();
        }}

        onCancel={() => {
          companyProductHandleModal(false);
        }}
        deleteProducts={deleteCompanyProducts}
        products={companyProducts}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        type="companyAdd"
        editable={false}
        setProducts={setCompanyProducts}
        data={
          companyProductsData?.data?.products
            ? companyProductsData.data.products
            : []
        }
        companySetting={companySetting}
        formRef={formRef}
        onFinish={onFinish}
        form={form}
        
        modalTitle={`${company.companyName} ${t("Products")}`} // Use company name in the title

       triggerState={triggerState}
       setTriggerState={setTriggerState}
      />
    </div>
  );
}

export default CompanyIndividualEditComponent;
