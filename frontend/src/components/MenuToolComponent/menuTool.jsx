import React from "react";
import { NavLink } from "react-router-dom";
import "./menuTool.scss";

const MenuTool = () => {
  return (
    <div className="menu-tool">
      <ul>
        <li>
          <NavLink to="/online-shop" className={({ isActive }) => (isActive ? "active-link" : "")}>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1574_26993)">
                <path
                  d="M1.375 1.5H5.375L8.055 14.89C8.14644 15.3504 8.39691 15.764 8.76255 16.0583C9.12818 16.3526 9.5857 16.509 10.055 16.5H19.775C20.2443 16.509 20.7018 16.3526 21.0675 16.0583C21.4331 15.764 21.6836 15.3504 21.775 14.89L23.375 6.5H6.375M10.375 21.5C10.375 22.0523 9.92728 22.5 9.375 22.5C8.82272 22.5 8.375 22.0523 8.375 21.5C8.375 20.9477 8.82272 20.5 9.375 20.5C9.92728 20.5 10.375 20.9477 10.375 21.5ZM21.375 21.5C21.375 22.0523 20.9273 22.5 20.375 22.5C19.8227 22.5 19.375 22.0523 19.375 21.5C19.375 20.9477 19.8227 20.5 20.375 20.5C20.9273 20.5 21.375 20.9477 21.375 21.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1574_26993">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.375 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            Onlayn bozor
          </NavLink>
        </li>
        <li>
          <NavLink to="/announcements" className={({ isActive }) => (isActive ? "active-link" : "")}>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.125 7.5C12.125 6.43913 11.7036 5.42172 10.9534 4.67157C10.2033 3.92143 9.18587 3.5 8.125 3.5H2.125V18.5H9.125C9.92065 18.5 10.6837 18.8161 11.2463 19.3787C11.8089 19.9413 12.125 20.7044 12.125 21.5M12.125 7.5V21.5M12.125 7.5C12.125 6.43913 12.5464 5.42172 13.2966 4.67157C14.0467 3.92143 15.0641 3.5 16.125 3.5H22.125V18.5H15.125C14.3294 18.5 13.5663 18.8161 13.0037 19.3787C12.4411 19.9413 12.125 20.7044 12.125 21.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            E'lonlar
          </NavLink>
        </li>
        <li>
          <NavLink to="/news" className={({ isActive }) => (isActive ? "active-link" : "")}>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.875 11.5C7.26195 11.5 9.55113 12.4482 11.239 14.136C12.9268 15.8239 13.875 18.1131 13.875 20.5M4.875 4.5C9.11846 4.5 13.1881 6.18571 16.1887 9.18629C19.1893 12.1869 20.875 16.2565 20.875 20.5M6.875 19.5C6.875 20.0523 6.42728 20.5 5.875 20.5C5.32272 20.5 4.875 20.0523 4.875 19.5C4.875 18.9477 5.32272 18.5 5.875 18.5C6.42728 18.5 6.875 18.9477 6.875 19.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Yangiliklar
          </NavLink>
        </li>
        <li>
          <NavLink to="/courses" className={({ isActive }) => (isActive ? "active-link" : "")}>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.625 22.5C18.1478 22.5 22.625 18.0228 22.625 12.5C22.625 6.97715 18.1478 2.5 12.625 2.5C7.10215 2.5 2.625 6.97715 2.625 12.5C2.625 18.0228 7.10215 22.5 12.625 22.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.625 8.5L16.625 12.5L10.625 16.5V8.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Kurslar
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default MenuTool;
