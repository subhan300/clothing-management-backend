import React, { useContext, useEffect, useState } from "react";
import { Check } from "../assets/images";
import { showPopup, errorPopup } from "../redux-slice/UserSliceAuth";
import { useDispatch } from "react-redux";
import QuantityInput from "./quantity-input/QuantityInput";
import DrawerQty from "./quantity-input/DrawerQty";
import DrawerProductSize from "./drawer-product-size/DrawerProductSize";
import { uid } from "uid";
import { useTranslation } from "react-i18next";
import { I18nContext } from "../translation-wrapper/I8nProvider";
import { globalFunctions } from "../global-functions/GlobalFunctions";

function ProductDrawer(props) {
  const { data, error, isLoading } = props.data2;
  const { selectedLanguage } = useContext(I18nContext);

  const {
    addMoreProduct,
    updateProductQuantity,
    pricingStatus,
    selectedEmployee,
    selectedProductsMarked,
    selectedProductForOrder,
    quantityCollection,
    setAllProductEmployeeSizeCollection,
    allProductEmployeeSizeCollection,
  } = props;
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [allProduct, setAllProducts] = useState([]);

  const dispatch = useDispatch();
  const role = localStorage.getItem("role");

  const selectImage = (index) => {
    // const isEmployeeProducts=  selectedProductsMarked.some(val=>val.empId===selectedEmployee.id)
    if (selectedImage === index) {
      setSelectedImage(null);
    } else {
      setSelectedImage(index);
    }
  };
  const checkIsProductSelected = (productId) => {

    const isProductSelected = selectedProductsMarked.filter(
      (val) => val.productId == productId && val.empId === selectedEmployee.id
    );

    if (isProductSelected.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const selectedProduct = (item, isProductRemove) => {
    addMoreProduct(item, isProductRemove);
    if (isProductRemove) {
      dispatch(showPopup({ state: true, message: t("Product removed") }));
    } else {
      dispatch(showPopup({ state: true, message: t("Product Added") }));
    }
  };

  const checkIsProductSelectedOfProductDrawer = (productId, empId) => {
    let isProductSelected = [];
    let empFilter = selectedProductForOrder.filter(
      (val) => val.empId === empId
    );
    if (empFilter.length > 0) {
      isProductSelected = empFilter[0]?.products?.filter(
        (val) => val._id == productId
      );
    }

    if (isProductSelected.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const drawerProductSizeProps = {
    selectedEmployee,
    setAllProductEmployeeSizeCollection,
    allProductEmployeeSizeCollection,
  };
  useEffect(() => {
    if (data != undefined) {
      setAllProducts(data.products);
    }
  }, [isLoading]);

  return (
    <div
      className={`${
        props.show ? "left-0" : "left-[-100%]"
      } fixed top-0 flex z-50 justify-center items-center h-screen w-screen transition-all duration-500 ease-in-out bg-[rgba(0,0,0,.6)]`}
    style={{width:role==="employee"?"82vw":"85vw",backgroundColor:"none"}}
    >
      <div className="relative overflow-scroll   bg-white h-[90vh] w-[90vw] rounded-lg shadow-2xl p-2">
      <div className="my-5 ml-5 mr-2 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t("All Company Products")}</h1>
          <span
            className="material-symbols-rounded font-extrabold cursor-pointer"
            onClick={() => props.setShow(!props.show)}
          >
            close
          </span>
        </div>
        {/* removed scroll from here */}
        <div className="relative grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 2xl:flex flex-wrap  justify-center mx-auto max-h-[80vh]">
          {isLoading ? (
            <h1>{t("Loading")}....</h1>
          ) : (
            allProduct.map((item, index) => (
              <div
                key={item._id}
                className="relative max-h-15rem max-w-xs rounded-lg m-2 flex justify-center items-center overflow-hidden"
              >
                {selectedImage === index && (
                  <div className="absolute top-2 right-2">
                    <img src={Check} alt="" />
                  </div>
                )}
                <img
                  src={item.productImage}
                  className={`h-full w-full cursor-pointer select-none imageSize ${
                    selectedImage === index
                      ? "border-2 border-blue-500 ring-1 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => selectImage(index)}
                  alt=""
                />
                <div
                  className={`w-full h-full absolute gap-2 top-0 left-0 bg-gray-900 opacity-0 hover:opacity-[1] flex flex-col  items-center rounded-md transition-all duration-500 ease-in-out ${
                    checkIsProductSelected(item._id) ? "bg-green-500" : ""
                  }`}
                >
                  <h1 className="text-white mt-3 text-left " style={{width:"132px",fontSize:"14px"}}>{item.productName}</h1>
                  {pricingStatus?<h1 className="text-white "  style={{width:"132px",fontSize:"14px"}}>{t("price")} :<span className=""> {globalFunctions.formatPrice(item.productPrice) ?? globalFunctions.formatPrice(0)}</span></h1>:""}
                <div style={{width:selectedLanguage==="en"?"132px":"140px"}}>
                <DrawerProductSize {...drawerProductSizeProps} product={item} />
                </div>
                 
                  <div className=" rounded-md"  style={{width:selectedLanguage==="en"?"142px":"158px"}}>
                    <span className=" flex text-white text-center font-semibold px-2" style={{fontSize:"14px"}}>
                      {t("Qty")} :
                      <div className="flex items-center ml-3">
                        <DrawerQty
                          initialQty={1}
                          updateProductQuantity={updateProductQuantity}
                          productId={item._id}
                          rowId={selectedEmployee}
                          checkIsProductSelected={checkIsProductSelectedOfProductDrawer}
                          selectedProductForOrder={selectedProductForOrder}
                          isDrawerProduct={true}
                          quantityCollection={quantityCollection}
                          selectedEmployee={selectedEmployee}
                          inputClassName="w-full h-10 px-2 text-center border border-gray-300 rounded-md"
                          buttonClassName="w-12 h-10 flex justify-center items-center text-white bg-blue-500 rounded-md"
                          buttonIncrementClassName="text-white"
                          buttonDecrementClassName="text-white"
                        />
                      </div>
                    </span>
                  </div>

                  <div className="absolute bottom-2 flex justify-center items-center w-full h-[3rem] rounded-lg">
                    {checkIsProductSelected(item._id) ? (
                      <button
                        className="w-full py-1.5 rounded-l-lg text-center bg-red-500 text-white"
                        onClick={() => {
                          selectedProduct(item, true);
                        }}
                      >
                        {t("Remove Product")}
                      </button>
                    ) : (
                      <button
                        className="w-full py-1.5 rounded-l-lg text-center bg-green-500 text-white"
                        onClick={() => {
                          selectedProduct({ ...item, productQuantity: item.productQuantity ?? 1 }, false);
                        }}
                      >
                        {t("Add Product")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDrawer;
