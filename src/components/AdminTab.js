import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFileInvoice, FaUsers, FaUserTie, FaUserPlus } from 'react-icons/fa';
import { BsFiletypeCsv, BsPlusSquare, BsImage } from 'react-icons/bs';
import { MdBusiness, MdOutlineInventory, MdOutlineDashboard } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

function AdminTab({ elements }) {
  const {t}=useTranslation();
  const data = [
    {
      id: 1,
      icon: <MdOutlineDashboard />,
      label: 'Dashboard',
      path: ''
    },
    {
      id: 2,
      icon: <FaFileInvoice />,
      label: 'Orders',
      path: 'orders'
    },
    {
      id: 3,
      icon: <FaUsers />,
      label: 'Employee',
      path: 'employee'
    },
    {
      id: 4,
      icon: <FaUserTie />,
      label: 'Manager',
      path: 'manager'
    },
    {
      id: 5,
      icon: <BsFiletypeCsv />,
      label: 'Products',
      path: 'upload-company'
    },
    {
      id: 6,
      icon: <BsPlusSquare />,
      label: 'Add Company',
      path: 'add-company'
    },
    {
      id: 7,
      icon: <FaUserPlus />,
      label: 'Add Manager',
      path: 'add-manager'
    },
    {
      id: 8,
      icon: <FaUserPlus />,
      label: 'Add Employee',
      path: 'add-employee'
    },
    // {
    //   id: 9,
    //   icon: <MdOutlineInventory />,
    //   label: 'Inventory',
    //   path: 'inventory'
    // },
    {
      id: 10,
      icon: <BsImage />,
      label: 'All Products',
      path: 'all-products'
    },
    {
      id: 11,
      icon: <MdBusiness />,
      label: 'All Companies',
      path: 'all-companies'
    },
  ];
  const [activeTab, setActiveTab] = useState(1);
  const [showAddDataTabs, setShowAddDataTabs] = useState(false);

  const handleAddDataClick = () => {
    setShowAddDataTabs(!showAddDataTabs);
  };

  const sidebarTabs = data.filter(
    (item) => item.id !== 5 && item.id !== 6 && item.id !== 7 && item.id !== 8
  );

  const dropdownTabs = [
    {
      id: 6,
      icon: <BsPlusSquare />,
      label: 'Add Company',
      path: 'add-company'
    },
    {
      id: 7,
      icon: <FaUserPlus />,
      label: 'Add Manager',
      path: 'add-manager'
    },
    {
      id: 8,
      icon: <FaUserPlus />,
      label: 'Add Employee',
      path: 'add-employee'
    },
    {
      id: 5,
      icon: <BsFiletypeCsv />,
      label: 'Products',
      path: 'upload-company'
    },
  ];

  return (
    <div>
      <aside style={{zIndex:"9888"}} className="fixed top-14 left-0 z-40 whitespace-nowrap w-14 hover:w-72 h-screen transition-all duration-500 ease-in-out transform -translate-x-full sm:translate-x-0">
        <div className="h-full pl-3 py-4 overflow-y-auto bg-[#dfdfdf]">
          <ul className="space-y-2 mt-7">
            {sidebarTabs.map((item) => (
              <Link to={item.path} key={item.id}>
                <li className={activeTab === item.id ? 'border-r-4 border-black' : ''}>
                  <span
                    onClick={() => setActiveTab(item.id)}
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="material-symbols-rounded w-6 h-6 text-gray-900 transition duration-75">
                      {item.icon}
                    </span>
                    <span className="ml-3">{t(item.label)}</span>
                  </span>
                </li>
              </Link>
            ))}
            <li>
              <span
                onClick={handleAddDataClick}
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <span className="material-symbols-rounded w-6 h-6 text-gray-900 transition duration-75">
                  <FaUserPlus />
                </span>
                <span className="ml-3">{t("Add New Data")}</span>
              </span>
              {showAddDataTabs && (
                <ul className="pl-6 mt-2 space-y-2 relative ml-[-10px]">
                  {dropdownTabs.map((item) => (
                    <Link to={item.path} key={item.id}>
                      <li
                        className={activeTab === item.id ? 'border-r-4 border-black' : ''}
                        onClick={() => setActiveTab(item.id)}
                      >
                        <span className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer">
                          <span className="material-symbols-rounded w-6 h-6 text-gray-900 transition duration-75">
                            {item.icon}
                          </span>
                          <span className="ml-3">{t(item.label)}</span>
                        </span>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </aside>
      <main className="ml-14 mb-5 p-10 top-[56px] relative">
        {elements}
      </main>
    </div>
  );
}

export default AdminTab;
