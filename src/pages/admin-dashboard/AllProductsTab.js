import React, { useState, useEffect, useCallback } from "react";
import { Upload, message, Button, Modal, Input, Spin, Popconfirm } from "antd";
import { AllProductStyle } from "../../admin-style/AllProductUploadStyle";
import FileUpload from "../../global-functions/ImageGeneration";
import {
  useAddAllProductsMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetAllProductsApiQuery,
} from "../../apis/Admin";
import { useDispatch } from "react-redux";
import { errorPopup, showPopup } from "../../redux-slice/UserSliceAuth";
import useUpdateImageCustomHook from "../../global-functions/useUpdateImageCustomHook";
import useCustomGenerateUrls from "../../global-functions/useUpdateImageCustomHook";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const { Search } = Input;
const { Dragger } = Upload;

function AllProductsTab() {
  const {t}=useTranslation();
  const [addProduct, res] = useAddAllProductsMutation();
  const [updateProduct, resp] = useEditProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const { data, isLoading, refetch } = useGetAllProductsApiQuery();
  const [draggerFileList, setDraggerFileList] = useState([]);
  const [modalFileList, setModalFileList] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [productList, setProductList] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProductName, setNewProductName] = useState("");
  const [tempProducts, setTempProducts] = useState([]);
  const [loadApi, setLoadApi] = useState(false);
  const [urls, setUrl] = useState([]);

  // custom hook for generating image links
  const [loadingApi, setLoadingApi] = useState(false);
  const { generateLinks, loading } = useCustomGenerateUrls();

  const dispatch = useDispatch();

  const productNameChange = (file, value) => {
    const filterFile = draggerFileList.filter((f) => f.uid === file.uid)[0];
    filterFile.name = value;
    const removeSelectedFile = draggerFileList.filter(
      (f) => f.uid !== file.uid
    );
    const sortedData = sortData([filterFile, ...removeSelectedFile]);
        // setProductList(sortedData)
    setDraggerFileList((prev) => sortedData);
  };
  const onSearch = (values) => {
    const searchProducts = globalFunctions.searchContacts(data, values);
    setProductList(searchProducts);
  };
  const handleDraggerFileDrop = (files) => {
    const getData = dataIndex(files);
    const sortedData = sortData(getData);
    // setProductList(sortedData)
    setDraggerFileList(sortedData);
    setIsSubmitDisabled(false);
  };

  const handleDraggerFileRemove = (file) => {
    const updatedFileList = draggerFileList.filter((f) => f.uid !== file.uid);
    setDraggerFileList(updatedFileList);
    setIsSubmitDisabled(updatedFileList.length === 0);
  };

  const handleModalFileDrop = (files) => {
    setModalFileList([...files]);
    // handleUpload([...files])
  };

  const handleModalFileRemove = (file) => {
    const updatedFileList = modalFileList.filter((f) => f.uid !== file.uid);
    setModalFileList(updatedFileList);
  };

  const handleProductSubmit = () => {
    const newProducts = draggerFileList.map((file) => ({
      id: file.uid,
      image: URL.createObjectURL(file.originFileObj),
      name: file.name,
    }));

    setLoadApi(true);

    setTempProducts(newProducts);
    setIsSubmitDisabled(true);

    // api will run here
  };

  const handleProductDelete = (productId) => {
    deleteProduct(productId)
      .unwrap()
      .then((res) => {
        dispatch(showPopup({ state: true, message: t("Product Deleted") }));
        setUrl([]);




        const filterRemove = productList.filter((val) => val._id !== productId);
        setProductList((prev) => [...filterRemove]);
        setEditModalVisible(false);
      })
      .catch((error) => {
        dispatch(
          errorPopup({
            state: true,
            message: `Products not ceated due to ${error}`,
          })
        );
      });
  };

  const handleEditModalOpen = (product) => {
    setEditProduct(product);
    setNewProductName(product.productName);
    setModalFileList([]);
    setEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
  };

  const handleNameUpdate = (e) => {
    setNewProductName(e.target.value);
  };

  const handleProductUpdate = async () => {
    let updatedProduct = productList.filter(
      (val) => val._id === editProduct._id
    )[0];

    if (modalFileList.length) {
      let imageUrls = await generateLinks(modalFileList);
      updatedProduct = {
        productName: newProductName,
        productImage: imageUrls[0],
      };
    } else {
      updatedProduct = {
        productName: newProductName,
        productImage: editProduct.productImage,
      };
    }

    updateProductApi(updatedProduct);
  };

  const updateProductApi = (values) => {
    updateProduct({ payload: values, id: editProduct._id })
      .unwrap()
      .then((res) => {
        dispatch(showPopup({ state: true, message: t("Updated Products") }));
        setModalFileList([]);

        let updatedProducts = productList.filter((product) => {
          return product._id !== res.result._id;
        });

        setProductList([res.result, ...updatedProducts]);
        setEditModalVisible(false);
      })
      .catch((error) => {
        dispatch(
          errorPopup({
            state: true,
            message: `Products not created due to ${error}`,
          })
        );
      });
  };
  const addProducts = () => {
    let values = urls.map((val) => {
      return {
        productName: val.productName,
        productImage: val.productImage,
      };
    });
    addProduct(values)
      .unwrap()
      .then((res) => {
        dispatch(showPopup({ state: true, message: t("Products Created") }));
        setUrl([]);
        let data = [...res.result, ...productList];
        const getData = dataIndex(data);
        const sortedData = sortData(getData);
        setProductList(sortedData);
      })
      .catch((error) => {
        dispatch(
          errorPopup({
            state: true,
            message: `Products not created due to ${error}`,
          })
        );
      });
  };
  const dataIndex = (data) => {
    return data.map((val, i) => ({ ...val, SNO: i }));
  };
  const sortData = (data) => {
    return data.sort((a, b) => a.SNO - b.SNO);
  };
  const productApiCall=async()=>{
    const triggerDataApi=await refetch()
    if (triggerDataApi.data) {
      setProductList(triggerDataApi.data);
      setLoadingApi(false)
    }
  }
  useEffect(() => {
    setLoadingApi(true)
    productApiCall();
  }, [isLoading]);

  useEffect(() => {
    if (urls.length && !modalFileList.length) {
      addProducts();
    }
  }, [urls]);

  return (
    <AllProductStyle>
      <FileUpload
        setTempProducts={setTempProducts}
        tempProducts={tempProducts}
        urls={urls}
        draggerFileList={draggerFileList}
        setDraggerFileList={setDraggerFileList}
        productList={productList}
        setLoadApi={setLoadApi}
        setUrl={setUrl}
        loadApi={loadApi}
      />

      <h1 className="text-2xl font-semibold">{t("Upload Products")}</h1>
      <div className="flex flex-col">
        <Dragger
          className="border-dashed border-gray-400 rounded-lg text-center"
          accept=".jpg,.png,.pdf"
          fileList={draggerFileList}
          customRequest={() => { }}
          onChange={({ fileList }) => handleDraggerFileDrop(fileList)}
          multiple
        >
          {draggerFileList.length === 0 && (
            <div>
              <p className="text-sm font-semibold">
              {t("Drag and drop your files here   (Max. 10MB)")}
              </p>
            </div>
          )}
          {draggerFileList.length > 0 && (
            <div className="flex items-center flex-wrap">
              {draggerFileList.map((file) => (
                <div
                key={file.uid}
                className="flex items-center justify-between bg-gray-300 rounded-md p-1 m-1"
                onClick={(event) => event.stopPropagation()} // Stop event propagation here
              >
                <img
                  src={URL.createObjectURL(file.originFileObj)}
                  alt="File"
                  className="h-12 w-12 rounded-md"
                />
            
                <Input
                  className="text-xs font-semibold mx-2"
                  value={file.name}
                  onChange={(e) => {
                    productNameChange(file, e.target.value);
                  }}
                />
                <Button
                  className="flex items-center justify-center border-none"
                  danger
                  shape="circle"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDraggerFileRemove(file);
                  }}
                >
                  <BsTrash style={{ fontSize: "1.4rem" }} />
                </Button>
              </div>
              ))}
            </div>
          )}
        </Dragger>
        <div className="flex justify-center space-x-4 mt-2">
          <Button
            type=""
            className="bg-black text-white hover:bg-black"
            disabled={loadApi || !draggerFileList.length}
            onClick={handleProductSubmit}
          >
            {loadApi ? t("loading")+"....." : t("Upload Files")}
          </Button>
        </div>
      </div>

      <Spin
        spinning={isLoading || loadingApi}
        size="large"
        style={{ marginTop: `${isLoading ? "8rem" : "3rem"}` }}
      >
        <div className={`mt-4`}>
          <div
            className="mb-6 mt-3 flex flex-end"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Search
              size="large"
              style={{
                width: 400,
              }}
              placeholder={t("search product")}
              onSearch={onSearch}
              onChange={(e) => {
                onSearch(e.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-6 gap-10">
            {productList.map((product) => (
              <div
                key={product._id}
                className="bg-gray-200 p-4 rounded-lg relative"
              >
                <div className="absolute top-0 right-0 p-1">
                  <Popconfirm
                    title={t("Delete the product")}
                    description={t("Are you sure to delete this product?")}
                    okText={<p style={{ color: "black" }}>{t("Yes")}</p>}
                    cancelText={t("No")}
                    onConfirm={() => handleProductDelete(product._id)}
                  >
                    <Button type="" shape="square" className="bg-white custom-button" style={{ padding: 0 }}>
                      <BsTrash style={{ fontSize: '1.4rem', color: 'red' }} />
                    </Button>



                  </Popconfirm>
                </div>
                <img
                  src={product?.productImage}
                  alt="Product"
                  className="h-34 w-full rounded-md mb-2 imageSize"
                />
                <p className="text-sm text-center font-semibold product-name">
                  {t(product?.productName)}
                </p>
              </div>

            ))}
          </div>
        </div>
      </Spin>

      <Modal
        title="Edit Product"
        open={editModalVisible}
        onCancel={handleEditModalClose}
        footer={[
          <Button key="cancel" onClick={handleEditModalClose}>
            {t("Cancel")}
          </Button>,
          <Button
            disabled={loading}
            key="update"
            type="primary"
            style={{ backgroundColor: "black" }}
            onClick={handleProductUpdate}
          >
            {loading ? <Spin /> : t("Update")}
          </Button>,
        ]}
      >
        <div className="flex items-center mb-4">
          <label className="mr-2">{t("Product Name")}:</label>
          <Input value={newProductName} onChange={handleNameUpdate} />
        </div>
        <AllProductStyle className="flex items-center">
          <label className="mr-2">{t("Upload File")}:</label>
          <Upload
            fileList={modalFileList}
            customRequest={() => {}}
            onChange={({ fileList }) => handleModalFileDrop(fileList)}
          >
            <Button>{t("Select File")}</Button>
          </Upload>
        </AllProductStyle>
        {modalFileList.length > 0 && (
          <div className="flex items-center flex-wrap mt-2">
            {modalFileList.map((file) => (
              <div
                key={file.uid}
                className="flex items-center justify-between bg-gray-300 rounded-md p-1 m-1"
              >
                <img
                  src={URL.createObjectURL(file.originFileObj)}
                  alt="File"
                  className="h-12 w-12 rounded-md"
                />
                <p className="text-xs font-semibold mx-2">{t(file.name)}</p>
                <Button
                  className="flex justify-center mt-2"
                  danger
                  shape="circle"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleModalFileRemove(file);
                  }}
                >
                  <BsTrash style={{ fontSize: "1.2rem" }} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </AllProductStyle>
  );
}

export default AllProductsTab;