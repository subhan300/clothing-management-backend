import React, { useContext, useEffect, useState } from "react";
import "./table.css";
import { tableFunctions } from "../../global-functions/GlobalFunctions";
import { type } from "@testing-library/user-event/dist/type";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { tableStructureData } from "../../utils/TableStructureData";
import EditableInput from "../editable-input/EditableInput-1";
import DoubleCheckbox from "../checkbox/DoubleCheckbox";
import QuantityInput from "../quantity-input/QuantityInput";
import GroupButton from "../group-buttons/GroupButton";
import CustomProductSize from "../product-size/CustomProductSize";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import CartSelecetedButton from "../CartSelecetedButton";
import { IoIosSave } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { Row, Tag } from "antd";
import { I18nContext } from "../../translation-wrapper/I8nProvider";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
const { formatPrice } = globalFunctions;

function Table({
  tableData,
  setTableData,
  addItemCart,
  setAddItemCart,
  columns,
  removeListItem,
  tableTitle,
  openDrawer,
  refresh,
  addItem,
  hideButtons,
  setInputBudget,
  inputBudget,
  setInputSelectedResult,
  inputSelectedResult,
  inputBudgetRequest,
  setInputBudgetRequest,
  updatedInput,
  updateBudgetF,
  budgetDecisionF,
  addProductsToOrder,
  selectedProductForOrder,
  selectedProductsMarked,
  setSelectedProductsMarked,
  updateProductQuantity,
  pastOrder,
  quantityCollection,
  hideCounter,
  activeBtn,
  setActiveBtn,
  budgetStatus,
  customHandleUpdate,
  cartObj,
  orderPage,
  pastOrders,
  pricingStatus,
  triggerState,
  settriggerState
}) {
 
  const { t } = useTranslation();
  const { selectedLanguage } = useContext(I18nContext);
  const [initialQty, setInitialQty] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeAction, setTypeAction] = useState(false);
  const [typeSlider, setTypeSlider] = useState(false);

  const role = localStorage.getItem("role");

  const checkIsProductSelected = (productId, empId) => {
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

  const selectedProductMarkedF = (row, product) => {
    const filterProducts = selectedProductsMarked;

    const index = filterProducts.findIndex(
      (products) => products.productId === product._id
    );

    if (index !== -1) {
      filterProducts.splice(index, 1);
      setInitialQty(!initialQty);
    } else {
      filterProducts.push({ empId: row.id, productId: product._id });
    }
    setSelectedProductsMarked([...filterProducts]);
  };
  const addColor = (productId) => {
    let addColorState = selectedProductsMarked?.filter(
      (val) => val.productId === productId
    );
    if (addColorState?.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const itemAddedToCart = (row) => {
    const filterItem = addItemCart?.filter((val) => val.id === row.id);
    if (filterItem?.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const empProductCount = (empId) => {
    let counterProduct = selectedProductsMarked.filter(
      (val) => val.empId == empId
    );
    let totalCountArray = [];
    let qtyCount = 0;
    if (counterProduct.length > 0) {
      counterProduct.forEach((val) => {
        let tempCount = quantityCollection.filter(
          (c) => c.productId === val.productId
        );
        if (tempCount.length > 0) {
          totalCountArray.push(tempCount[0].productQuantity);
        }
      });
      if (totalCountArray.length > 0) {
        qtyCount = totalCountArray.reduce(
          (previousScore, currentScore, index) =>
            Number(previousScore) + Number(currentScore),
          0
        );
        qtyCount = qtyCount - totalCountArray.length + counterProduct.length;
      } else {
        qtyCount = counterProduct.length;
      }
    }
    return qtyCount;
  };
  const activeBtnF = (empId) => {
    const filterItem = addItemCart?.filter((val) => val.id === empId);
    if (filterItem != undefined) {
      return filterItem?.length;
    }
  };

  const filteredData = tableData?.filter((item) => {
    
    return item?.name ? item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()):tableData;
  });
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  let sliderSettings = {
    dots: role === "employee" ? true : false,
   
    speed: 600,
    slidesToShow: role === "employee" ? 6 : 5, // Increased number for 'employee'
    slidesToScroll: role === "employee" ? 2 : 2, // Scroll 2 slides at a time
    autoplay: true,
    autoplaySpeed: 4000, // You can adjust this value to control the speed of autoplay
    
    
};

  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    setShouldShake(true);
    const timer = setTimeout(() => {
      setShouldShake(false);
    }, 1000); // the shake animation lasts 1 second
    return () => clearTimeout(timer);
  }, [cartObj?.cartItemsCount]);

  useEffect(() => {
    columns.forEach((element) => {
      if (element.type == "action") {
        setTypeAction(true);
      } else if (element.type == "slider") {
        if (hideButtons == undefined) {
          setTypeSlider(true);
        } else if (hideButtons == false) {
          setTypeSlider(false);
        }
      }
    });
  }, []);
  useEffect(() => {
    if (selectedProductForOrder?.length == 0) {
      setSelectedProductsMarked([]);
    }
  }, [selectedProductForOrder]);
  
  return (
    <div>
      <h1 className="text-2xl font-semibold">
        {tableTitle ? t(tableTitle) : ""}
      </h1>
      <div className="relative shadow-md sm:rounded-lg mt-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4">
          <button
            onClick={() => {
              refresh();
            }}
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1 ml-2"
          >
            <span className="material-symbols-rounded text-base">refresh</span>
          </button>
          <div className="search-cart-div">
            {cartObj && cartObj.isCartShow && (
              <Link
                to="/manager/cart"
                className={`relative inline-flex items-center justify-center rounded-lg p-2 
      ${shouldShake ? "animate-shake" : ""} 
      transition-colors duration-200 
      ${
        cartObj.cartItemsCount > 0
          ? "bg-orange-500 hover:bg-orange-600"
          : "bg-gray-500"
      }`}
              >
                <span className="absolute top-0 right-36 bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                  {cartObj.cartItemsCount}
                </span>
                <AiOutlineShoppingCart className="text-white text-3xl" />
                <span className="ml-4 text-white font-bold">
                  {t("Total Order")}!
                </span>
              </Link>
            )}

            <label for="table-search" className="sr-only">
              Search
            </label>
            <div className="relative ">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t("Search for items")}
              />
            </div>
          </div>
        </div>
        <div className="w-full h-[65vh] overflow-auto bg-gray-50">
          <table className="w-full bg-gray-50 relative text-sm text-left text-gray-500">
            <thead className="text-xs sticky z-10 top-0 text-gray-700 uppercase bg-gray-50">
              <tr>
                {columns.map((val) => {
                 
                  return (
                    <th scope="col" className={`px-2 py-3 `}>
                      {t(val.label)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, i) => (
              <React.Fragment key={row.id}>
                <tr className="bg-white border-b hover:bg-gray-50">
                  <td scope="col" className={`px-2 py-3 ${role==="employee" && !budgetStatus ? "emp_col_width" :""} ${role==="employee"?"w-32":""}`}>
                    {row.SNO}
                  </td>
                  {row.name ? (
                    <th
                      scope="row"
                      className={`${role==="employee" && !budgetStatus ? "emp_col_width" :""} px-2 py-4 font-medium text-gray-900 whitespace-nowrap  max-w-[120px] ${
                        (orderPage && role !=="employee")? "min-w-[110px]": ( role ==="employee")?"w-2/12" : "min-w-[150px]"
                      }`}
                    >
                      {row?.managerOrder?.length ? (
                        <Tag style={{ fontSize: "0.9rem" }} color={"geekblue"}>
                          {row.name}
                        </Tag>
                      ) : (
                        row.name
                      )}
                    </th>
                  ) : (
                    ""
                  )}
                   {row.slider &&  role==="manager" ?
                  
                   
                  <td
              
                  
                    className=" py-4 relative"
                    style={{
                      padding: selectedLanguage === "en" ? "" : "1rem",
               
                    }}
                  >
                    <Slider
                      {...{
                        ...sliderSettings,
                        infinite: row?.slider?.showProducts?.length > 4
                      }}
                      className={`!mx-auto w-full   min-w-[400px] ${
                        role === "employee"
                          ? "max-w-[1050px]"
                          : "max-w-[900px]"
                      }`}
                    >
                      
                         {row.slider.showProducts?.map((val, i) => {
                            return (
                              <div
                                key={val._id}
                                className={`w-[9rem] h-[10rem] max-w-[8rem] rounded-md cursor-pointer relative ${
                                  addColor(val._id) ? "add_color" : ""
                                }`}
                              >
                                <div
                                  className={`w-full h-full absolute top-0 left-0 ${
                                    addColor(val._id)
                                      ? "bg-green-500 opacity-80 flex flex-col justify-center "
                                      : "bg-transparent"
                                  } rounded-md transition-all duration-500 ease-in-out`}
                                >
                                  {addColor(val._id) && (
                                    <div className="text-white font-bold text-lg">
                                      {t("Marked")}
                                    </div>
                                  )}
                                </div>
                                <img
                                  src={val.productImage}
                                  alt={val.productName}
                                  className="w-full h-full rounded-md"
                                />
                                <div className="w-full h-full absolute top-0 left-0 bg-gray-900 opacity-0 hover:opacity-100 flex flex-col py-4 items-center rounded-md transition-all duration-500 ease-in-out">
                                  <span className="order_product text-xs text-white font-semibold">
                                    {t(val.productName)}
                                  </span>
                                  {pricingStatus ? (
<div className="order_product mt-2">
  <span className="text-xs text-white font-semibold">
    {t("price")} : {formatPrice(val.productPrice ?? 0)}
  </span>
</div>
) : (
""
)}


                                  <div className="order_product mt-2">
                                    <span className="text-xs   flex  text-white font-semibold">
                                      <CustomProductSize
                                        customHandleUpdate={
                                          customHandleUpdate
                                        }
                                        product={val}
                                        value={val.productSize?.toUpperCase()}
                                        row={row}
                                      />
                                    </span>
                                  </div>

                                  <div className="mt-2 order_product">
                                    {" "}
                                    <span className="text-xs  flex text-white font-semibold">
                                      {t("Qty")} :
                                    
                                      <div>
                                        <QuantityInput
                                          initialQty={
                                            val.productQuantity
                                              ? val.productQuantity
                                              : 1
                                          }
                                          updateQtyTo1={initialQty}
                                          updateProductQuantity={
                                            updateProductQuantity
                                          }
                                          productId={val._id}
                                          rowId={row}
                                          selectedProductForOrder={
                                            selectedProductForOrder
                                          }
                                          checkIsProductSelected={
                                            checkIsProductSelected
                                          }
                                          pastOrder={pastOrder}
                                        />
                                      </div>
                                     
                                    </span>
                                  </div>

                                  {pastOrder ? (
                                    ""
                                  ) : (
                                    <div
                                      className={`absolute w-[100%] bottom-0 flex items-center ${
                                        addColor(val._id)
                                          ? "bg-green-500 text-white"
                                          : "bg-gray-500 text-white"
                                      }`}
                                      onClick={() => {
                                        addProductsToOrder(row, val);
                                        selectedProductMarkedF(row, val);
                                      }}
                                    >
                                      <button className="px-3 py-1.5 mx-auto w-full text-center">
                                        {addColor(val._id)
                                          ? t("Remove")
                                          : t("Add")}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          
                          })}
                        
                          
                    </Slider>
                  </td>
                 :""}
                  {row.requestAmount ? (
                    <th
                      scope="row"
                      className="px-2 py-4 font-bold text-gray-900 whitespace-nowrap pulse"
                    >
                      <span
                        style={{
                          textShadow: "1px 1px #222222",
                          padding: "10px 15px",
                          borderRadius: "50px",
                          background: "red",
                          color: "white",
                        }}
                      >
                        {`${globalFunctions.formatPrice(row.requestAmount)}`}
                      </span>
                    </th>
                  ) : (
                    ""
                  )}
                  {row.company ? (
                    <th
                      scope="row"
                      className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {row.company}
                    </th>
                  ) : (
                    ""
                  )}
                  {row.email ? (
                    <th
                      scope="row"
                      className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {row.email}
                    </th>
                  ) : (
                    ""
                  )}
                  {row.password ? (
                    <th
                      scope="row"
                      className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {row.password}
                    </th>
                  ) : (
                    ""
                  )}
                  {row.phone ? (
                    <th
                      scope="row"
                      className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {row.phone}
                    </th>
                  ) : (
                    ""
                  )}
                  {row.noOfProducts ? (
                    <th
                      scope="row"
                      className="px-2 py-4   font-medium text-gray-900 whitespace-nowrap"
                    >
                      {row.noOfProducts}
                    </th>
                  ) : (
                    ""
                  )}
                  {row.gender ? (
                    <th
                      scope="row"
                      className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {row.gender}
                    </th>
                  ) : (
                    ""
                  )}

                  
                  {pricingStatus && row.bill ? <td className="px-2 py-4">{row.bill}</td> : ""}
                  {row.createdAt ? (
                    <td className="px-2 py-4">{row.createdAt}</td>
                  ) : (
                    ""
                  )}

                  {pricingStatus && budgetStatus && inputBudgetRequest !== undefined ? (
                    <td className={`px-2 py-4  ${role==="employee"?"w-80":"w-36"}`}>
                      
                      <EditableInput
                         inputBudgetRequest={inputBudgetRequest}
                        updateBudgetF={updateBudgetF}
                        value={row.budget}
                        id={row.id}
                        updatedInput={updatedInput}
                        refresh={refresh}
                      />
                    </td>
                  ) : (
                    ""
                  )}

                  {pricingStatus && budgetStatus && Number(globalFunctions.convertToRegularNumber(row.budget)) >= 0 ? (
                    <td className={`${role==="employee" && !budgetStatus ? "emp_col_width" :""} px-2 py-4  ${role==="employee"?"w-80":""}` }>
                      {/* {!isNaN(row.budget) ? "€" : ""} */}
                      {formatPrice(row.budget)}
                    </td>
                  ) : (
                    ""
                  )}

                  {role !== "admin" &&
                  budgetStatus &&
                  row.allocateBudget?.value >= 0 ? (
                    <td className={`px-2 py-4 ${role==="employee"?"w-80":"w-40"} min-w-[20px]`}>
                      <EditableInput
                        showBtn={row.allocateBudget.showBtn}
                        updateBudgetF={updateBudgetF}
                        id={row.id}
                        value={row.requestAmount || row.allocateBudget.value}
                        updatedInput={updatedInput}
                        requestAmount={row.requestAmount}
                       inputBudgetRequest={inputBudgetRequest}
                        triggerState={triggerState}
                      settriggerState={settriggerState}
                       
                      />
                    </td>
                  ) : (
                    ""
                  )}
                  {typeSlider ? (
                    <td className={`${role==="employee" && !budgetStatus ? "emp_col_width" :""} px-2 py-4 ${role==="employee"?"min-w-[140px]":"min-w-[160px]"}`}>
                      <button
                        className="p-1 bg-black text-white rounded-md text-xs"
                        onClick={() => openDrawer(row)}
                      >
                        {t(row.slider.name)}
                      </button>
                    </td>
                  ) : (
                    ""
                  )}
                  {row.orderInfo ? (
                    <td className="px-3 py-4 ">
                      <button
                        className="p-2 bg-black text-white rounded-md text-xs"
                        onClick={() => openDrawer(row)}
                      >
                        {/* {row.slider.name} */}
                        <h1>{t("View")}</h1>
                      </button>
                    </td>
                  ) : (
                    ""
                  )}
                  {row.status ? (
                    <th
                      scope="row"
                      className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {row.status}
                    </th>
                  ) : (
                    ""
                  )}

                  {row.select ? (
                    <td className={`py-2 min-w-[190px] `}>
                      <GroupButton
                        budgetDecisionF={budgetDecisionF}
                        i={row.id}
                        row={row}
                      />
                    </td>
                  ) : (
                    ""
                  )}

                  {typeAction ? (
                    <td className={`${role==="employee" && !budgetStatus ? "emp_col_width emp_action" :""} py-2 min-w-[120px]`}>
                      <div className="flex items-center">
                        {hideCounter == undefined ? (
                          <span
                            className={`rounded-full text-white py-1 px-2 mr-1.5  ${
                              empProductCount(row.id) > 0
                                ? "counter_bg_color"
                                : "default_counter_bg_color"
                            }`}
                          >
                            {empProductCount(row.id)}
                          </span>
                        ) : (
                          ""
                        )}
                        <button
                          className={`${
                            cartObj?.isCartShow
                              ? "add-to-cart-button"
                              : "employee_order_btn"
                          } ${row.status ? "add-button" : ""} ${
                            activeBtnF(row.id) > 0 ? "added" : ""
                          }`}
                          onClick={() => {
                            // if (activeBtnF(row.id) > 0) {
                            addItem(row);
                            // }
                          }}
                          disabled={activeBtnF(row.id) > 0 ? true : false}
                          style={{
                            backgroundColor:
                              activeBtnF(row.id) > 0 ? "gray" : "#101010",
                          }}
                        >
                          {cartObj?.isCartShow ? (
                            <>
                              {itemAddedToCart(row) ? (
                                <CartSelecetedButton
                                  btnName={"Added to cart"}
                                  cartBtnClass={"added-to-cart"}
                                />
                              ) : (
                                <>
                                  <CartSelecetedButton
                                    cartBtnClass={"add-to-cart"}
                                    btnName={"Add to cart"}
                                  />
                                </>
                              )}
                            </>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              {row.action.name === "Save" && (
                                <IoIosSave style={{ marginRight: "5px" }} />
                              )}{" "}
                              {/* Save icon will appear only if the action is "Save". Added margin to the right. */}
                              {t(row.action.name)}
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                  ) : (
                    ""
                  )}
                </tr>
          
               
                  
                  {row.slider && role==="employee" ?
                   <tr>
                   
                  <td
              
                    colSpan={8}
                    className=" py-4 relative"
                    style={{
                      padding: selectedLanguage === "en" ? "" : "1rem",
                      
                    }}
                  >
                    <Slider
                       {...{
                        ...sliderSettings,
                        infinite: row?.slider?.showProducts?.length > 5
                      }}
                      className={`!mx-auto w-full   min-w-[400px] ${
                        role === "employee"
                          ? "max-w-[850px]"
                          : "max-w-[620px]"
                      }`}
                    >
                      
                         {row.slider.showProducts?.map((val, i) => {
                            return (
                              <div
                                key={val._id}
                                className={`w-[9rem] h-[10rem] max-w-[8rem] rounded-md cursor-pointer relative ${
                                  addColor(val._id) ? "add_color" : ""
                                }`}
                              >
                                <div
                                  className={`w-full h-full absolute top-0 left-0 ${
                                    addColor(val._id)
                                      ? "bg-green-500 opacity-80 flex flex-col justify-center "
                                      : "bg-transparent"
                                  } rounded-md transition-all duration-500 ease-in-out`}
                                >
                                  {addColor(val._id) && (
                                    <div className="text-white font-bold text-lg">
                                      {t("Marked")}
                                    </div>
                                  )}
                                </div>
                                <img
                                  src={val.productImage}
                                  alt={val.productName}
                                  className="w-full h-full rounded-md"
                                />
                                <div className="w-full h-full absolute top-0 left-0 bg-gray-900 opacity-0 hover:opacity-100 flex flex-col py-4 items-center rounded-md transition-all duration-500 ease-in-out">
                                  <span className="order_product text-xs text-white font-semibold">
                                    {t(val.productName)}
                                  </span>
                                  {pricingStatus ? (
<div className="order_product mt-2">
  <span className="text-xs text-white font-semibold">
    {t("price")} : {formatPrice(val.productPrice ?? 0)}
  </span>
</div>
) : (
""
)}


                                  <div className="order_product mt-2">
                                    <span className="text-xs   flex  text-white font-semibold">
                                      <CustomProductSize
                                        customHandleUpdate={
                                          customHandleUpdate
                                        }
                                        product={val}
                                        value={val.productSize?.toUpperCase()}
                                        row={row}
                                      />
                                    </span>
                                  </div>

                                  <div className="mt-2 order_product">
                                    {" "}
                                    <span className="text-xs  flex text-white font-semibold">
                                      {t("Qty")} :
                                    
                                      <div>
                                        <QuantityInput
                                          initialQty={
                                            val.productQuantity
                                              ? val.productQuantity
                                              : 1
                                          }
                                          updateQtyTo1={initialQty}
                                          updateProductQuantity={
                                            updateProductQuantity
                                          }
                                          productId={val._id}
                                          rowId={row}
                                          selectedProductForOrder={
                                            selectedProductForOrder
                                          }
                                          checkIsProductSelected={
                                            checkIsProductSelected
                                          }
                                          pastOrder={pastOrder}
                                        />
                                      </div>
                                     
                                    </span>
                                  </div>

                                  {pastOrder ? (
                                    ""
                                  ) : (
                                    <div
                                      className={`absolute w-[100%] bottom-0 flex items-center ${
                                        addColor(val._id)
                                          ? "bg-green-500 text-white"
                                          : "bg-gray-500 text-white"
                                      }`}
                                      onClick={() => {
                                        addProductsToOrder(row, val);
                                        selectedProductMarkedF(row, val);
                                      }}
                                    >
                                      <button className="px-3 py-1.5 mx-auto w-full text-center">
                                        {addColor(val._id)
                                          ? t("Remove")
                                          : t("Add")}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          
                          })}
                        
                          
                    </Slider>
                  </td>
                  </tr>:""}
                 
              </React.Fragment>
                
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
