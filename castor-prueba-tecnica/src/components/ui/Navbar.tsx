import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./navigation-menu";
import LogoutButton from "../LogoutButton";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center py-4 px-6 border-b bg-background">
      <div className="font-bold text-lg">Dashboard</div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            {/* You can add more menu items here if needed */}
            <NavigationMenuLink asChild>
              <div>
                <LogoutButton />
              </div>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
} 