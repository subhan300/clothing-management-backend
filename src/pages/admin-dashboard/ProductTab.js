import React, { useState } from "react";
import { Product } from "../../assets/images/index";
import { useUploadCompanyMutation } from "../../apis";
import { useDispatch } from "react-redux";
import { errorPopup, showPopup } from "../../redux-slice/UserSliceAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FileUpload from "../../global-functions/ImageGeneration";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

function ProductTab() {
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    setFile(file);
  };
  const navigate = useNavigate();
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    setLoader(true);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        "http://localhost:3977/api/upload/upload-file",
        formData,
        config
      );

      setLoader(false);
      dispatch(
        showPopup({ state: true, message: t("File Uploaded SucessFully") })
      );
      setFile(null);
      event.target.value = null;
    } catch (error) {
      setLoader(false);
      dispatch(
        errorPopup({
          state: true,
          message: t(
            "plz check , Is your csv in correct pattern and try again"
          ),
        })
      );
    }
  };

  return (
    <div>
      {/* Original code - Commented out for reference */}
      {/* <FileUpload /> */}
      {/* <h1 className="text-2xl font-semibold">{t("Upload Company")}</h1> */}
      {/* <div className="grid md:grid-cols-2 md:gap-6 my-5"> */}
      {/*   <div> */}
      {/*     <form onSubmit={handleFormSubmit}> */}
      {/*       <div className="relative z-0 w-full mb-6 group"> */}
      {/*         <input */}
      {/*           type="file" */}
      {/*           onChange={(e) => { */}
      {/*             handleFileUpload(e); */}
      {/*           }} */}
      {/*           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" */}
      {/*           required */}
      {/*           accept=".csv" */}
      {/*         /> */}
      {/*         <label */}
      {/*           for="floating_email" */}
      {/*           className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" */}
      {/*         ></label> */}
      {/*       </div> */}
      {/*       <button */}
      {/*         type="submit" */}
      {/*         className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" */}
      {/*       > */}
      {/*         {loader ? <h1>{t("Loading")}....</h1> : t("Add Company")} */}
      {/*       </button> */}
      {/*     </form> */}
      {/*   </div> */}
      {/*   <div className="hidden md:block"> */}
      {/*     <img src={Product} alt="" /> */}
      {/*   </div> */}
      {/* </div> */}

      {/* New code - Display only image and "Coming Soon" text */}
      <div>
        
          <div className="md:text-center">
            <img src={Product} alt="" className="mx-auto w-1/2" />
            <p className="text-2xl font-semibold mt-5">{t("Coming Soon!")}</p>
          </div>
        </div>
      </div>
 
  );
}

export default ProductTab;
