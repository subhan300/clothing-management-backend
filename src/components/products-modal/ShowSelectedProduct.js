import { Image, Row } from "antd";
import React from "react";

function ShowSelectedProduct(props) {
  const { selectedImage, closeDrawer, showDrawer, saveBtn } = props;
  return (
    <Row
      className={`${
        showDrawer ? "flex bottom-0" : "-bottom-full"
      } mt-2 p-2 relative transition-transform duration-500 ease-in-out`}
    >
      <Image
        className="!h-[100px] !w-[130px]"
        src={selectedImage.productImage}
        preview={false}
        alt={"..."}
      />
      <div className="ml-2">
        <h2 className="text-lg font-semibold">
          Product Name :{selectedImage.productName}
        </h2>
        {saveBtn && (
          <>
            <p className="text-sm font-medium">
              {selectedImage.productDescription}{" "}
            </p>
            <p className="text-sm font-medium">
              Price : {selectedImage.productPrice}{" "}
            </p>
            <p className="text-sm font-medium">
              Size : {selectedImage.productSize}{" "}
            </p>
          </>
        )}
      </div>

      <div
        className="absolute top-1 right-1 text-black cursor-pointer"
        onClick={closeDrawer}
      >
        <span className="material-symbols-rounded">close</span>
      </div>
    </Row>
  );
}

export default ShowSelectedProduct;
