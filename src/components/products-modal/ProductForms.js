import { Form } from "antd";
import React from "react";
import { Button, Col,  Row } from "antd";
import Line from "../../assets/line.png";
import {
  CustomTextArea,
  InputWrapper,
} from "../../pages/Style";
import { PlusOutlined } from "@ant-design/icons";

let count = 0;

function SourceDetails({
  handleFormValChange,
  sumMaxUsers,
  maxUsers,
  onFinish,
  RefStep2,
  step2Data,
  setStep2Data,
}) {
 
  const addDefaultSourceDetail = () => {
    count++;
    setStep2Data((prev) => [
      ...prev,
      {
        key: count,
        name: "",
        description: "",
        maxUsers: "",
        maxUsagesPerUser: "",
      },
    ]);
  };
  
  const removeDefaultSourceDetail = (key) => {
    setStep2Data((prev) => prev.filter((val) => val.key !== key));
  };

  return (
    <div style={{ paddingTop: "1px" }}>
      <Form
        ref={RefStep2}
        name="dynamic_form_complex"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{sourceDetails: step2Data,}}
        onFieldsChange={(val) => {
          handleFormValChange(val[0].name[2], val[0].value, val[0].name[1]);
        }}
      >
        <Form.List name="sourceDetails">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field) => (
                  <div key={field.key}>
                    <div
                      style={{
                        marginTop: "14px",
                        marginBottom: "25px",
                        position: "relative",
                      }}
                    >
                      {!!field.name &&  (
                        <div>
                          <img
                            style={{ width: "100%", height: "100%" }}
                            src={Line}
                          ></img>
                        </div>
                      )}
                    </div>
                    <Row
                      key={field.key}
                      gutter={[10, 0]}
                      style={{ paddingTop: "8px", position: "relative" }}
                    >
                      {step2Data.length>1 && (
                        <div
                          className="delete_btn"
                          style={{
                            position: "absolute",
                            top: !field.name ? "-8px" : "32px",
                          }}
                          onClick={() => {
                            remove(field.name);
                            removeDefaultSourceDetail(field.key);
                          }}
                        >
                          <svg
                            viewBox="64 64 896 896"
                            focusable="false"
                            data-icon="delete"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                          </svg>
                        </div>
                      )}

                      <Col span={6}>
                        <div>
                          <label className="label">Source Name:</label>
                          <Form.Item
                            name={[field.name, "name"]}
                            rules={[
                              {
                                required: true,
                                message: "source name is required",
                              },
                            ]}
                          >
                            <InputWrapper
                              color={"true"}
                              placeholder="Source Name"
                            />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={6}>
                        <div>
                          <label className="label">Maximum Users:</label>

                          <Form.Item
                            name={[field.name, "maxUsers"]}
                            rules={[
                              {
                                required: true,
                                message:
                                  sumMaxUsers > +maxUsers
                                    ? "sum max can not be greatet than max users "
                                    : "max user required",
                                validator: async (_, val) =>
                                  !val
                                    ? Promise.reject()
                                    : sumMaxUsers > +maxUsers &&
                                      Promise.reject(),
                              },
                            ]}
                          >
                            <InputWrapper
                              type="number"
                              placeholder="Maximum Users"
                              color={"true"}
                            />
                          </Form.Item>
                        </div>
                        <Row
                          style={{
                            position: "absolute",
                            left: "2px",
                            top: "72px",
                          }}
                        >
                          
                        </Row>
                      </Col>
                      <Col span={6}>
                        <label className="label">Max Usages Per User:</label>
                        <Form.Item
                          name={[field.name, "maxUsagesPerUser"]}
                          rules={[
                            {
                              required: true,
                              message: "max users is required",
                            },
                          ]}
                        >
                          <InputWrapper
                            type="number"
                            placeholder="Max Usages Per User"
                            color={"true"}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <label className="label label-des">
                          Source Description
                        </label>
                        <Form.Item
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "description is required",
                            },
                          ]}
                          name={[field.name, "description"]}
                        >
                          <CustomTextArea placeholder="Source Description"></CustomTextArea>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}

                <div style={{ display: "flex", justifyContent: "flex-start",padding:"16px 0",marginTop:"-16px" }}>
                  <Button
                    
                    type="link"
                    onClick={() => {
                      add();
                      addDefaultSourceDetail();
                    }}
                    style={{
                      color: "black",
                      fontSize: "14px",
                      fontWeight: "600",
                      lineHeight: "1.43",
                      color: "#00b7c0",
                      padding:"0"
                    }}
                    icon={<PlusOutlined />}
                  >
                    Add Source
                  </Button>
                </div>
              </>
            );
          }}
        </Form.List>
      </Form>
    </div>
  );
}

export default SourceDetails;