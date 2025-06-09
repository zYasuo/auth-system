"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  logo?: {
    text: string;
    href?: string;
    fixed?: boolean;
    image?: {
      src: string;
      alt: string;
      width?: number;
      height?: number;
      className?: string;
    };
  };
  navigation?: {
    label: string;
    href: string;
  }[];
}

export function Header({
  logo = {
    text: "",
    href: "/",
    fixed: false,
    image: {
      src: "/next.svg",
      alt: "Next.js logo",
      width: 90,
      height: 19,
      className: "brightness-0 invert dark:brightness-100 dark:invert-0",
    },
  },
  navigation = [],
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActivePath = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`${
        logo.fixed
          ? "top-0 left-0 right-0 z-50 backdrop-blur-md bg-background"
          : " backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={logo.href || "/"} className="flex items-center space-x-2">
            <Image
              className={
                logo.image?.className ||
                "brightness-0 invert dark:brightness-100 dark:invert-0"
              }
              src={logo.image?.src || "/next.svg"}
              alt={logo.image?.alt || "Logo"}
              width={logo.image?.width || 90}
              height={logo.image?.height || 19}
              priority
            />
            <span className="font-bold text-lg hidden sm:block">
              {logo.text}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-medium transition-colors duration-200 group ${
                  isActivePath(item.href)
                    ? ""
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {/* Linha animada */}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    isActivePath(item.href)
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button - só aparece se houver navegação */}
            {navigation.some((item) => item.label.trim() !== "") && (
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                variant="ghost"
                size="sm"
                className="lg:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            )}
          </div>
        </div>

        {isMenuOpen && navigation.some((item) => item.label.trim() !== "") && (
          <div className="lg:hidden border-t border-border py-4 bg-background/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                {navigation
                  .filter((item) => item.label.trim() !== "")
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative font-medium py-2 px-2 rounded-md transition-all duration-200 ${
                        isActivePath(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                      {isActivePath(item.href) && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                      )}
                    </Link>
                  ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
