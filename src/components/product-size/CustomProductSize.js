import React,{useState} from 'react'
import "./CustomProductSize.css"
import { useTranslation } from 'react-i18next';
function CustomProductSize({row,customHandleUpdate,value,product}) {
    const [size,setSize]=useState(value);
    const { t, i18n } = useTranslation();
  const  handleChange=(key,value)=>{
      setSize(value);
      customHandleUpdate(key,value,row,product)

    }
  return (
    <div className='input_size_div' >
        <span>{t("size")} : &nbsp;</span>
      <input className='input_size'  placeholder={t('size')} value={size} onChange={(e)=>{handleChange("productSize",e.target.value.toUpperCase())}} ></input>
    </div>
  )
}

export default CustomProductSize
