import React from "react";
import { useTranslation } from "react-i18next";
import { Table, Tag } from "antd";
// import { formatPrice } from "../global-functions/GlobalFunctions";

function formatPrice(price) {
  return Number(price).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}


function Drawer(props) {
  const { t } = useTranslation();
  const { selectedRow, pricingStatus } = props;

  const columnsWithBill = [
    {
      title: t("Invoice"),
      dataIndex: "SNO",
      key: "SNO",
      render: (text) => (
        <Tag
          style={{ fontSize: "0.9rem" }}
          color={text?.length > 5 ? "geekblue" : "green"}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: t("Ordered by"),
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tag
          style={{ fontSize: "0.9rem" }}
          color={text?.length > 5 ? "geekblue" : "green"}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: t("Company"),
      dataIndex: "company",
      key: "company",
      render: (text) => (
        <Tag
          style={{ fontSize: "0.9rem" }}
          color={text?.length > 5 ? "geekblue" : "green"}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: t("Nr. of Products"),
      dataIndex: "noOfProducts",
      key: "noOfProducts",
      render: (text) => (
        <Tag
          style={{ fontSize: "0.9rem" }}
          color={text?.length > 5 ? "geekblue" : "green"}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: t("Bill"),
      dataIndex: "bill",
      key: "bill",
      render: (text) => (
        <Tag
          style={{ fontSize: "0.9rem" }}
          color={text?.length > 5 ? "geekblue" : "green"}
        >{`${text}`}</Tag>
      ),
    },
    {
      title: t("Created at"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <Tag
          style={{ fontSize: "0.9rem" }}
          color={text?.length > 5 ? "geekblue" : "green"}
        >
          {text}
        </Tag>
      ),
    },
  ];
  const columns = [
    {
      title: t("Invoice"),
      dataIndex: "SNO",
      key: "SNO",
      render: (text) => (
        <Tag
          style={{ fontSize: "0.9rem" }}
          color={text?.length > 5 ? "geekblue" : "green"}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: t("Employee"),
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tag
          style={{ fontSize: "0.9rem" }}
          color={text?.length > 5 ? "geekblue" : "green"}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: t("Company"),
      dataIndex: "company",
      key: "company",
      render: (text) => (
        <Tag
          style={{ fontSize: "0.9rem" }}
          color={text?.length > 5 ? "geekblue" : "green"}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: t("Nr. of Products"),
      dataIndex: "noOfProducts",
      key: "noOfProducts",
      render: (text) => (
        <Tag
          style={{ fontSize: "0.9rem" }}
          color={text?.length > 5 ? "geekblue" : "green"}
        >
          {text}
        </Tag>
      ),
    },

    {
      title: t("Created at"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <Tag
          style={{ fontSize: "0.9rem" }}
          color={text?.length > 5 ? "geekblue" : "green"}
        >
          {text}
        </Tag>
      ),
    },
  ];

  const data = selectedRow ? [selectedRow] : [];
  
  return (
    <div
      style={{ zIndex: "9999" }}
      className={`${
        props.show ? "left-0" : "left-[-100%]"
      } fixed top-0 flex z-50 justify-center items-center h-screen w-screen transition-all duration-500 ease-in-out bg-[rgba(0,0,0,.6)]`}
    >
      <div className="relative overflow-scroll bg-white h-[90vh] w-[90vw] rounded-lg shadow-2xl p-2">
        <div className="table-container">
          <Table
            columns={pricingStatus ? columnsWithBill : columns}
            pastOrders={true}
            dataSource={data}
            pagination={false}
            bordered
            title={() => (
              <>
                <h1 className="text-lg font-extrabold">
                  {t("#Order Details")}
                </h1>
                <span
                  className="material-symbols-rounded font-extrabold cursor-pointer text-2xl"
                  onClick={() => props.setShow(!props.show)}
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                  }}
                >
                  close
                </span>
              </>
            )} // Table Title
          />
        </div>

        {selectedRow?.managerOrder?.length
          ? selectedRow?.orderInfo?.map((val) => {
              let bill = 0;

              return (
                <div
                  key={val?._id}
                  className=" relative flex flex-col sm:flex-row justify-between rounded-lg bg-gray-200 my-2 border-b border-gray-200 py-3 px-3"
                >
                  <div className="flex flex-col md:flex-row lg:flex-row">
                    <div className="flex flex-col ">
                      <div>
                        <div>
                          {val && (
                            <p className="text-sm mb-3 text-gray-500">
                              <span className="text-bold text-black">
                                {t("Employee")} :{" "}
                              </span>{" "}
                              <span
                                className="text-black "
                                style={{ fontWeight: "900" }}
                              >
                                {val.employeeName ?? selectedRow.name}
                              </span>{" "}
                            </p>
                          )}
                          {val?.products?.length !== undefined ? (
                            val.products.map((vals) => {
                             
                              bill += ((vals.productPrice)?? 0) * (vals.productQuantity ? vals.productQuantity : 1);
                             
                              return (
                                <div
                                  key={vals?._id}
                                  className="flex flex-between items-center xs:flex-col sm:flex-row "
                                >
                                  <div
                                    className="mb-4"
                                    style={{ width: "300px" }}
                                  >
                                    <h2 className="text-sm text-gray-500">
                                      {vals.productName}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                      {t("Size")}: {vals.productSize}
                                    </p>
                                    {pricingStatus ? (
                                  <p className="text-sm text-gray-500">
  {t("Price")}: {formatPrice(vals.productPrice ?? 0)}
                                  </p>
                                ) : (
                                  ""
                                )}
                                    <p className="text-sm text-gray-500">
                                      {t("Qty")}:{" "}
                                      {vals.productQuantity
                                        ? vals.productQuantity
                                        : 1}
                                    </p>
                                  </div>
                                  <div className="w-16">
                                    <img
                                      src={vals.productImage}
                                      alt={vals.productName}
                                    />
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex py-3 px-1 flex-between items-center xs:flex-col sm:flex-row ">
                              <div style={{ width: "300px" }}>
                                <h2 className="text-sm text-gray-500">
                                  {t(val.productName)}
                                </h2>
                                <p className="text-sm text-gray-500">
                                  {t("Size")}: {val.productSize}
                                </p>
                                {pricingStatus ? (
                                  <p className="text-sm text-gray-500">
  {t("Price")}: {formatPrice(val.productPrice ?? 0)}
                                  </p>
                                ) : (
                                  ""
                                )}
                                <p className="text-sm text-gray-500">
                                  {t("Qty")}:{" "}
                                  {val.productQuantity
                                    ? val.productQuantity
                                    : 1}
                                </p>
                              </div>
                              <div className="w-16">
                                <img
                                  src={val.productImage}
                                  alt={val.productName}
                                />
                              </div>
                            </div>
                          )}
                           {pricingStatus &&
      selectedRow?.managerOrder?.length > 0
        ? `${t("Total Bill")}: ${formatPrice(bill)}`
        : ""}
                        </div>
                      </div>
                    </div>*
                  </div>
                </div>
              );
            })
          : ""}
        {!selectedRow?.managerOrder?.length ? (
          <div className=" relative flex flex-col sm:flex-row justify-between rounded-lg bg-gray-200 my-2 border-b border-gray-200 py-3 px-3">
            <div className="flex flex-col md:flex-row lg:flex-row">
              <div className="flex flex-col ">
                <div>
                  <div>
                    <p className="text-sm mb-3 text-gray-500">
                      <span className="text-bold text-black">
                        {t("Employee")} :{" "}
                      </span>{" "}
                      <span
                        className="text-black "
                        style={{ fontWeight: "900" }}
                      >
                        {selectedRow?.name}
                      </span>{" "}
                    </p>

                    {selectedRow.orderInfo.map((vals) => {
                      // let bill=0;
                      //   bill +=
                      //     (vals.productPrice ?? 0) *
                      //     (vals.productQuantity ? vals.productQuantity : 1);
                      return (
                        <div
                          key={vals?._id}
                          className="flex flex-between items-center xs:flex-col sm:flex-row "
                        >
                          <div className="mb-4" style={{ width: "300px" }}>
                            <h2 className="text-sm text-gray-500">
                              {vals.productName}
                            </h2>
                            <p className="text-sm text-gray-500">
                              {t("Size")}: {vals.productSize}
                            </p>
                            <p className="text-sm text-gray-500">
                            {t("Price")}: {formatPrice(vals.productPrice ?? 0)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t("Qty")}:{" "}
                              {vals.productQuantity ? vals.productQuantity : 1}
                            </p>
                          </div>
                          <div className="w-16">
                            <img
                              src={vals.productImage}
                              alt={vals.productName}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {selectedRow?.managerOrder?.length > 0 ? (
          ""
        ) : (
          <p className="px-2 py-2">
  {t("Total Bill")}: {selectedRow?.bill}
          </p>
        )}
        {selectedRow?.managerOrder?.length > 0 && (
          <>
            <h1 className="text-lg font-bold text-gray-700">{t("Message")}: </h1>
            {selectedRow.comment !== "Write any message" ? (
              <p className="text-sm text-gray-500">{selectedRow.comment} </p>
            ) : (
              <p className="text-sm text-gray-500">{t("No Message")}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Drawer;
