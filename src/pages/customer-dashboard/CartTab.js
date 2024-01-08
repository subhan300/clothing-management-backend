import React, { useState, useEffect, useContext } from "react";
import { p1 } from "../../assets/images/index";
import { useAddNewOrderMutation } from "../../apis/companyManager/index";
import { showPopup, errorPopup } from "../../redux-slice/UserSliceAuth";
import { useDispatch, useSelector } from "react-redux";
import QuantityInput from "../../components/quantity-input/QuantityInput";
import { useTranslation } from "react-i18next";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { I18nContext } from "../../translation-wrapper/I8nProvider";
import { Spin } from "antd";
const { formatPrice } = globalFunctions;

function CartTab() {
  const { t } = useTranslation();
  const { selectedLanguage } = useContext(I18nContext);
  const [addNewOrder, response] = useAddNewOrderMutation();
  const [comment, setComment] = useState(t("Write any message...")); // Update the initial state with the translation
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const getAdminReduxStoreData = useSelector((val) => val.admin);
  const dispatch = useDispatch();

  const orderBodyConvert = (cartProducts) => {
    const companyId = JSON.parse(localStorage.getItem("user"))?.result
      ?.companyId;
    const companyName = JSON.parse(localStorage.getItem("user"))?.result
      ?.companyName;
    const managerName = JSON.parse(localStorage.getItem("user"))?.result?.name;
    const managerId = JSON.parse(localStorage.getItem("user"))?.result?._id;

    return cartProducts.map((val) => {
      let quantity = 0;
      let productsAccess = val.products;
      let updatedArrayOfProductsWithAllRequiredFields = [];

      let total = productsAccess.map((valueP) => {
        updatedArrayOfProductsWithAllRequiredFields.push({
          ...valueP,
          productQuantity: valueP?.productQuantity ?? 1,
          productSize: valueP?.productSize?.toUpperCase() ?? " ",
        });
        quantity += valueP.productQuantity ? Number(valueP.productQuantity) : 1;
        return (
          (valueP.productPrice ? valueP.productPrice : 0) *
          (valueP.productQuantity ? valueP.productQuantity : 1)
        );
      });

      total = total.reduce(
        (previousScore, currentScore, index) => previousScore + currentScore,
        0
      );

      return {
        employeeId: val.empId,
        employeeProducts: updatedArrayOfProductsWithAllRequiredFields,
        companyName,
        name: managerName,
        employeeName: val.row.name,
        bill: total,
        quantity: quantity ? quantity : 1,
        companyId: companyId,
        comment: comment === t("Write any message...") ? "" : comment,
        managerEmail: val.managerEmail,
        employeeEmail: val.employeeEmail,
        role: "manager",
        managerId,
        pricingStatus: getAdminReduxStoreData.companySetting.pricingStatus,
        language: selectedLanguage,
      };
    });
  };
  const createOrder = () => {
    setLoading(true);

    let orderData = orderBodyConvert(cartProducts);

    if (orderData.length > 0) {
      addNewOrder(orderData)
        .unwrap()
        .then((res) => {
          dispatch(
            showPopup({ state: true, message: t("Order successfully created") })
          );

          setComment(" ");
          localStorage.removeItem("addToCart");
          setCartProducts([]);
        })
        .catch((error) => {
          if (error.data.message) {
            setLoading(false);
            return dispatch(
              errorPopup({ state: true, message: `${t(error.data.message)}` })
            );
          } else {
            setLoading(false);
            return dispatch(
              errorPopup({
                state: true,
                message: t(`Refresh Page and try again`),
              })
            );
          }
        });
    } else {
      setLoading(false);
      dispatch(errorPopup({ state: true, message: t("Add Item First") }));
    }
  };
  const removeCartItem = (id) => {
    let getLocalStorageCartData = JSON.parse(localStorage.getItem("addToCart"));
    if (getLocalStorageCartData != null) {
      let RemoveItem = getLocalStorageCartData.filter(
        (val) => val.empId !== id
      );
      localStorage.setItem("addToCart", JSON.stringify(RemoveItem));
      setCartProducts(RemoveItem);
    }
  };
  useEffect(() => {
    let getLocalStorageCartData = JSON.parse(localStorage.getItem("addToCart"));

    if (
      getLocalStorageCartData != undefined ||
      getLocalStorageCartData != null
    ) {
      setCartProducts(getLocalStorageCartData);
    }
  }, []);
  useEffect(() => {
    if (response.status === "fulfilled") {
      setLoading(false);
    }
  }, [response]);
  return (
    <div>
      <Spin spinning={loading}>
        <h1 className="text-3xl font-semibold mb-2">{t("Cart")}</h1>
        {cartProducts.map((item, index) => {
          return (
            <div
              key={item.row.id}
              className="relative flex flex-col sm:flex-row justify-between rounded-lg bg-gray-200 my-2 border-b border-gray-200 py-4 px-2"
            >
              <div className="absolute cursor-pointer top-3 right-5">
                <span
                  className="material-symbols-rounded"
                  onClick={() => {
                    removeCartItem(item.row.id);
                  }}
                >
                  close
                </span>
              </div>
              <div className="flex flex-col md:flex-row lg:flex-row">
                <div className="flex flex-col ">
                  <p className="text-lg font-semibold text-black-500">
                    {t("Employee Name")}: {item.row.name}{" "}
                  </p>
                  {item?.products.map((val) => {
                    return (
                      <div className="flex ">
                        <div className="mt-2" style={{ width: "180px" }}>
                          <h2 className="text-lg text-gray-700">
                            {" "}
                            {t(val.productName)}{" "}
                          </h2>
                          <p className="text-sm text-gray-500 ">
                            {t("Size")} : {val.productSize}{" "}
                          </p>
                          {getAdminReduxStoreData.companySetting
                            .pricingStatus ? (
                            <p className="text-sm text-gray-500 ">
                              {t("Price")} :{" "}
                              {formatPrice(val.productPrice ?? 0)}
                            </p>
                          ) : (
                            ""
                          )}

                          <p className="text-sm text-gray-500 ">
                            {t("Qty")} :{" "}
                            {val.productQuantity ? val.productQuantity : 1}
                          </p>
                        </div>
                        <div className="w-16 mt-4 ">
                          <img src={val.productImage}></img>
                        </div>
                      </div>
                    );
                  })}
                  {getAdminReduxStoreData.companySetting.pricingStatus ? (
                    <p className="text-sm font-bold  mt-5 ">
                      {t("Total Billed")} : {formatPrice(item.totalBilled ?? 0)}{" "}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="border-b border-gray-200 py-4 px-2">
          <label className="text-sm mb-2 font-semibold" for="detailed-info">
            {t("Additional Information")}:
          </label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded-md h-[100px]"
            id="detailed-info"
            name="detailed-info"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          ></textarea>
          <button
            className="py-1.5 px-3 bg-black text-white mt-2 rounded-lg cursor-pointer"
            onClick={() => createOrder()}
            disabled={loading}
          >
            {t("Submit")}
          </button>
        </div>
      </Spin>
    </div>
  );
}

export default CartTab;
