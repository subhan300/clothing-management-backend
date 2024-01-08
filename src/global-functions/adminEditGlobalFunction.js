import { Button, Form, Input, Popconfirm, Switch, Upload } from "antd";
import { ImCancelCircle, ImPencil } from "react-icons/im";
import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai";
import { RiMailSendLine } from "react-icons/ri"; // Import the email icon
import { SwitchStyle } from "./globalStyle";
import ImgCrop from "antd-img-crop";




const sortData = (data, key) => {
  return data.sort((a, b) => {
    return a[key] - b[key];
  });
};

const addSerialNo = (data) => {
  return data.map((val, i) => ({ ...val, SNO: i }));
};
// all companies
const companyColumns = (
  handleEdit,
  handleSave,
  editingRow,
  setEditingRow,
  setSelected,
  companyEdit,
  modalFileList,
  setModalFileList,
  handleModalFileDrop,
  deleteCompany,
  selectedCompanySet,t
) => {
  return [
    { title: !companyEdit && "SNO", dataIndex: !companyEdit && "SNO" },
    {
      title: t("Logo"),
      dataIndex: "companyLogo",
      render: (_, record) =>
        editingRow.state && editingRow.record._id === record._id ? (
          <Upload
            fileList={modalFileList}
            customRequest={() => {}}
            onChange={({ fileList }) => setModalFileList(fileList)}
          >
            <Button>{t("Select File")}</Button>
          </Upload>
        ) : (
          <img style={{ width: "38px" }} src={record.companyLogo} />
        ),
    },
    {
      title: t("Company"),
      dataIndex: "companyName",
      render: (text, record) =>
        editingRow.state && editingRow.record._id === record._id ? (
          <Input
            value={text}
            onChange={(e) => {
              handleEdit("companyName", e.target.value, record);
            }}
          />
        ) : (
          text
        ),
    },
    {
      title: t("Email"),
      dataIndex: "companyEmail",
      render: (text, record) =>
        editingRow.state && editingRow.record._id === record._id ? (
          <Input
            value={text}
            onChange={(e) => {
              handleEdit("companyEmail", e.target.value, record);
            }}
          />
        ) : (
          text
        ),
    },
    {
      title: t("Phone No"),
      dataIndex: "companyPhone",
      render: (text, record) =>
        editingRow.state && editingRow.record._id === record._id ? (
          <Input
            value={text}
            onChange={(e) => {
              handleEdit("companyPhone", e.target.value, record);
            }}
          />
        ) : (
          text
        ),
    },

    {
      title: t("Company Fax"),
      dataIndex: "companyFax",
      render: (text, record) =>
        editingRow.state && editingRow.record._id === record._id ? (
          <Input
            value={text}
            onChange={(e) => {
              handleEdit("companyFax", e.target.value, record);
            }}
          />
        ) : (
          text
        ),
    },
    {
      title: t("Location"),
      dataIndex: "companyLocation",
      render: (text, record) =>
        editingRow.state && editingRow.record._id === record._id ? (
          <Input
            value={text}
            onChange={(e) => {
              handleEdit("companyLocation", e.target.value, record);
            }}
          />
        ) : (
          text
        ),
    },

    {
      title: t("Pricing"),
      dataIndex: "pricingStatus",
      render: (text, record) =>
        editingRow.state && editingRow.record._id === record._id ? (
          <Input
            value={text}
            placeholder="Enter 0 or 1"
            type="number"
            onChange={(e) => {
              handleEdit("pricingStatus", e.target.value, record);
            }}
          />
        ) : record.pricingStatus ? (
          <AiFillCheckCircle style={{ color: "green", fontSize: "22px" }} />
        ) : (
          <AiFillCloseCircle style={{ color: "red", fontSize: "22px" }} />
        ),
    },
    {
      title: t("Budget"),
      dataIndex: "budgetStatus",

      render: (text, record) =>
        editingRow.state && editingRow.record._id === record._id ? (
          <Input
            value={text}
            placeholder="Enter 0 or 1"
            type="number"
            onChange={(e) => {
              handleEdit("budgetStatus", e.target.value, record);
            }}
          />
        ) : record.budgetStatus ? (
          <AiFillCheckCircle style={{ color: "green", fontSize: "22px" }} />
        ) : (
          <AiFillCloseCircle style={{ color: "red", fontSize: "22px" }} />
        ),
    },
   
    {
      title: <div style={{ textAlign: 'center' }}>{t("Action")}</div>,
      dataIndex: "action",
      width: "15%",
    
      render: (text, record) => {
        return companyEdit &&
          editingRow.state &&
          editingRow.record._id === record._id ? (
          <div className="flex gap-3">
            <Button
              // className="border-none"
              onClick={() => {
                handleSave(record);
                // setEditingRow({ state: !editingRow.state, record: record });
              }}
            >
              <span>{t("save")}</span>
            </Button>
            <Popconfirm
              title={t("Sure to cancel?")}
              okText={<p style={{ color: "black" }}>{t("Yes")}</p>}
              onConfirm={() => {
                setEditingRow((prev) => ({ ...prev, state: false }));
              }}
            >
              <Button>{t("Cancel")}</Button>
            </Popconfirm>
          </div>
        ) : (
          <div className="flex" style={{ gap: "2rem" }}>
            <Button
              className={`${companyEdit ? "border-none" : ""}`}
              onClick={() => {
                companyEdit
                  ? setEditingRow({ state: !editingRow.state, record: record })
                  : setSelected({ isSelected: true, record: record });
                selectedCompanySet(record);
                localStorage.setItem("edit", true);
              }}
            >
              {companyEdit ? (
                <span class="material-symbols-rounded">edit_square</span>
              ) : (
                <p>{t("Edit")}</p>
              )}
            </Button>
            <Popconfirm
              title={
                <div>
                  <p>{t("This will Delete the company")}</p>
                  <p>{t("it's managers")},</p>
                  <p>{t("and all his employees")}!!!</p>
                  <p>{t("Sure to DELETE?")}</p>
                </div>
              }
              okButtonProps={{ style: { background: "red" } }}
              okText={<p>{t("Yes")}</p>}
              onConfirm={() => {
                deleteCompany(record._id);
              }}
            >
              <Button danger style={{ backgroundColor: "red", color: "white" }}>
                <p>{t("Delete")}</p>
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};

const managerColumns = (
  handleEdit,
  handleSave,
  editingRow,
  setEditingRow,
  deleteManager,
  sendCredentials,t
) => {
  return [
    {
      title: t("Name"),
      dataIndex: "name",
      editable: true,
      
    },
    {
      title: t("Company"),
      dataIndex: "companyName",
      editable: false,
    },

    {
      title: t("Phone"),
      dataIndex: "managerPhone",
      editable: true,
      // render: (text, record) =>
      //   editingRow.state && editingRow.record._id === record._id ? (
      //     <Input
      //       value={text}
      //       onChange={(e) => {
      //         handleEdit("managerPhone", e.target.value, record);
      //       }}
      //     />
      //   ) : (
      //     text
      //   ),
    },
    {
      title: t("Email"),
      dataIndex: "managerEmail",
      editable: true,
      // render: (text, record) =>
      //   editingRow.state && editingRow.record._id === record._id ? (
      //     <Input
      //       value={text}
      //       onChange={(e) => {
      //         handleEdit("managerEmail", e.target.value, record);
      //       }}
      //     />
      //   ) : (
      //     text
      //   ),
    },
    {
      title: t("Password"),
      dataIndex: "managerPassword",
      editable: false,
    },

    {
      title: t("Action"),
      dataIndex: "action",
      width: 250,
      render: (text, record) =>
        editingRow.state && editingRow.record._id === record._id ? (
          <div className="flex gap-3">
            <Button
              onClick={() => {
                handleSave(record);
                setEditingRow({ state: !editingRow.state, record: record });
              }}
              style={{
                marginRight: 8,
              }}
            >
              {t("Save")}
            </Button>
            <Popconfirm
              title={t("Sure to cancel?")}
              okText={<p style={{ color: "black" }}>{t("Yes")}</p>}
              cancelText={<p style={{ color: "black" }}>{t("No")}</p>}
              onConfirm={() => {
                setEditingRow((prev) => ({ ...prev, state: false }));
              }}
            >
              <Button>{t("Cancel")}</Button>
            </Popconfirm>
          </div>
        ) : (
          <div className="flex" style={{ gap: "1rem" }}>
            <Button
              onClick={() => {
                // setEditingRow({ state: !editingRow.state, record: record });
                handleEdit(record)

              }}
              style={{ background: "gray", color: "white" }}
            >
              <ImPencil />
            </Button>
            <Popconfirm
              title={
                <div>
                  <p>{t("Sure to Send Credentials to Manager?")}</p>
                </div>
              }
              okButtonProps={{ style: { background: "red" } }}
              okText={<p>{t("Yes")}</p>}
              onConfirm={() => {
                sendCredentials(record);
              }}
            >
              <Button
                success
                style={{
                  backgroundColor: "teal",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RiMailSendLine style={{ marginRight: "0.5rem" }} />
                {t("Send")}
              </Button>
            </Popconfirm>

            <Popconfirm
              title={
                <div>
                  <p>{t("This will Delete the manager!")}</p>

                  <p>{t("Sure to delete?")}</p>
                </div>
              }
              okButtonProps={{ style: { background: "red" } }}
              okText={<p>{t("Yes")}</p>}
              onConfirm={() => {
                deleteManager(record._id);
              }}
            >
              <Button
                danger
                style={{ backgroundColor: "red", color: "white" }}
                icon={<ImCancelCircle />}
              />
            </Popconfirm>
          </div>
        ),
    },
  ];
};

const genericCompanyColumns = (
   handleEdit,
      handleSave,
      editingRow,
      setEditingRow,
      selected,
      companyEdit,
      modalFileList,
      setModalFileList,
      handleModal,
      addProducts,
      selectedProducts,
      setIsCompanyProductModalOpen,
      onPreview,t
) => {
  return [
    {
      title: t("Logo"),
      dataIndex: "companyLogo",
      render: (_, record) =>
        editingRow.state && editingRow.record._id === record._id ? (
          <ImgCrop rotationSlider modalProps={{ okButtonProps: { style: { border: "1px solid #d9d9d9", color: "rgba(0, 0, 0, 0.88)" } } }}>
            <Upload
              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              // customRequest={()=>{return onSuccess("Ok")}}
              listType="picture-card"
              fileList={modalFileList}
              onChange={({ fileList }) => setModalFileList(fileList)}
              onPreview={onPreview}
            >
              {modalFileList.length < 1 && t("+ Upload")}
            </Upload>
          </ImgCrop>
        ) : (
          <img style={{ width: "38px" }} src={record.companyLogo} />
        ),
    },
    {
      title: t("Company"),
      dataIndex: "companyName",
      editable: true,
    },
    {
      title: t("Email"),
      dataIndex: "companyEmail",
      editable: true,
    },
    {
      title: t("Phone No"),
      dataIndex: "companyPhone",
      editable: true,
    },

    {
      title: t("Company Fax"),
      dataIndex: "companyFax",
      editable: true,
    },
    {
      title: t("Location"),
      dataIndex: "companyLocation",
      editable: true,
    },
    {
      title: t("Pricing"),
      dataIndex: "pricingStatus",
      // editable: true,
      render: (_, record) => {
        return editingRow.state ? (
          <SwitchStyle>
            <Switch
              style={{ background: "red" }}
              checked={convertBoolean(editingRow.pricingStatus)}
              onChange={(e) => {
                setEditingRow((prev) => ({
                  ...prev,
                  pricingStatus: convertBooleanZeroAndOne(e),
                  budgetStatus: !e ? false : prev.budgetStatus,
                }));
              }}
            />
          </SwitchStyle>
        ) : convertBoolean(editingRow.pricingStatus) ? (
          <AiFillCheckCircle style={{ color: "green", fontSize: "22px" }} />
        ) : (
          <AiFillCloseCircle style={{ color: "red", fontSize: "22px" }} />
        );
      },
    },
    {
      title: t("Budget"),
      dataIndex: "budgetStatus",
      // editable: true,
      render: (_, record) => {
        return editingRow.state ? (
          <SwitchStyle>
            <Switch
              style={{ background: "red" }}
              checked={convertBoolean(editingRow.budgetStatus)}
              disabled={!editingRow.pricingStatus}
              onChange={(e) => {
                setEditingRow((prev) => ({
                  ...prev,
                  budgetStatus: !prev.pricingStatus
                    ? false
                    : convertBooleanZeroAndOne(e),
                }));
              }}
            />
          </SwitchStyle>
        ) : convertBoolean(editingRow.budgetStatus) ? (
          <AiFillCheckCircle style={{ color: "green", fontSize: "22px" }} />
        ) : (
          <AiFillCloseCircle style={{ color: "red", fontSize: "22px" }} />
        );
      },
    },

    {
      title: t("Action"),
      dataIndex: "action",
      width: "17%",
      render: (text, record) => {
        return companyEdit &&
          editingRow.state &&
          editingRow.record._id === record._id ? (
          <div className="flex gap-3">
            <Button
              // className="border-none"
              onClick={() => {
                handleSave(record._id);
              }}
            >
              <span>{t("save")}</span>
            </Button>
            <Popconfirm
              title={t("Sure to cancel?")}
              okText={<p style={{ color: "black" }}>{t("Yes")}</p>}
              cancelText={<p style={{ color: "black" }}>{t("No")}</p>}
              onConfirm={() => {
                setEditingRow((prev) => {
                  return {
                    ...prev,
                    state: false,
                    budgetStatus: prev.record.budgetStatus,
                    pricingStatus: prev.record.pricingStatus,
                  };
                });
              }}
            >
              <Button>{t("Cancel")}</Button>
            </Popconfirm>
          </div>
        ) : (
          <div className="flex" style={{ gap: ".3rem" }}>
            <Button
              onClick={() => {
                companyEdit && handleEdit(record);
              }}
              style={{ background: "gray", color: "white" }}
            >
              <ImPencil />
            </Button>

            <Button
              success
              style={{ backgroundColor: "green", color: "white" }}
              onClick={() => {
                selectedProducts();
              }}
            >
              {t("Company Products")}
            </Button>
            <Button
              success
              style={{ backgroundColor: "orange", color: "white" }}
              onClick={() => {
                addProducts();
              }}
            >
              {t("Add Products")}
            </Button>
          </div>
        );
      },
    },
  ];
};

const convertBoolean = (value) => {
  if (value === 1) return true;
  else if (value === 0) return false;
  else return value;
};
const convertBooleanZeroAndOne = (value) => {
  if (value === true) return 1;
  else if (value === false) return 0;
  else return value;
};

export const employeesColumn = (
  handleEdit,
  handleSave,
  editingRow,
  setEditingRow,
  deleteEmployee,
  attachProducts,
  companySetting,
  addEmployeeProducts,
  sendCredentials,t
) => {
  return [
    { title: t("SNO"), dataIndex: "SNO" },
    {
      title: t("Name"),
      dataIndex: "employeeName",
      editable: true,
    },
    {
      title: t("Email"),
      dataIndex: "employeeEmail",
      editable: true,
    },
    {
      title: t("Phone No"),
      dataIndex: "employeePhone",
      editable: true,
    },
    {
      title: t("Password"),
      dataIndex: "employeePassword",
      editable: false,
    },
    {
      title: t("Gender"),
      dataIndex: "gender",
      editable: true,
    },
    {
      title: t("Budget"),
      dataIndex: "budget",
      editable: false
      // companySetting?.budgetStatus ? true : false,
    },

    
    {
      title: t("Action"),
      dataIndex: "action",
      render: (text, record) =>
        editingRow.state && editingRow.record._id === record._id ? (
          <div className="flex gap-3">
            <Button
              onClick={() => {
                handleSave(record._id);
              }}
              style={{
                marginRight: 8,
              }}
            >
              {t("Save")}
            </Button>
            <Popconfirm
              title={t("Sure to cancel?")}
              okText={<p style={{ color: "black" }}>{t("Yes")}</p>}
              cancelText={<p style={{ color: "black" }}>{t("No")}</p>}
              onConfirm={() => {
                setEditingRow((prev) => ({
                  ...prev,
                  state: false,
                  record: {},
                }));
              }}
            >
              <Button>{t("Cancel")}</Button>
            </Popconfirm>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              onClick={() => {
                handleEdit(record);
              }}
              style={{ background: "gray", color: "white" }}
            >
              <ImPencil />
            </Button>

            <Button
              success
              style={{ backgroundColor: "green", color: "white" }}
              onClick={() => {
                attachProducts(record);
              }}
            >
              {t("Attached Products")}
            </Button>

            <Button
              success
              style={{ backgroundColor: "orange", color: "white" }}
              onClick={() => {
                addEmployeeProducts(record);
              }}
            >
              {t("Add Products")}
            </Button>
            <Popconfirm
              title={
                <div>
                  <p>{t("Sure to Send Credentials to Employee?")}</p>
                </div>
              }
              okButtonProps={{ style: { background: "red" } }}
              okText={<p>{t("Yes")}</p>}
              cancelText={<p style={{ color: "black" }}>{t("No")}</p>}
              onConfirm={() => {
                sendCredentials(record);
              }}
            >
              <Button
                success
                style={{
                  backgroundColor: "teal",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RiMailSendLine
                // style={{ marginRight: "0.5rem" }}
                />
                {/* Send */}
              </Button>
            </Popconfirm>
            <Popconfirm
              title={
                <div>
                  <p>{t("This will Delete the employee!")}</p>

                  <p>{t("Sure to Delete?")}</p>
                </div>
              }
              okButtonProps={{ style: { background: "red" } }}
              okText={<p>{t("Yes")}</p>}
              cancelText={<p style={{ color: "black" }}>{t("No")}</p>}
              onConfirm={() => {
                deleteEmployee(record._id);
              }}
            >
              <Button
                danger
                style={{ backgroundColor: "red", color: "white" }}
                icon={<ImCancelCircle />}
              />
            </Popconfirm>
          </div>
        ),
    },
  ];
};
const restrictInputToPositiveIntegers = (e) => {
  e.target.value = e.target.value.replace(/[^0-9€,]/g, '');


 };

const employeeEditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
const inputNode = inputType === "budget" ?  <Input onInput={restrictInputToPositiveIntegers} min={0} type="number"></Input> :<Input   />;  // const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "text" ? <Input /> : "";
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const generateRandomPassword = () => {
  const length = 6;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

export const adminEditGlobalFunctions = {
  companyColumns,
  sortData,
  managerColumns,
  addSerialNo,
  employeesColumn,
  genericCompanyColumns,
  EditableCell,
  convertBoolean,
  employeeEditableCell,
  generateRandomPassword,
  restrictInputToPositiveIntegers
};
