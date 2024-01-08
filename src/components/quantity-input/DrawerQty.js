import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { errorPopup } from "../../redux-slice/UserSliceAuth";
import { useTranslation } from "react-i18next";
import "./drawerQty.css"
function DrawerQty({
  updateProductQuantity,
  productId,
  rowId,
  initialQty,
  checkIsProductSelected,
  pastOrder,
  isDrawerProduct,
  selectedProductForOrder,
  quantityCollection,
  selectedEmployee
}) {
  const [qty, setQty] = useState(initialQty);
  const dispatch = useDispatch();
  const {t}=useTranslation()
  const quantityUpdate = (value) => {
   
    updateProductQuantity(productId, value??1, rowId,isDrawerProduct);
  };
 const setQtyFromCollection=()=>{
 
  const filterProductQty=quantityCollection.filter(val=>val.empId===selectedEmployee.id && val.productId===productId)
  const selectQty=filterProductQty[0]?.productQuantity??1
  
  return selectQty;
 }

  return (
    // width: "100%", borderRadius: "6px", marginTop: "-2px" 
    <div style={{ }}>
      {pastOrder ? (
        <div>
          {" "}
          <span className="text-xs text-white text-center font-semibold" >
            {qty}
          </span>
        </div>
      ) : (
        <input
          style={{
            // width: "100%",
            // backgroundColor: "transparent",
            // border: "1px solid white",
            // borderRadius: "6px",
          }}
          className="text-center drawer_qty"
          placeholder={t("Qty")}
          value={setQtyFromCollection()??1}
          min={1}
          type="number"
          onChange={(e) => {
            quantityUpdate(e.target.value);
          }}
        ></input>
      )}
    </div>
  );
}

export default DrawerQty;
