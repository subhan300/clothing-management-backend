import { useEffect, useState } from "react";

import { Row, Col, Image, Button, Modal, Input, Switch, Spin } from "antd";
// import {useDispatch} from 'react-redux';
import "./product.css";
import useProductSelection from "./useProductSelection";
import { ProductDrawerStyle, ProductStyle } from "./ProductDrawerStyle";
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';

import Product from "./Product";
import ShowSelectedProduct from "./ShowSelectedProduct";
import useGlobalApi from "../../global-functions/useGlobalApi";
import { useDispatch } from "react-redux";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { errorPopup, showPopup } from "../../redux-slice/UserSliceAuth";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";
const { Search } = Input;

function ProductsModal(props) {
  const {t}=useTranslation()
  const {
    type,
    saveBtn,
    formRef,
    selectedProduct,
    setSelectedProduct,
    editable,
    setProducts,
    data,
    companySetting,
    deleteProducts,
    showSize,
    modalTitle, // Add this line
    setTriggerState,
   triggerState
  } = props;

  const { toggleProductSelection, isProductSelected } = useProductSelection(
    selectedProduct,
    setSelectedProduct,
    setProducts,
    data,
    props.products,
    setTriggerState,
    triggerState
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const dispatch = useDispatch();

  const onSearch = debounce((values) => {
    const searchProducts = globalFunctions.searchContacts(data, values);
    setProducts(searchProducts);
  }, 200);

  const openDrawer = (image) => {
    if (isProductSelected(image, selectedProduct)) {
      setSelectedImage(image);
      setShowDrawer(true);
    } else {
      setSelectedProduct((prev) => [...prev, image]);
      setShowDrawer(true);
      setSelectedImage(image);
    }
  };
  const handleRemoveSelectedProduct = () => {
    setSelectedProduct([]);
    setShowDrawer(false);
  };
  const closeDrawer = () => {
    setSelectedImage(null);
    setShowDrawer(false);
  };
  const handleUpdateCancel = () => {
    setEditProduct(false);
    setProducts(data);
  };
  const productProps = {
    type,
    showSize,
    handleUpdateCancel,
    formRef,
    isProductSelected,
    selectedProduct,
    openDrawer,
    editable,
    editProduct,
    setSelectedProduct,
    setProducts,
    pricing: companySetting.pricingStatus,
    selectedImage,
    deleteProducts,

    saveBtn,
  };
  const ShowSelectedProductProps = {
    selectedImage,
    closeDrawer,
    showDrawer,
    saveBtn,
  };

  function getProductById(products, productId) {
    const filteredProducts = products.filter((item) => item._id === productId);
    return filteredProducts.length > 0 ? filteredProducts[0] : null;
  }
  const handleSave = () => {

    const validationResult = globalFunctions.validateData(
      selectedProduct,
      true
    );
    if (!validationResult.valid) {
      return dispatch(
        errorPopup({ state: true, message: t("Fill All Products Data") })
      );
    }
    const UpdatedProduct = getProductById(selectedProduct, selectedImage?._id);
    setSelectedImage(UpdatedProduct);
    dispatch(showPopup({ state: true, message: t("Product Updated") }));
    setEditProduct(false);
  };

  useEffect(() => {
    if (showDrawer && !isProductSelected(selectedImage, selectedProduct)) {
      setShowDrawer(false);
      setSelectedImage(null);
    }
  }, [selectedProduct]);

  return (
    <div>
      <Modal
        className="!relative"
        title={modalTitle ? modalTitle : t("All Products")} // Add the conditional rendering here
        open={props.open}
        onCancel={props.onCancel}
        width={1000}
        style={{
          top: 60,
        }}
        footer={[
          <Button
            key={1}
            onClick={props.onOk}
            className="bg-black text-white hover:bg-black"
          >
            {selectedProduct.length ? t("Save") : t("Select")}
          </Button>,
        ]}
      >
        <ProductDrawerStyle>
          <div
            className="flex flex-end mb-4"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Search
              size="medium"
              stylefd={{
                width: 400,
              }}
              placeholder={t("search product")}
              onSearch={onSearch}
              onChange={(e) => {
                onSearch(e.target.value);
              }}
            />
          </div>
          {editable && (
            <div
              style={{ display: "flex", justifyContent: "flex-end" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {!editProduct ? (
                <EditOutlined
                  onClick={() => {
                    setEditProduct(true);
                  }}
                  style={{
                    fontSize: "22px",
                    position: "absolute",
                    top: "20px",
                    right: "3rem",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <div className="edit_btn_div">
                  <p
                    onClick={() => {
                      handleUpdateCancel();
                    }}
                  >
                    {t("cancel")}
                  </p>
                  {saveBtn && (
                    <p
                      onClick={() => {
                        handleSave();
                      }}
                    >
                      {t("save")}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <Row
            gutter={[16, 16]}
            className="products_collection    max-h-[550px]"
          >
            {/* <Spin  spinning={!data?.length} style={{marginLeft:"18rem"}}>
</Spin> */}
            {props.products.map((product, ind) => (
              <Col key={product._id} xs={24} sm={12} md={5}>
                <div style={{ position: 'relative' }}>
                  <div onClick={() => toggleProductSelection(product)}>
                    <Product {...productProps} product={product} ind={ind} />
                  </div>
                  <Switch
                    checked={isProductSelected(product, selectedProduct)}
                    onChange={() => toggleProductSelection(product)}
                    checkedChildren={<CheckOutlined />}

                    style={{
                      position: "absolute",
                      background: isProductSelected(product, selectedProduct) ? "green" : "grey",
                      top: '10px',
                      right: '2px',
                      transform: 'scale(0.7)', // scales the switch to 80% of its original size
                    }}
                  />
                </div>
              </Col>
            ))}


          </Row>

          {showDrawer && selectedImage && (
            <ShowSelectedProduct {...ShowSelectedProductProps} />
          )}
        </ProductDrawerStyle>
        {/* </Spin> */}
      </Modal>
    </div>
  );
}

export default ProductsModal;