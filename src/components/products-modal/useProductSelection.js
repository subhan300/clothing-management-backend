
import "./product.css"

// Custom Hook to handle product selection
const useProductSelection = (selectedProduct, setSelectedProduct,setProducts,data,propProduct, setTriggerState,triggerState) => {
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
  
  const toggleProductSelection = (product) => {
    const isProductSelected = selectedProduct.some((selectedProduct) => selectedProduct._id === product._id);

    if (isProductSelected) {
      const updatedProducts = selectedProduct.filter((selectedProduct) => selectedProduct._id !== product._id);
      const updatedData=dataSetsOfModalOnToggleUpdate(data)
      setProducts(updatedData);

      setSelectedProduct(updatedProducts);
     
   setTriggerState(!triggerState)
    } else {
      setSelectedProduct([...selectedProduct, product]);
    }
  };
const isProductSelected=(product,selectedProducts)=>{
   return selectedProducts.some(val=>val._id === product._id)
}

  return { selectedProduct, toggleProductSelection ,isProductSelected };
};

export default useProductSelection;