import { Input } from "antd";
import styled from "styled-components";

export const ProductDrawerStyle = styled.div`
  /* border:1px solid red; */
`;

export const ProductStyle = styled.div`
  
  & .ant-form-item{
    margin-bottom:0px !important;
    margin-top:4px !important;
  }
`
// .product_content {
//   position: absolute;
//   top: 0;
//   left: 0;
//   padding: 0.7rem 1rem;
//   color:${props=>props.productSelected?"white":""};
//   width: 100%;
//   height: 100%;
// }

// background-color: black;

export const CustomInput=styled(Input)`
border:1px solid gray;
width:120px !important;
height:30px !important;
margin-top:0px !important;

color:${props=>props.disabled?"black !important":""};

`