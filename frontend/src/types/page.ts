import React from "react";

export interface PageContextType {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export interface PageProviderProps {
  children: React.ReactNode;
}
