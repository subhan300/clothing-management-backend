import { Button } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { I18nContext } from "../../translation-wrapper/I8nProvider";
import { SystemSettingsStyle } from "./SystemSettingStyle";

function SystemSettings() {
  const { t } = useTranslation();

  const { changeLanguage, selectedLanguage } = useContext(I18nContext);

  const handleChangeLanguage = (lng) => {
    changeLanguage(lng);
  };

  return (
    <SystemSettingsStyle>
      <div className="system-lng-btn flex " >
        <Button className="btn" onClick={() => handleChangeLanguage("en")}>
          english
        </Button>
        <Button className="btn" onClick={() => handleChangeLanguage("de")}>
          germany
        </Button>
      </div>
      <h1 className="selected-lng">Selected Language : {selectedLanguage}</h1>
    </SystemSettingsStyle>
  );
}

export default SystemSettings;
