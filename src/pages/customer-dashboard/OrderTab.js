import React, { useState, useEffect } from "react";
import Table from "../../components/table/Table";
import { tableStructureData } from "../../utils/TableStructureData";
import ProductDrawer from "../../components/ProductDrawer";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetEmployeesProductsQuery,
  useUpdateBudgetMutation,
  useGetCompanyAllProductsQuery,
  useGetCompanyDetailsQuery,
} from "../../apis/companyManager/index";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { showPopup, errorPopup } from "../../redux-slice/UserSliceAuth";
import {
  useGetAllEmployeesProductsByCompanyIdQuery,
  useGetProductsByCompanyIdQuery,
} from "../../apis";
import { useTranslation } from "react-i18next";

const Index = () => {
  const {t}=useTranslation();
 const  companyApiRes=useGetCompanyDetailsQuery();
  const authUser = useSelector((val) => val.authUser.user);
  const getAdminReduxStoreData = useSelector((val) => val.admin);

  const { data, error, isLoading, refetch } =
    useGetAllEmployeesProductsByCompanyIdQuery({
      companyId: authUser.result.companyId,
    });

  const data2 = useGetProductsByCompanyIdQuery({
    companyId: authUser.result.companyId,
  });

  const [budgetUpdate, response] = useUpdateBudgetMutation();
  const dispatch = useDispatch();

  const [tableData, setTableData] = useState([]);
  const [quantityCollection, setQuantityCollection] = useState([]);
  const [
    allProductEmployeeSizeCollection,
    setAllProductEmployeeSizeCollection,
  ] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [inputBudgetRequest, setInputBudgetRequest] = useState(false);
  const [addItemCart, setAddItemCart] = useState([]);
  const [selectedProductsMarked, setSelectedProductsMarked] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(
    countProductQuantity(JSON.parse(localStorage.getItem("addToCart")))
  );

  const updatedInput = (selectedInput) => {
    setInputBudgetRequest(selectedInput);
  };

  const openDrawer = (row) => {
    setShowDrawer(!showDrawer);
    setSelectedEmployee(row);
  };
 
  const selectedProductMarkedF = (empId, product) => {
    const filterProducts = selectedProductsMarked;
    let index;
    if (filterProducts.length > 0) {
      index = filterProducts.findIndex(
        (products) =>
          products.productId === product._id && products.empId === empId
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
  const addMoreProduct = (products, isProductRemove) => {
    // 
    addProductsToOrder(selectedEmployee, products);
    selectedProductMarkedF(selectedEmployee.id, products);
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

  // this function will remove procut if exist else add it
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
  const removeAddProduct = (row) => {
    let filterProduct = addItemCart.filter((val) => val.id != row.id);
    //  if(filterProduct.length>0){
    setAddItemCart(filterProduct);
    //  }
  };
  const showActive = (row) => {
    setAddItemCart((prev) => [...prev, row]);
  };

  function countProductQuantity(data) {
    let totalQuantity = 0;

    data?.forEach((item) => {
      if (item.products && Array.isArray(item.products)) {
        item.products.forEach((product) => {
          const quantity = product.productQuantity ?? 1;
          if (!isNaN(quantity)) {
            totalQuantity += Number(quantity);
          }
        });
      }
    });
    let totalProducts = 0;
  const cartItems=  JSON.parse(localStorage.getItem("addToCart"))
   if(cartItems?.length){
    cartItems.forEach((item) => {

      item.products.forEach((product) => {
        totalProducts += Number(product.productQuantity) || 1;
      });
    });
    
   
   }
    return totalProducts;
  }
  const cartItems=  JSON.parse(localStorage.getItem("addToCart"))

  const addItem = (row) => {
    showActive(row);
    let cartItems = [];
    let getLocalStorageCartData;
    let getSelectedRow = selectedProductForOrder.filter(
      (val) => val.empId === row.id
    );
    if (getSelectedRow.length > 0) {
      getLocalStorageCartData = JSON.parse(localStorage.getItem("addToCart"));

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
            obj.productSize = filterProductUpdateSize[0]?.productSize??obj.productSize;
            updatedProductQtyCollection.push(obj);
          } else if (filterProductToUpdateQty.length) {
           
            let obj = { ...product };
            obj.productQuantity = filterProductToUpdateQty[0]?.productQuantity;
            obj.productSize = filterProductUpdateSize[0]?.productSize??obj.productSize;
            updatedProductQtyCollection.push(obj);
          } else if (filterProductUpdateSize.length) {
            let obj = { ...product };
            obj.productSize = filterProductUpdateSize[0]?.productSize??obj.productSize;
            updatedProductQtyCollection.push(obj);
          } else {
            updatedProductQtyCollection.push(product);
          }
        });

        getSelectedRow[0].products = updatedProductQtyCollection;
      };

      updateQty(getSelectedRow[0].products);
      let totalBilled = getSelectedRow[0].products.map((val) => {
        let qty = val.productQuantity ?? 1;
        
        return val.productPrice.toFixed(2) * qty;
      });
      totalBilled = totalBilled.reduce(
        (previousScore, currentScore, index) => previousScore + currentScore,
        0
      );
      let cartItemObj;
     
      if (
        !getAdminReduxStoreData.companySetting.budgetStatus ||
        globalFunctions.convertToRegularNumber(totalBilled) <=globalFunctions.convertToRegularNumber( row.budget)
      ) {
        if (
          getLocalStorageCartData != undefined ||
          getLocalStorageCartData != null
        ) {
          let filterData = getLocalStorageCartData.filter(
            (val) => val.empId != row.id
          );
      
          cartItemObj = {
            ...getSelectedRow[0],
            totalBilled,
            employeeEmail: row.employeeEmail,
            managerEmail: authUser.result.managerEmail,
          };
          filterData.push(cartItemObj);
          if (cartItemObj.products.length > 0) {

            localStorage.setItem("addToCart", JSON.stringify(filterData));
            const count = countProductQuantity(filterData);

            setCartItemsCount(count);
          } else {
            removeAddProduct(row);
            return dispatch(
              errorPopup({ state: true, message: t("Add Product in List first") })
            );
          }
        } else {
          
          cartItemObj = {
            ...getSelectedRow[0],
            totalBilled: totalBilled,
            employeeEmail: row.employeeEmail,
            managerEmail: authUser.result.managerEmail,
          };
          cartItems.push(cartItemObj);
          if (cartItemObj.products.length > 0) {
            localStorage.setItem("addToCart", JSON.stringify(cartItems));
            let count = countProductQuantity(cartItems);
            setCartItemsCount(count);
          } else {
            removeAddProduct(row);
            return dispatch(
              errorPopup({ state: true, message: t("Add Product in List first") })
            );
          }
        }

        dispatch(showPopup({ state: true, message: t("Product added in cart") }));
      } else {
        removeAddProduct(row);
        dispatch(
          errorPopup({
            state: true,
            message:
              t("Budget not enough! Update budget for this employee before ordering!"),
          })
        );
      }
    } else {
      removeAddProduct(row);
      dispatch(errorPopup({ state: true, message: t("Select Products First") }));
    }
  };

  const budgetDecisionF = () => {
    if (inputBudgetRequest || inputBudgetRequest.value < 0) {
      const updatedBudget = {
        employeeId: inputBudgetRequest.inputId,
        changeBudgetAmount: inputBudgetRequest.value,
      };
      budgetUpdate(updatedBudget)
        .unwrap()
        .then((res) => {
          dispatch(
            showPopup({ state: true, message: t("Budget Sucessfully Increased") })
          );
          // setComment("");
        })
        .catch((error) => {
          dispatch(
            errorPopup({
              state: true,
              message:
                t("Budget Failed To Update..!"),
            })
          );
        });
    } else {
      dispatch(
        errorPopup({
          state: true,
          message: t("budget input should be positive value"),
        })
      );
    }
  };
  const removeListItem = (row, pdId) => {
    let removeRowEntry = tableData.filter((val) => val.id != row.id);

    let updateRow = row.slider.showProducts[0].products.filter(
      (val) => val._id != pdId
    );
    let obj = { ...row };
    //  obj.slider.showProducts[0]={slider:{showProducts:{products:[...updateRow]}}};
    obj.slider.showProducts = [{ products: [...updateRow] }];
    const sortData = (data) => {
      return data.sort((a, b) => a.SNO - b.SNO);
    };
    let sortedData = sortData([...removeRowEntry, obj]);
    setTableData(sortedData);
  };
  const refresh = () => {
    refetch();
    globalFunctions.refreshCompanySettings(dispatch,companyApiRes);
    dispatch(showPopup({ state: true, message: t("Latest Data is Updated") }));
  };

  const customHandleUpdate = (key, value, row, product) => {
    const tempData = [...tableData];
    const tableRowIndex = tempData.findIndex(
      (tableRow) => tableRow.id === row.id
    );
    const productIndex = tempData[tableRowIndex].slider.showProducts.findIndex(
      (productIndex) => productIndex._id === product._id
    );
    // tempData[tableRowIndex].slider.showProducts[productIndex].productSize = value;
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
 
  useEffect(() => {
    let getLocalStorageCartData = JSON.parse(localStorage.getItem("addToCart"));
    if (data != undefined && data.length != 0) {
      let tableDataConvert = globalFunctions.tableDataFormatConverter(data);

      setTableData(tableDataConvert);
    }
  }, [data]);

  return (
    <>
      <Table
        tableData={tableData}
        setTableData={setTableData}
        columns={tableStructureData.columns(
          getAdminReduxStoreData.companySetting.budgetStatus
        )}
        tableTitle={t("Create Order")}
        openDrawer={openDrawer}
        addItem={addItem}
        inputBudgetRequest={inputBudgetRequest}
        setInputBudgetRequest={setInputBudgetRequest}
        updatedInput={updatedInput}
        updateBudgetF={budgetDecisionF}
        removeListItem={removeListItem}
        refresh={refresh}
        addProductsToOrder={addProductsToOrder}
        selectedProductsMarked={selectedProductsMarked}
        setSelectedProductsMarked={setSelectedProductsMarked}
        updateProductQuantity={updateProductQuantity}
        selectedProductForOrder={selectedProductForOrder}
        quantityCollection={quantityCollection}
        addItemCart={addItemCart}
        setAddItemCart={setAddItemCart}
        budgetStatus={getAdminReduxStoreData.companySetting.budgetStatus}
        pricingStatus={getAdminReduxStoreData.companySetting.pricingStatus}
        customHandleUpdate={customHandleUpdate}
        cartObj={{ isCartShow: true, cartItemsCount }}
      />
      <ProductDrawer
        show={showDrawer}
        setShow={setShowDrawer}
        addMoreProduct={addMoreProduct}
        pricingStatus={getAdminReduxStoreData.companySetting.pricingStatus}
        addProductsToOrder={addProductsToOrder}
        updateProductQuantity={updateProductQuantity}
        selectedEmployee={selectedEmployee}
        selectedProductsMarked={selectedProductsMarked}
        selectedProductForOrder={selectedProductForOrder}
        data2={data2}
        quantityCollection={quantityCollection}
        allProductEmployeeSizeCollection={allProductEmployeeSizeCollection}
        setAllProductEmployeeSizeCollection={
          setAllProductEmployeeSizeCollection
        }
      />
    </>
  );
};

export default Index;
