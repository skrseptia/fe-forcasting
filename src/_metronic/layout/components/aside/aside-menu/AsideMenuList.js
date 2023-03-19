/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
// import Badge from "react-bootstrap/Badge";
// import { selectUser } from "../../../../../app/modules/Auth/_redux/authRedux";
// import { useSelector } from "react-redux";
// import IconButton from "@material-ui/core/IconButton";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  // const user = useSelector(selectUser);

  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

  const items = [
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
          menu_name: "Store",
          title: "Store",
          url: "/master-data/stores",
          icon: "/Design/Layers.svg",
          childs: [],
        },
        {
          menu_id: 1,
          pid: 0,
          menu_name: "Merchants",
          title: "Merchants",
          url: "/master-data/merchants",
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
      menu_name: "Products",
      title: "Products",
      url: "/products",
      icon: "/Design/Layers.svg",
      childs: [],
    },
    {
      menu_id: 1,
      pid: 0,
      menu_name: "Orders",
      title: "Orders",
      url: "/orders",
      icon: "/Design/Layers.svg",
      childs: [],
    },
  ];

  return (
    <>
      {/* Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/* Loop Menu Level 1 */}
        {items.map((menu) => {
          if (menu.childs.length === 0) {
            // Render don't have child
            return (
              <li
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
                      {menu.childs.map((submenu) => {
                        if (submenu.childs.length === 0) {
                          // Render if don't have child
                          return (
                            <li
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
