import React, { createContext, useContext, useState } from "react";

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
