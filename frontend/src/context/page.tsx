import { createContext, useContext, useEffect, useState } from "react";
import { PageContextType, PageProviderProps } from "@/types/page";
import { useLocation } from "react-router-dom";

const PageContext = createContext<PageContextType | undefined>(undefined);

const PageProvider = ({ children }: PageProviderProps) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <PageContext.Provider value={{ menuOpen, setMenuOpen }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = (): PageContextType => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
};

export { PageProvider };
