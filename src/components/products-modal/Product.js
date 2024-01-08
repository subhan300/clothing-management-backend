import React, { useEffect } from "react";
import { CustomInput, ProductStyle } from "./ProductDrawerStyle";
import { Button, Form, Input, Popconfirm, Radio, Select } from "antd";
import debounce from "lodash.debounce";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { BsTrash } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { startTransition } from 'react';
import { NumericFormat } from 'react-number-format';

const { formatPrice } = globalFunctions;
function Product(props) {
  const { t } = useTranslation();
  const {
    formRef,
    type,
    handleUpdateCancel,
    setSelectedProduct,
    setProducts,
    selectedProduct,
    openDrawer,
    isProductSelected,
    pricing,
    product,
    ind,
    editable,
    showSize,
    editProduct,
    selectedImage,
    deleteProducts,
    saveBtn,
  } = props;
  // const setProductData = (setState, product, value, name) => {
  //   debugger
  //   return setState((prevData) => {
  //     const index = prevData.findIndex((item) => item?._id === product?._id);
  //     prevData[index] = { ...prevData[index], [name]: value };
  //     return [...prevData];
  //   });
  // }
  const setProductData = (setState, product, value, name) => {
    return setState((prevData) => {
      const updatedData = [...prevData]; // Clone the prevData array
      const index = updatedData.findIndex((item) => item?._id === product?._id);
      updatedData[index] = { ...updatedData[index], [name]: value };
      return updatedData;
    });
  };

  const handleChange = (product, value, name) => {

    setProductData(setProducts, product, value, name);
    // setProductData(setSelectedProduct, product, value, name);
    startTransition(() => {
      setProductData(setSelectedProduct, product, value, name);
    });
  };

  const isSelectedDrawerProduct = (product) => {
    return product?._id === selectedImage?._id;
  };
  const onFinish = (values) => { };
  console.log("product", product)
  return (
    <div
      key={ind}
      className={`${isProductSelected(product, selectedProduct)
          ? "content_selected"
          : "content_not_selected"
        } product_div relative cursor-pointer  max-h-[15rem] max-w-xs 
      rounded-lg m-1
      `}
    >
      <div>
        <img
          src={product.productImage}
          className={`h-full    product_image w-full cursor-pointer select-none ${""}`}
          alt=""
        />
      </div>

      <ProductStyle
        productSelected={isProductSelected(product, selectedProduct)}
        className={` ${isProductSelected(product, selectedProduct)
            ? "content_selected"
            : "content_not_selected"
          } 
         w-full product_content h-full 
        
        mt-1
      `}
      >
        <Form onFinish={onFinish} ref={formRef} initialValues={{ ...product }}>
          <div
            style={{ width: "100%" }}
            onClick={(e) => {
              (editProduct || type === "companyAdd") && e.stopPropagation();
            }}
          >
            {editProduct || type === "companyAdd" ? (
              <>

                <CustomInput
                  placeholder={t("Name")}
                  className="input"
                  value={product.productName}
                  style={{ fontSize: "12px" }} // or use a specific size like '12px'
                  onChange={(e) => {
                    handleChange(product, e.target.value, "productName");
                  }}
                  disabled={!isProductSelected(product, selectedProduct)}
                />


                {showSize ? (
                  // <Form.Item
                  //   name={t("productSize")}
                  //   rules={[
                  //     { required: false, message: t("Size is required") },
                  //   ]}
                  // >
                  <CustomInput
                    placeholder={t("Size")}
                    className="input"
                    value={product.productSize}
                    style={{ textTransform: "uppercase" }} // Add this line
                    disabled={!isProductSelected(product, selectedProduct)}
                    onChange={(e) => {
                      handleChange(product, e.target.value, "productSize");
                    }}
                  />
                  // {/* </Form.Item> */}
                ) : (
                  ""
                )}

                {pricing ? (
                  <Form.Item
                  // name={t("productPrice")}
                  // rules={[
                  //   { required: true, message: t("Price is required") },
                  // ]}
                  >
                    <NumericFormat
                      value={product?.productPrice}
                      onValueChange={(values) => {
                        handleChange(product, values.floatValue, "productPrice");
                      }}
                      decimalScale={2}
                      fixedDecimalScale
                      thousandSeparator='.'
                      decimalSeparator=','
                      suffix={' €'}
                      placeholder={t("Price")}
                      disabled={!isProductSelected(product, selectedProduct)}
                      className="input fixed-width-input input-white-bg"
                      customInput={Input} // Add this line, it makes the NumberFormat wrapper act like the default AntD Input.
                    />
                  </Form.Item>
                ) : (
                  ""
                )}

                {type !== "companyAdd" ? (
                  // <Form.Item
                  //   name="productQuantity"
                  //   rules={[
                  //     { required: true, message: t("Quantity is required") },
                  //   ]}
                  // >
                  <CustomInput
                    placeholder={t("Quantity")}
                    // className="input"
                    value={product.productQuantity}
                    disabled={!isProductSelected(product, selectedProduct)}
                    onChange={(e) => {
                      handleChange(
                        product,
                        e.target.value,
                        "productQuantity"
                      );
                    }}
                  />
                  // </Form.Item>
                ) : (
                  ""
                )}
              </>
            ) : (
              <div className="content_show_only">
                <h1 className="product_text">{product.productName}</h1>

                {showSize ? (
                  <>
                    <h1 className="product_text">
                      {t("Size")} : {product?.productSize}
                    </h1>
                    {/* <h1 className="product_text">
                      Quantity :{product?.productQuantity}
                    </h1> */}
                    <h1 className="product_text">
                      {t("Price")} : {formatPrice(product?.productPrice)}
                    </h1>
                  </>
                ) : (
                  ""
                )}
              </div>
            )}
            {deleteProducts && (
              <Popconfirm
                title={
                  <div>
                    <p>{t("This will Delete Product Permanently")}</p>
                  </div>
                }
                okButtonProps={{ style: { background: "red" } }}
                okText={<p>{t("Yes")}</p>}
                cancelText={<p style={{ color: "black" }}>{t("Cancel")}</p>}
                onConfirm={() => {
                  deleteProducts(product._id);
                }}
              >
                <div
                  style={{
                    background: "white", // change this to your desired background color BsTrash Icon/delete
                    borderRadius: "20%", // if you want a round background
                    display: "inline-flex", // to help center the icon
                    justifyContent: "center",
                    alignItems: "center",
                    width: "1.5em", // adjust to suit your needs
                    height: "1.7em", // adjust to suit your needs
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                  }}
                >
                  <BsTrash
                    style={{
                      fontSize: "1.4rem",
                      color: "red",
                    }}
                  />
                </div>
              </Popconfirm>
            )}
          </div>
        </Form>
      </ProductStyle>
    </div>
  );
}

export default Product;
