import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, User, History, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/personal-details", icon: User, label: "Personal Details" },
    { path: "/history", icon: History, label: "Interview History" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div 
          onClick={() => setLocation("/")}
          className="flex items-center space-x-2 hover-elevate rounded-md px-3 py-2 cursor-pointer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-lg font-bold">IB</span>
          </div>
          <span className="hidden font-semibold sm:inline-block">Interview Bot</span>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location === item.path ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
              onClick={() => setLocation(item.path)}
              data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            className="hidden sm:flex"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <Avatar 
            className="h-9 w-9 cursor-pointer hover-elevate"
            onClick={() => setLocation("/personal-details")}
            data-testid="link-profile"
          >
            <AvatarImage src="" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location === item.path ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => {
                  setLocation(item.path);
                  setMobileMenuOpen(false);
                }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
