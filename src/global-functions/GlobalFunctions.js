import { Cloudinary } from "cloudinary-core";
import { useGetCompanyDetailsQuery } from "../apis";
import { companySettingsAction } from "../redux-slice/AdminSliceReducer";
// function formatPrice(price) {
//   return Number(price).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
// }

function convertToRegularNumber(number) {

  // Remove all non-numeric characters
  const cleanedNumber =typeof number==="string"?number.replace(/[^0-9]/g, ''):number

  // Convert the result to a regular number and return it
  return Number(cleanedNumber);
}
function formatPrice(price) {
  // Convert price from € to cents
 const  priceCents = Math.round(price * 100);

  // Convert to localized currency string and return
  return (priceCents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

export const tableDataFormatConverter = (data) => {
  let tableData = data[0].employees.map((employee, i) => {
    // const product = data.products.find((p) => p._id === employee.productId);
    const product = data[0].products.find((p) => p._id === employee.productId);

    return {
      SNO: i + 1,
      id: employee._id,
      name: employee.employeeName,
      budget:employee.budget,
      slider: {
        showProducts: product ? product.products : [],
        name: "All Products",
      },
      action: { name: "Add To Cart", showProducts: [] },
      employeeEmail: employee.employeeEmail,
    };
  });

  return tableData;
};

export const employeeTableDataFormatConverter = (data) => {
  let tableData = data.map((val, i) => {
    let email = val.employeeEmail ? val.employeeEmail : "-";
    let password = val?.employeePassword ? val.employeePassword : "-";
    let phone = val?.employeePhone ? val.employeePhone : "-";
    return {
      SNO: i + 1,
      id: val._id,
      name: val.employeeName,
      company: val.companyName,
     email,
     password,
     phone,
      gender: val.gender,
      budget: val.budget,
    };
  });
  return tableData;
};

export const employeeTableAdminDataFormatConverter = (data) => {
  let tableData = data.map((val, i) => {
    return {
      SNO: i + 1,
      id: val._id,
      name: val.employeeName,
      email: val.employeeEmail ?? "-",
      password: val.employeePassword?? "-",
      company: val.companyName,

      gender: val.gender?val.gender:"-",
      budget:val.budget ? val.budget : "-",
      phone: val.employeePhone ? val.employeePhone : "-",
    };
  });
  return tableData;
};

export const managerTableDataFormatConverter = (data) => {
  let tableData = data.map((val, i) => {
    return {
      SNO: i + 1,
      id: val._id,
      name: val.name,
      email: val.managerEmail,
      password: val.managerPassword,
      company: val.companyName,
      phone: val.managerPhone ? val.managerPhone : "-",
    };
  });
  return tableData;
};

export const orderTableDataFormatConverter = (data) => {
  let tableData = [];
  let filterManagerData = data[0].orders.filter(
    (val) => val?.managerOrder.length
  );
  if (filterManagerData.length > 0 && !filterManagerData.includes(undefined)) {
    for (let i = 0; i < filterManagerData.length; i++) {
      let tempTableData = filterManagerData[i].managerOrder.map(
        (managerOdr, b) => {
          return {
            SNO: filterManagerData[i].invoice,
            id: managerOdr.employeeId,
            name: data[0].employees.filter(
              (vals) => vals._id == managerOdr.employeeId
            )[0].employeeName,
            slider: {
              showProducts: [{ products: managerOdr.employeeProducts }],
              name: "All Products",
            },
            bill: formatPrice(managerOdr.bill),
            // budget: budget,})
          };
        }
      );
      tableData = [...tableData, ...tempTableData];
    }
  }

  return tableData;
};

export const orderTableDataAdminFormatConverter = (data) => {
  let tableData = data.map((val, i) => {
    let productArray;
    let temp;
    let quantity = 0;
    let totalBill = 0;
    if (val?.managerOrder?.length > 0) {
      productArray = val.managerOrder.map((vals) => {
        totalBill += vals.bill;
        quantity += vals.quantity ? vals.quantity : 1;

        return {
          products: vals.employeeProducts,
          employeeName: vals.employeeName,
        };
      });
    } else {
      totalBill = val.bill ?? 0;
      productArray = val.products.map((vals) => {
        quantity += vals.productQuantity ?? 1;

        return {
          products: vals.employeeProducts,
          employeeName: vals.employeeName,
        };
      });
    }
    return {
      SNO: val.invoice,
      id: val._id,
      name:
        val.managerOrder.length > 0
          ? val.managerOrder[0].name
          : val.employeeName,
      company: val.companyName,
      orderInfo: val.managerOrder.length > 0 ? productArray : val.products,
      createdAt: val.createdAt,
      noOfProducts: quantity,
      bill: formatPrice(totalBill),
      managerOrder: val.managerOrder,
      comment: val.comment,
    };
  });
  return tableData;
};


export const budgetRequestTableDataFormatConverter = (datas, t) => {
  const statusF = (status) => {
    if (status == 0) {
      return t("pending");
    } else if (status == 1) {
      return t("approved");
    } else {
      return t("rejected");
    }
  };
  const statusResult = (status) => {
    if (status == 0 || status == 1) {
      return false;
    } else {
      return true;
    }
  };
  let tableData = datas.map((data, i) => {
    return {
      SNO: i + 1,
      id: data._id,
      employeeId: data.employeeId,
      name: data.result[0].employeeName,
      requestAmount: `${data.requestAmount}`,
      budget: `${data.result[0].budget}`,
      allocateBudget: { value: 0, showBtn: false },
      status: statusF(data.status),
      select: { result: statusResult(data.status) },
      action: { name: "Save" },
    };
  });
  return tableData;
};

export const employeeOrderBudgetFormatConverter = (data) => {
  let tableData = data?.map((val, i) => {
    return {
      SNO: i + 1,
      id: val._id,
      name: val.employeeName,
      budget: val.budget,
      allocateBudget: { value: `${0}`, showBtn: true },
      slider: {
        showProducts: val?.products[0].products,
        productId: val.products[0]._id,

        name: "All Products",
      },
      action: { name: "Direct Order", showProducts: [] },
    };
  });
  return tableData;
};

const handleUpload = async (selectedFiles) => {
  const uploadPromises = Array.from(selectedFiles).map(async (file) => {
    const formData = new FormData();
    // handling both scenarios
    formData.append("file", file?.originFileObj || file);
    formData.append("upload_preset", "ml_default");
    formData.append("folder", "stickimages/stick-products"); // Specify the subfolder path here

    return await fetch(
      "https://api.cloudinary.com/v1_1/dtiffjbxv/image/upload",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const cloudinary = new Cloudinary({ cloud_name: "dtiffjbxv" });
        const imageUrl = cloudinary.url(data.public_id);
        return imageUrl;
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        return null;
      });
  });

  const ImageLinks = await Promise.all(uploadPromises)
    .then((uploadedImages) => {
      return uploadedImages;
    })
    .catch((error) => {
      console.error("Error uploading files:", error);
    });
  return ImageLinks;
};

function validateData(data, customKeysToCheck) {
  let emptyFields = [];

  if (!Array.isArray(customKeysToCheck)) {
    throw new Error("Invalid keysToCheck type. Expected an array.");
  }

  if (Array.isArray(data)) {
    emptyFields = data.reduce((fields, obj, index) => {
      const emptyObjFields = customKeysToCheck.filter((key) => !obj[key]);
      if (emptyObjFields.length > 0) {
        fields.push({ index, emptyFields: emptyObjFields });
      }
      return fields;
    }, []);
  } else if (typeof data === "object") {
    emptyFields = customKeysToCheck.filter((key) => !data[key]);
  } else {
    throw new Error("Invalid data type. Expected an object or an array.");
  }

  return {
    valid: emptyFields.length === 0,
    emptyFields: emptyFields,
  };
}

function searchContacts(data, value) {
  if (value === "") {
    return data;
  }

  const searchValue = value.toLowerCase();

  // Perform the search based on name, email, and phone
  const results = data.filter((contact) => {
    return Object.values(contact).some((property) => {
      return String(property).toLowerCase().includes(searchValue);
    });
  });

  return results;
}

function capitalizeFirstLetter(str) {
  if (!str) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}


const budgetOptions=[
  {
    value: '500',
    label: '500€',
  },
  {
    value: '1000',
    label: '1000€',
  },
  {
    value: '1500',
    label: '1500€',
  },
  {
    value: '2000',
    label: '2000€',
  },
 
]

const budgetRequestOptions=[
  {
    value: '500',
    label: '500€ +',
  },
  {
    value: '1000',
    label: '1000€ +',
  },
  {
    value: '1500',
    label: '1500€ +',
  },
  {
    value: '2000',
    label: '2000€ +',
  },
 
]

const refreshCompanySettings=async(dispatch,api)=>{
  
  const companyApiRes =await api.refetch()
  if(companyApiRes.data){
    dispatch(
      companySettingsAction({
        pricingStatus: companyApiRes.data.pricingStatus,
        budgetStatus: companyApiRes.data.budgetStatus,
        companyId: companyApiRes.data._id,
      })
    );
   }
}
const isGermanFormattedBudget = (budget) => {
  // Regular expression to match German formatted number (with or without decimal point)
  const germanFormatRegex = /^(\d{1,3}(\.\d{3})*|\d+)(,\d+)?$/;

  return germanFormatRegex.test(budget);
};


export const globalFunctions = {
  isGermanFormattedBudget,
  refreshCompanySettings,
  budgetOptions,
  tableDataFormatConverter,
  employeeTableDataFormatConverter,
  orderTableDataFormatConverter,
  budgetRequestTableDataFormatConverter,
  employeeOrderBudgetFormatConverter,
  orderTableDataAdminFormatConverter,
  managerTableDataFormatConverter,
  employeeTableAdminDataFormatConverter,
  handleUpload,
  validateData,
  searchContacts,
  capitalizeFirstLetter,
  formatPrice,
  convertToRegularNumber,
  budgetRequestOptions

};
