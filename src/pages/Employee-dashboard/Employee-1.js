import React, { useState, useEffect, useContext } from "react";
import Table from "../../components/table/Table";
import ProductDrawer from "../../components/ProductDrawer";

import { useDispatch, useSelector } from "react-redux";
import {
  useEmployeeRequestBudgetIncrementMutation,
  useAddNewOrderMutation,
  useGetCompanyDetailsQuery,
} from "../../apis/companyManager/index";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { tableStructureData } from "../../utils/TableStructureData";
import { showPopup, errorPopup } from "../../redux-slice/UserSliceAuth";
import { Header } from "../../components";
import {
  useGetAllEmployeesProductsByCompanyIdQuery,
  useGetProductsByCompanyIdQuery,
} from "../../apis";
import { companySettingsAction } from "../../redux-slice/AdminSliceReducer";
import { useTranslation } from "react-i18next";
import { I18nContext } from "../../translation-wrapper/I8nProvider";
const Index = () => {

  const {t } = useTranslation();
  const { selectedLanguage } = useContext(I18nContext)
  const employeeId = JSON.parse(localStorage.getItem("user"))?.result?._id;
  const authUser = useSelector((val) => val.authUser.user);
  const companyApiRes = useGetCompanyDetailsQuery();
  const getAdminReduxStoreData = useSelector((val) => val.admin);

  const { data, error, isLoading, refetch } =
    useGetAllEmployeesProductsByCompanyIdQuery({
      companyId: authUser.result.companyId,
    });
  const [addNewOrder, responseOrder] = useAddNewOrderMutation();
  const user = useSelector((auth) => auth.authUser.user);
  const data2 = useGetProductsByCompanyIdQuery({
    companyId: authUser.result.companyId,
  });
  
  const [
    allProductEmployeeSizeCollection,
    setAllProductEmployeeSizeCollection,
  ] = useState([]);
  const [budgetRequest, response] = useEmployeeRequestBudgetIncrementMutation();
  const companyName = JSON.parse(localStorage.getItem("user"))?.result
    ?.companyName;
  // only to show editable input
  const [inputBudgetRequest, setInputBudgetRequest] = useState(true);
  const [selectedProductsMarked, setSelectedProductsMarked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantityCollection, setQuantityCollection] = useState([]);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [inputBudgetValue, setInputBudgetValue] = useState(0);

  const openDrawer = (row) => {
    setShowDrawer(!showDrawer);
    setSelectedEmployee(row);
  };

  const updateProductQuantity = (pdId, qty, row, isDrawerProduct) => {
    let formatSelectedEmp = {
      empId: row.id,
      products: row.slider.showProducts,
      row,
    };
    let filterQuantityCollection = [];
    const empRowFilter = [formatSelectedEmp];

    if (empRowFilter.length > 0) {
      let productFilter = [];

      if (isDrawerProduct != undefined) {
        productFilter = data2.data.products.filter((val) => val._id == pdId);
      } else {
        productFilter = empRowFilter[0].products.filter(
          (val) => val._id == pdId
        );
      }

      if (productFilter.length > 0) {
        let quantityCollectionArray = {
          empId: row.id,
          productId: pdId,
          productQuantity: qty,
        };
        filterQuantityCollection = quantityCollection.filter(
          (val) => val.productId != pdId
        );
        filterQuantityCollection.push(quantityCollectionArray);
        setQuantityCollection(filterQuantityCollection);
      }
    }
  };
  const customHandleUpdate = (key, value, row, product) => {
    const tempData = [...tableData];
    const tableRowIndex = tempData.findIndex(
      (tableRow) => tableRow.id === row.id
    );
    const productIndex = tempData[tableRowIndex].slider.showProducts.findIndex(
      (productIndex) => productIndex._id === product._id
    );
   
    const updatedArray = [
      ...tempData[tableRowIndex].slider.showProducts.slice(0, productIndex),
      {
        ...tempData[tableRowIndex].slider.showProducts[productIndex],
        productSize: value,
      },
      ...tempData[tableRowIndex].slider.showProducts.slice(productIndex + 1),
    ];
    tempData[tableRowIndex].slider.showProducts = updatedArray;
    const selectedProductIndex = selectedProductForOrder.findIndex(
      (val) => val.empId === row.id
    );
    const selectedSpecificProductIndex = selectedProductForOrder[
      selectedProductIndex
    ]?.products?.findIndex((val) => val._id === product._id);

    if (selectedProductIndex > -1) {
      setSelectedProductForOrder((prev) => {
        prev[selectedProductIndex].products[selectedSpecificProductIndex] = {
          ...prev[selectedProductIndex].products[selectedSpecificProductIndex],
          productSize: value,
        };
        return [...prev];
      });
    }
    setTableData((prev) => {
      return tempData;
    });
  };
  const createOrder = (row) => {
    setLoading(true);
    let getSelectedRow = selectedProductForOrder.filter(
      (val) => val.empId === row.id
    );
    if (getSelectedRow.length > 0) {
      const updateQty = (productsCollection) => {
        let updatedProductQtyCollection = [];
        productsCollection.map((product) => {
          const filterProductToUpdateQty = quantityCollection.filter(
            (val) => val.productId === product._id
          );
          const filterProductUpdateSize =
            allProductEmployeeSizeCollection.filter(
              (val) => val.productId === product._id
            );
          if (
            filterProductToUpdateQty.length &&
            filterProductUpdateSize.length
          ) {
            let obj = { ...product };
            obj.productQuantity = filterProductToUpdateQty[0]?.productQuantity;
            obj.productSize = filterProductUpdateSize[0]?.productSize;
            updatedProductQtyCollection.push(obj);
          } else if (filterProductToUpdateQty.length) {
            let obj = { ...product };
            obj.productQuantity = filterProductToUpdateQty[0]?.productQuantity;
            updatedProductQtyCollection.push(obj);
          } else if (filterProductUpdateSize.length) {
            let obj = { ...product };

            obj.productSize = filterProductUpdateSize[0]?.productSize;
            updatedProductQtyCollection.push(obj);
          } else {
            updatedProductQtyCollection.push(product);
          }
        });

        getSelectedRow[0].products = updatedProductQtyCollection;
      };

      updateQty(getSelectedRow[0].products);
      let orderData = orderBodyConvert(row, getSelectedRow[0]);

      if (
        getAdminReduxStoreData.companySetting.budgetStatus &&
        orderData.bill > row.budget
      ) {
        return dispatch(
          errorPopup({ state: true, message: t("insufficient budget !") })
        );
      }
      if (orderData.employeeProducts.length > 0) {
        addNewOrder([orderData])
          .unwrap()
          .then((res) => {

            dispatch(showPopup({ state: true, message: t("Order Created") }));
            setQuantityCollection([]);
            setAllProductEmployeeSizeCollection([]);
          })
          .catch((error) => {
            dispatch(
              errorPopup({
                state: true,
                message:
                t("Error! Your Budget is not enough! Request new budget before ordering!"),
              })
            );
          })
          .finally(() => {
            setSelectedProductForOrder([]);
          });
      } else {
        dispatch(
          errorPopup({
            state: true,
            message: t("Add Product In List , first"),
          })
        );
      }
    } else {
      dispatch(
        errorPopup({
          state: true,
          message: t("Select Product First"),
        })
      );
    }
  };
  const addItem = (row) => {
    createOrder(row);
  };

  const updatedInput = (selectedInput) => {
    setInputBudgetRequest(selectedInput);
  };
  const dispatch = useDispatch();
  const updateBudgetF = () => {
    if (inputBudgetRequest || inputBudgetRequest.value < 0) {
      const updatedBudget = {
        employeeId: inputBudgetRequest.inputId,
        requestAmount: inputBudgetRequest.value,
        companyId: authUser.result.companyId,
        language:selectedLanguage 
      };

      budgetRequest(updatedBudget)
        .unwrap()
        .then((res) => {
          dispatch(
            showPopup({
              state: true,
              message: t("Manager has notified ,about your request"),
            })
          );
        })
        .catch((error) => {
          dispatch(
            errorPopup({
              state: true,
              message: t("A Budget Request has already been made"),
            })
          );
        });
    } else {
      dispatch(
        errorPopup({ state: true, message: t("Input Value is not correct") })
      );
    }
  };

  const orderBodyConvert = (row, cartProducts) => {
    const companyId = JSON.parse(localStorage.getItem("user"))?.result
      ?.companyId;
    let quantity = 0;
    let updatedArrayOfProductsWithAllRequiredFields=[]
    let total = cartProducts.products.map((val) => {
      updatedArrayOfProductsWithAllRequiredFields.push({...val,productQuantity:val?.productQuantity??1,productSize:val?.productSize.toUpperCase()??" "})
      quantity += Number(val.productQuantity);
      let qty = val.productQuantity ?? 1;
      return (val.productPrice??0) * qty;
    });
    total = total.reduce(
      (previousScore, currentScore, index) => previousScore + currentScore,
      0
    );

    return {
      employeeId: cartProducts.empId,
      employeeProducts: updatedArrayOfProductsWithAllRequiredFields,
      companyName,
      bill: total,
      quantity: quantity,
      
      companyId: companyId,
      comment: t("Employee Created Order By Himself"),
      employeeEmail: authUser.result.employeeEmail,
      employeeName: user?.name,
      role: "employee",
      pricingStatus:getAdminReduxStoreData.companySetting.pricingStatus,
      language:selectedLanguage
    };
  };

  const selectedProductMarkedF = (empId, product) => {
    const filterProducts = selectedProductsMarked;
    let index;
    if (filterProducts.length > 0) {
      index = filterProducts.findIndex(
        (products) => products.productId === product._id
      );
    } else {
      index = -1;
    }

    if (index !== -1) {
      filterProducts.splice(index, 1);
    } else {
      filterProducts.push({ empId: empId, productId: product._id });
    }
    setSelectedProductsMarked([...filterProducts]);
  };
  const addMoreProduct = (products) => {
    addProductsToOrder(selectedEmployee, products);
    selectedProductMarkedF(selectedEmployee.id, products);
  };
  const addProductsToOrder = (row, products) => {
    let empExist = selectedProductForOrder.filter(
      (val) => val.empId === row.id
    );

    if (empExist.length > 0) {
      const getUpdatedProducts = productUpdate(empExist[0].products, products);
      let filterSelectedRow = selectedProductForOrder.filter(
        (val) => val.empId != empExist[0].empId
      );
      if (getUpdatedProducts.length > 0) {
        empExist[0].products = getUpdatedProducts;
        empExist[0].row = row;
        setSelectedProductForOrder([...filterSelectedRow, empExist[0]]);
      } else {
        setSelectedProductForOrder([...filterSelectedRow]);
      }
    } else {
      const productsCollected = { empId: row.id, products: [products], row };
      setSelectedProductForOrder([
        ...selectedProductForOrder,
        productsCollected,
      ]);
    }
  };

  const productUpdate = (collections, getProduct) => {
    let collection = collections;
    const index = collection.findIndex(
      (product) => product._id === getProduct._id
    );

    if (index !== -1) {
      collection.splice(index, 1);
    } else {
      collection.push(getProduct);
    }
    return collection;
  };

  const refresh = () => {
    refetch();
    globalFunctions.refreshCompanySettings(dispatch,companyApiRes);
    dispatch(showPopup({ state: true, message: t("Latest Data is Updated ") }));
  };

  useEffect(() => {
    if (data != undefined && data.length != 0) {
      const employeeProduct = data[0].products.filter(
        (val) => val._id === authUser.result.productId
      );
      let employee = data[0].employees.filter(
        (val) => val._id === authUser.result._id
      )[0];
      employee = [{ ...employee, products: employeeProduct }];

      let tableDataConvert =
        globalFunctions.employeeOrderBudgetFormatConverter(employee);

      setTableData(tableDataConvert);
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (companyApiRes?.data) {
      dispatch(
        companySettingsAction({
          pricingStatus: companyApiRes.data.pricingStatus,
          budgetStatus: companyApiRes.data.budgetStatus,
          companyId: companyApiRes.data._id,
        })
      );
    }
  }, [companyApiRes.isLoading]);

  return (
    <div className="px-auto  mx-auto w-11/12">
      <Header />
      {t("paragraphs")}
      <div className="mt-12 py-12">
        <Table
         orderPage={true}
          tableData={tableData}
          setTableData={setTableData}
          columns={tableStructureData.employeeOrderBudgetColumns(
            getAdminReduxStoreData.companySetting.budgetStatus
          )}
          tableTitle={t("Create Order")}
          openDrawer={openDrawer}
          addItem={addItem}
          inputBudgetValue={inputBudgetValue}
          setInputBudgetValue={setInputBudgetValue}
          budgetStatus={getAdminReduxStoreData.companySetting.budgetStatus}
          setInputBudgetRequest={setInputBudgetRequest}
          updatedInput={updatedInput}
          updateBudgetF={updateBudgetF}
          addProductsToOrder={addProductsToOrder}
          refresh={refresh}
          selectedProductForOrder={selectedProductForOrder}
          selectedProductsMarked={selectedProductsMarked}
          setSelectedProductsMarked={setSelectedProductsMarked}
          updateProductQuantity={updateProductQuantity}
          quantityCollection={quantityCollection}
          customHandleUpdate={customHandleUpdate}
          pricingStatus={getAdminReduxStoreData.companySetting.pricingStatus}
          // cartObj={{ isCartShow: true }}
        />
      </div>

      <ProductDrawer
        show={showDrawer}
        setShow={setShowDrawer}
        addMoreProduct={addMoreProduct}
        addProductsToOrder={addProductsToOrder}
        updateProductQuantity={updateProductQuantity}
        selectedEmployee={selectedEmployee}
        selectedProductsMarked={selectedProductsMarked}
        selectedProductForOrder={selectedProductForOrder}
        data2={data2}
        pricingStatus={getAdminReduxStoreData.companySetting.pricingStatus}
        quantityCollection={quantityCollection}
        allProductEmployeeSizeCollection={allProductEmployeeSizeCollection}
        setAllProductEmployeeSizeCollection={
          setAllProductEmployeeSizeCollection
        }
      />
    </div>
  );
};

export default Index;
