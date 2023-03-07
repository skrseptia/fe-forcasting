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
      level: 1,
      hierarcy: "1",
      concatenador: "(001 - 2)",
      permissions: ["CANCEL", "CREATE", "DELETE", "READ", "UPDATE"],
      totalNotif: 0,
      childs: [],
    },
    {
      menu_id: 2,
      pid: 0,
      menu_name: "administration",
      title: "Administration",
      url: "/administration",
      icon: "icon-home",
      level: 1,
      hierarcy: "2",
      concatenador: "(002 - 2)",
      permissions: ["CANCEL", "CREATE", "DELETE", "READ", "UPDATE"],
      totalNotif: 0,
      childs: [
        {
          menu_id: 55,
          pid: 2,
          menu_name: "Master User",
          title: "Master User",
          url: "/administration/master-user",
          icon: "/Communication/Group.svg",
          level: 2,
          hierarcy: "2,55",
          concatenador: "(002 - 2) * (001)",
          permissions: null,
          totalNotif: 0,
          childs: [
            {
              menu_id: 56,
              pid: 55,
              menu_name: "User",
              title: "User",
              url: "/administration/master-user/user",
              icon: "",
              level: 3,
              hierarcy: "2,55,56",
              concatenador: "(002 - 2) * (001) * (001)",
              permissions: null,
              totalNotif: 0,
              childs: [],
            },
            {
              menu_id: 57,
              pid: 55,
              menu_name: "User Vendor",
              title: "User Vendor",
              url: "/administration/master-user/vendor",
              icon: "",
              level: 3,
              hierarcy: "2,55,57",
              concatenador: "(002 - 2) * (001) * (002)",
              permissions: null,
              totalNotif: 0,
              childs: [],
            },
            {
              menu_id: 58,
              pid: 55,
              menu_name: "Roles",
              title: "Roles",
              url: "/administration/master-user/role",
              icon: "",
              level: 3,
              hierarcy: "2,55,58",
              concatenador: "(002 - 2) * (001) * (003)",
              permissions: null,
              totalNotif: 0,
              childs: [],
            },
          ],
        },
        {
          menu_id: 59,
          pid: 2,
          menu_name: "General Setting",
          title: "General Setting",
          url: "/administration/general-setting",
          icon: "",
          level: 2,
          hierarcy: "2,59",
          concatenador: "(002 - 2) * (002)",
          permissions: null,
          totalNotif: 0,
          childs: [],
        },
        {
          menu_id: 102,
          pid: 2,
          menu_name: "Notification Settings",
          title: "Notification Settings",
          url: "/administration/notification",
          icon: "",
          level: 2,
          hierarcy: "2,102",
          concatenador: "(002 - 2) * (003)",
          permissions: null,
          totalNotif: 0,
          childs: [],
        },
        {
          menu_id: 103,
          pid: 2,
          menu_name: "User Activity",
          title: "User Activity",
          url: "/administration/activity",
          icon: "",
          level: 2,
          hierarcy: "2,103",
          concatenador: "(002 - 2) * (004)",
          permissions: null,
          totalNotif: 0,
          childs: [],
        },
        {
          menu_id: 104,
          pid: 2,
          menu_name: "Api Log",
          title: "Api Log",
          url: "/administration/api-log",
          icon: "",
          level: 2,
          hierarcy: "2,104",
          concatenador: "(002 - 2) * (005)",
          permissions: null,
          totalNotif: 0,
          childs: [],
        },
        {
          menu_id: 105,
          pid: 2,
          menu_name: "Background Service",
          title: "Background Service",
          url: "/administration/service",
          icon: "",
          level: 2,
          hierarcy: "2,105",
          concatenador: "(002 - 2) * (006)",
          permissions: null,
          totalNotif: 0,
          childs: [],
        },
        {
          menu_id: 119,
          pid: 2,
          menu_name: "Layout Manager",
          title: "Layout Manager",
          url: "/administration/layout-manager",
          icon: "",
          level: 2,
          hierarcy: "2,119",
          concatenador: "(002 - 2) * (007)",
          permissions: null,
          totalNotif: 0,
          childs: [],
        },
        {
          menu_id: 153,
          pid: 2,
          menu_name: "Signature",
          title: "Signature",
          url: "/administration/signature",
          icon: "",
          level: 2,
          hierarcy: "2,153",
          concatenador: "(002 - 2) * (008)",
          permissions: null,
          totalNotif: 0,
          childs: [],
        },
        {
          menu_id: 60,
          pid: 2,
          menu_name: "Bussiness Parameter",
          title: "Bussiness Parameter",
          url: "/administration/bussiness-parameter",
          icon: "/Files/File-plus.svg",
          level: 2,
          hierarcy: "2,60",
          concatenador: "(002 - 2) * (009)",
          permissions: null,
          totalNotif: 0,
          childs: [
            {
              menu_id: 61,
              pid: 60,
              menu_name: "Parameter",
              title: "Parameter",
              url: "/administration/bussiness-parameter/parameter",
              icon: "",
              level: 3,
              hierarcy: "2,60,61",
              concatenador: "(002 - 2) * (009) * (001)",
              permissions: null,
              totalNotif: 0,
              childs: [],
            },
            {
              menu_id: 62,
              pid: 60,
              menu_name: "Parameter Group",
              title: "Parameter Group",
              url: "/administration/bussiness-parameter/parametergrup",
              icon: "",
              level: 3,
              hierarcy: "2,60,62",
              concatenador: "(002 - 2) * (009) * (002)",
              permissions: null,
              totalNotif: 0,
              childs: [],
            },
          ],
        },
        {
          menu_id: 63,
          pid: 2,
          menu_name: "Email",
          title: "Email",
          url: "/administration/email",
          icon: "/Files/File-plus.svg",
          level: 2,
          hierarcy: "2,63",
          concatenador: "(002 - 2) * (010)",
          permissions: null,
          totalNotif: 0,
          childs: [
            {
              menu_id: 64,
              pid: 63,
              menu_name: "Email Template",
              title: "Email Template",
              url: "/administration/email/template",
              icon: "/Files/File-plus.svg",
              level: 3,
              hierarcy: "2,63,64",
              concatenador: "(002 - 2) * (010) * (001)",
              permissions: null,
              totalNotif: 0,
              childs: [],
            },
            {
              menu_id: 65,
              pid: 63,
              menu_name: "Email Account",
              title: "Email Account",
              url: "/administration/email/account",
              icon: "",
              level: 3,
              hierarcy: "2,63,65",
              concatenador: "(002 - 2) * (010) * (002)",
              permissions: null,
              totalNotif: 0,
              childs: [],
            },
          ],
        },
        {
          menu_id: 66,
          pid: 2,
          menu_name: "Menu",
          title: "Menu",
          url: "/administration/menu",
          icon: "/Files/File-plus.svg",
          level: 2,
          hierarcy: "2,66",
          concatenador: "(002 - 2) * (011)",
          permissions: null,
          totalNotif: 0,
          childs: [
            {
              menu_id: 67,
              pid: 66,
              menu_name: "Menu Master Data",
              title: "Menu Master Data",
              url: "/administration/menu/menu-master-data",
              icon: "",
              level: 3,
              hierarcy: "2,66,67",
              concatenador: "(002 - 2) * (011) * (001)",
              permissions: null,
              totalNotif: 0,
              childs: [],
            },
            {
              menu_id: 179,
              pid: 66,
              menu_name: "Menu Tree",
              title: "Menu Tree",
              url: "/administration/menu/tree",
              icon: "",
              level: 3,
              hierarcy: "2,66,179",
              concatenador: "(002 - 2) * (011) * (002)",
              permissions: null,
              totalNotif: 0,
              childs: [],
            },
          ],
        },
        {
          menu_id: 72,
          pid: 2,
          menu_name: "Approval",
          title: "Approval",
          url: "/administration/approval",
          icon: "/Communication/Mail-box.svg",
          level: 2,
          hierarcy: "2,72",
          concatenador: "(002 - 2) * (012)",
          permissions: null,
          totalNotif: 0,
          childs: [
            {
              menu_id: 73,
              pid: 72,
              menu_name: "Approval Stages",
              title: "Approval Stages",
              url: "/administration/approval/stages",
              icon: "",
              level: 3,
              hierarcy: "2,72,73",
              concatenador: "(002 - 2) * (012) * (001)",
              permissions: null,
              totalNotif: 0,
              childs: [],
            },
            {
              menu_id: 74,
              pid: 72,
              menu_name: "Approval Tempalte",
              title: "Approval Template",
              url: "/administration/approval/template",
              icon: "",
              level: 3,
              hierarcy: "2,72,74",
              concatenador: "(002 - 2) * (012) * (002)",
              permissions: null,
              totalNotif: 0,
              childs: [],
            },
          ],
        },
        {
          menu_id: 79,
          pid: 2,
          menu_name: "User Policy",
          title: "Password Policy",
          url: "/administration/policy",
          icon: "",
          level: 2,
          hierarcy: "2,79",
          concatenador: "(002 - 2) * (013)",
          permissions: null,
          totalNotif: 0,
          childs: [],
        },
      ],
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
