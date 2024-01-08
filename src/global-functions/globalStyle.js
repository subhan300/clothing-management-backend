import { Select } from "antd";
import styled from "styled-components";

export const SwitchStyle = styled.div`
  & .ant-switch-checked {
    background-color: green !important;
  }
  & .ant-switch-inner {
    & .ant-switch-unchecked {
      background-color: red !important;
    }
    & .ant-switch-checked {
      background-color: green !important;
    }
  }
  & .ant-switch-unchecked {
    background-color: red !important;
  }
`;

export const CustomSelect = styled(Select)`


`;

export const CustomCropModalWrapper=styled.div`
& .ant-modal-content{
  border:2px solid red !important
}
& .ant-modal-footer .ant-btn-primary {
  background-color: red !important; /* Change to your desired color */
  border-color: red !important; /* Change to your desired color */
  color: white; /* Change to your desired color */
}

& .ant-modal-footer .ant-btn-primary:hover {
  background-color: darkred; /* Change to your desired hover color */
  border-color: darkred; /* Change to your desired hover color */
}
button{
  background-color: white !important;
  color:black !important;
  border:1px solid #d9d9d9 !important;
}
`