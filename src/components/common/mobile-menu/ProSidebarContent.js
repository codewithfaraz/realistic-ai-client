"use client";

import mobileMenuItems from "@/data/mobileMenuItems";
import { isParentActive } from "@/utilis/isMenuActive";
import { usePathname } from "next/navigation";
import { MenuService } from "@/services/menu.service";
import Link from "next/link";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useEffect, useState } from "react";

const ProSidebarContent = () => {
  const path = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    const fetchMenuItes = async () => {
      try {
        const res = await MenuService.getMenu("HEADER");
        console.log(res.data.items);
        setMenuItems(res.data.items);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenuItes();
  }, []);
  return (
    <Sidebar width="100%" backgroundColor="#fff" className="my-custom-class">
      <Menu>
        {!isLoading &&
          menuItems.length > 0 &&
          menuItems.map((item) => {
            return (
              <MenuItem key={item.id}>
                <Link href={item.href}>{item.label}</Link>
              </MenuItem>
            );
          })}
        {/* <MenuItem component={<Link href="/" />}>Home</MenuItem> */}
      </Menu>
      {/* <Menu>
        {mobileMenuItems.map((item, index) => (
          <SubMenu
            key={index}
            className={isParentActive(item.subMenu, path) ? "active" : ""}
            label={item.label}
          >
            {item.subMenu.map((subItem, subIndex) =>
              subItem.subMenu ? (
                <SubMenu
                  key={subIndex}
                  label={subItem.label}
                  className={
                    isParentActive(subItem.subMenu, path) ? "active" : ""
                  }
                >
                  {subItem.subMenu.map((nestedItem, nestedIndex) => (
                    <MenuItem
                      key={nestedIndex}
                      component={
                        <Link
                          className={nestedItem.path == path ? "active" : ""}
                          href={nestedItem.path}
                        />
                      }
                    >
                      {nestedItem.label}
                    </MenuItem>
                  ))}
                </SubMenu>
              ) : (
                <MenuItem
                  key={subIndex}
                  component={
                    <Link
                      className={subItem.path == path ? "active" : ""}
                      href={subItem.path}
                    />
                  }
                >
                  {subItem.label}
                </MenuItem>
              )
            )}
          </SubMenu>
        ))}
      </Menu> */}
    </Sidebar>
  );
};

export default ProSidebarContent;
