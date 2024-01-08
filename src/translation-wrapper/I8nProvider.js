import React, { createContext, useEffect, useState } from 'react';
import i18n from 'i18next';

export const I18nContext = createContext();

function I18nProvider({ children }) {
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  return (
    <I18nContext.Provider value={{ selectedLanguage, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export default I18nProvider;
