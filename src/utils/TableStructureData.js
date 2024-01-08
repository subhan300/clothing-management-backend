const orderColumnWithBudget = [
  { label: "S.N.O", type: "name" },
  { label: "Employee", type: "name" },
  { label: "Products", type: "slider" },
  { label: "Request Budget", type: "name" },
  { label: "Budget", type: "name" },
  { label: "All Products", type: "action" },
  { label: "Add", type: "action" },
];
const orderColumnWithOUTBudget = [
  { label: "S.N.O", type: "name" },
  { label: "Employee", type: "name" },
  { label: "Products", type: "slider" },

  { label: "All Products", type: "action" },
  { label: "Add", type: "action" },
];
const columns = (budgetStatus) =>
  budgetStatus ? orderColumnWithBudget : orderColumnWithOUTBudget;

const employeeOrderBudgetColumns = (budgetStatus) => {
  let data = [
    { label: "S.N.O", type: "name" },
    { label: "Employee", type: "name" },
  
    { label: "Budget", type: "name" },
    { label: "Request Budget", type: "input" },
    // { label: "Products", type: "action" },
    { label: "Products", type: "slider" },
    { label: "Add Items", type: "action" },
  ];
  if (budgetStatus) {
    return data;
  } else {
    data.splice(2, 2);
    return data;
  }
};
let employeeDataWithBudget = [
  { label: "S.N.O", type: "name" },
  { label: "Employee", type: "name" },
  { label: "Company", type: "name" },
  { label: "Email", type: "name" },
  {label: "Password",type:"name"},
  { label: "Phone", type: "name" },

  { label: "Gender", type: "name" },
  { label: "Budget", type: "name" },
 
];
let employeeDataWithOUTBudget = [
  { label: "S.N.O", type: "name" },
  { label: "Employee", type: "name" },
  { label: "Company", type: "name" },
  { label: "Email", type: "name" },
  {label:  "Password",type:"name"},
  { label: "Phone", type: "name" },
  { label: "Gender", type: "name" },
];
const employeeColumns = (budgetStatus) =>{
  
  return  budgetStatus?employeeDataWithBudget:employeeDataWithOUTBudget;
}



const managerColumns = [
  { label: "S.N.O", type: "name" },
  { label: "Manager", type: "name" },
  { label: "Company", type: "name" },
  { label: "Email", type: "name" },
  { label: "Password", type: "name" },
  { label: "Phone", type: "name" },

  // { label: "Password", type: "name" },
];

const orderColumns = [
  { label: "S.N.O", type: "name" },
  { label: "Employee", type: "name" },
  { label: "Products", type: "slider" },
  { label: "Bill", type: "name" },
];

const adminOrderColumns = (pricingStatus)=>{
  return(pricingStatus?[
    { label: "Invoice", type: "name" },
    { label: "Ordered by", type: "name" },
    { label: "Company", type: "name" },
    { label: "Nr. of Products", type: "name" },
    // { label: "Products", type: "slider" },
    { label: "Bill", type: "name" },
    { label: "Created at", type: "name" },
    { label: "Action", type: "slider" },
  ]:[ { label: "Invoice", type: "name" },
  { label: "Ordered by", type: "name" },
  { label: "Company", type: "name" },
  { label: "Nr. of Products", type: "name" },

  { label: "Created at", type: "name" },
  { label: "Action", type: "slider" },])
}

const budgetRequestColumns = [
  { label: "S.N.O", type: "name" },
  { label: "Employee", type: "name" },
  { label: "Request Amount", type: "name" },
  { label: "Actual Budget", type: "name" },
  // { label: "Approved Amount", type: "name" },
  { label: "Update Budget", type: "input" },
  { label: "Request Status", type: "name" },
  { label: "select", type: "input" },
  // {label:"Result",type:"checkbox",result:"result"},
  { label: "Action", type: "action" },
];

let sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: false,
};

export const tableStructureData = {
  columns,
  sliderSettings,
  employeeColumns,
  orderColumns,
  budgetRequestColumns,
  employeeOrderBudgetColumns,
  managerColumns,
  adminOrderColumns,
};
