/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { useSelector } from "react-redux";
// import Badge from "react-bootstrap/Badge";
import { selectUser } from "../../../../../app/modules/Auth/_redux/authRedux";
// import IconButton from "@material-ui/core/IconButton";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const user = useSelector(selectUser);
  const [items, setItem] = useState([]);

  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

  useEffect(() => {
    // Fetch data on first load
    if (user.role === "Administrator") {
      const data = [
        {
          menu_id: 1,
          pid: 0,
          menu_name: "dashboard",
          title: "Dashboard",
          url: "/dashboard",
          icon: "/Design/Layers.svg",
          childs: [],
        },
        {
          menu_id: 1,
          pid: 0,
          menu_name: "Master Data",
          title: "Master Data",
          url: "/master-data",
          icon: "/Design/Layers.svg",
          childs: [
            {
              menu_id: 1,
              pid: 0,
              menu_name: "UOM",
              title: "UOM",
              url: "/master-data/uom",
              icon: "/Design/Layers.svg",
              childs: [],
            },
            // {
            //   menu_id: 1,
            //   pid: 0,
            //   menu_name: "Categories",
            //   title: "Categories",
            //   url: "/master-data/categories",
            //   icon: "/Design/Layers.svg",
            //   childs: [],
            // },
            {
              menu_id: 1,
              pid: 0,
              menu_name: "Users",
              title: "Users",
              url: "/master-data/users",
              icon: "/Design/Layers.svg",
              childs: [],
            },
          ],
        },

        {
          menu_id: 1,
          pid: 0,
          menu_name: "Category",
          title: "Category",
          url: "/products",
          icon: "/Design/Layers.svg",
          childs: [],
        },
        {
          menu_id: 1,
          pid: 0,
          menu_name: "Transaction",
          title: "Transaction",
          url: "/transaction",
          icon: "/Design/Layers.svg",
          childs: [],
        },
        {
          menu_id: 1,
          pid: 0,
          menu_name: "Prediksi Sarima",
          title: "Prediksi Sarima",
          url: "/metodelogi-arima",
          icon: "/Design/Layers.svg",
          childs: [],
        },
        {
          menu_id: 1,
          pid: 0,
          menu_name: "Prediksi Triple Exponential Smoothing",
          title: "Prediksi Triple Exponential Smoothing",
          url: "/metodelogi",
          icon: "/Design/Layers.svg",
          childs: [],
        },
        {
          menu_id: 1,
          pid: 0,
          menu_name: "Perbandingan Sarima Dan Triple Exponential Smoothing ",
          title: "Perbandingan Sarima Dan Triple Exponential Smoothing ",
          url: "/perbandingan-metodologi",
          icon: "/Design/Layers.svg",
          childs: [],
        },
        // {
        //   menu_id: 1,
        //   pid: 0,
        //   menu_name: "Prediksi Exponential Smoothing Report",
        //   title: "Prediksi Exponential Smoothing Report",
        //   url: "/view-metodologi",
        //   icon: "/Design/Layers.svg",
        //   childs: [],
        // },
        // {
        //   menu_id: 1,
        //   pid: 0,
        //   menu_name: "Test Coding",
        //   title: "Test Coding",
        //   url: "/test",
        //   icon: "/Design/Layers.svg",
        //   childs: [],
        // },
      ];
      setItem([...items, ...data]);
    } else {
      const data = [
        {
          menu_id: 1,
          pid: 0,
          menu_name: "dashboard",
          title: "Dashboard",
          url: "/dashboard",
          icon: "/Design/Layers.svg",
          childs: [],
        },
        {
          menu_id: 1,
          pid: 0,
          menu_name: "Master Data",
          title: "Master Data",
          url: "/master-data",
          icon: "/Design/Layers.svg",
          childs: [
            {
              menu_id: 1,
              pid: 0,
              menu_name: "UOM",
              title: "UOM",
              url: "/master-data/uom",
              icon: "/Design/Layers.svg",
              childs: [],
            },
            {
              menu_id: 1,
              pid: 0,
              menu_name: "Categories",
              title: "Categories",
              url: "/master-data/categories",
              icon: "/Design/Layers.svg",
              childs: [],
            },
          ],
        },

        {
          menu_id: 1,
          pid: 0,
          menu_name: "Products",
          title: "Products",
          url: "/products",
          icon: "/Design/Layers.svg",
          childs: [],
        },
        {
          menu_id: 1,
          pid: 0,
          menu_name: "Transaction",
          title: "Transaction",
          url: "/transaction",
          icon: "/Design/Layers.svg",
          childs: [],
        },
      ];

      setItem([...items, ...data]);
    }
  }, [user]);

  return (
    <>
      {/* Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/* Loop Menu Level 1 */}
        {items.map((menu, i) => {
          if (menu.childs.length === 0) {
            // Render don't have child
            return (
              <li
                key={i}
                className={`menu-item ${getMenuItemActive(
                  `${menu.url}`,
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to={menu.url}>
                  <span className="svg-icon menu-icon">
                    <SVG src={toAbsoluteUrl(`/media/svg/icons/${menu.icon}`)} />
                  </span>
                  <span className="menu-text">{menu.title}</span>
                </NavLink>
              </li>
            );
          } else {
            // Render if have child
            return (
              <li
              key={i}
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  `${menu.url}`,
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink className="menu-link menu-toggle" to={menu.url}>
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                    />
                  </span>
                  <span className="menu-text">{menu.title}</span>

                  <i className="menu-arrow" />
                </NavLink>
                <div className="menu-submenu ">
                  <ul className="menu-subnav">
                    <ul className="menu-subnav">
                      {/* Loop Menu Level 2 */}
                      {menu.childs.map((submenu, i) => {
                        if (submenu.childs.length === 0) {
                          // Render if don't have child
                          return (
                            <li
                              key={i}
                              className={`menu-item ${getMenuItemActive(
                                `${submenu.url}`
                              )}`}
                              aria-haspopup="true"
                            >
                              <NavLink className="menu-link" to={submenu.url}>
                                <i className="menu-bullet menu-bullet-dot">
                                  <span />
                                </i>
                                <span className="menu-text">
                                  {submenu.title}
                                </span>
                              </NavLink>
                            </li>
                          );
                        } else {
                          // Render if have child
                          return (
                            <li
                            key={i}
                              className={`menu-item menu-item-submenu ${getMenuItemActive(
                                `${submenu.url}`,
                                true
                              )}`}
                              aria-haspopup="true"
                              data-menu-toggle="hover"
                            >
                              <NavLink
                                className="menu-link menu-toggle"
                                to={submenu.url}
                              >
                                <span className="svg-icon menu-icon">
                                  <SVG
                                    src={toAbsoluteUrl(
                                      `/media/svg/icons/${submenu.icon}`
                                    )}
                                  />
                                </span>
                                <span className="menu-text">
                                  {submenu.title}
                                </span>

                                <i className="menu-arrow" />
                              </NavLink>

                              <div className="menu-submenu ">
                                <ul className="menu-subnav">
                                  <ul className="menu-subnav"></ul>
                                  {/* Loop Menu Level 3 */}
                                  {submenu.childs.map((child) => {
                                    return (
                                      <li
                                        className={`menu-item ${getMenuItemActive(
                                          `${child.url}`
                                        )}`}
                                        aria-haspopup="true"
                                      >
                                        <NavLink
                                          className="menu-link"
                                          to={child.url}
                                        >
                                          <i className="menu-bullet menu-bullet-dot">
                                            <span />
                                          </i>
                                          <span className="menu-text">
                                            {child.title}
                                          </span>
                                        </NavLink>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </li>
                          );
                        }
                      })}
                    </ul>
                  </ul>
                </div>
              </li>
            );
          }
        })}
      </ul>
    </>
  );
}
