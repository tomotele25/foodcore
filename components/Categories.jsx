import React from "react";
import { Home, Pill, Wine, ShoppingBag } from "lucide-react";
import { useCategory } from "@/context/CategoryContext";

const Categories = () => {
  const { selectedCategory, setSelectedCategory } = useCategory();

  const categories = [
    { name: "restaurant", icon: <Home size={28} />, color: "#AE2108" },
    { name: "drinks", icon: <Wine size={28} />, color: "#AE2108" },
    { name: "malls", icon: <ShoppingBag size={28} />, color: "#6A1B9A" },
    { name: "pharmacy", icon: <Pill size={28} />, color: "#2E7D32" },
  ];

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  return (
    <div className="px-6 md:px-20 lg:px-20 py-14">
      <h1 className="text-3xl font-semibold mb-8 text-[#AE2108]">
        Explore Categories
      </h1>

      <div className="md:hidden flex gap-4 overflow-x-auto scrollbar-hide">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(cat.name)}
            className={`min-w-[140px] h-36 border flex flex-col items-center justify-center gap-3 rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer flex-shrink-0
              ${
                selectedCategory === cat.name
                  ? "border-4 border-[#AE2108]"
                  : "border-[#AE2108]"
              }
            `}
          >
            <div style={{ color: cat.color }}>{cat.icon}</div>
            <span className="text-lg font-medium" style={{ color: cat.color }}>
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-8">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(cat.name)}
            className={`h-36 w-full border flex flex-col items-center justify-center gap-3 rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer
              ${
                selectedCategory === cat.name
                  ? "border-4 border-[#AE2108]"
                  : "border-[#AE2108]"
              }
            `}
          >
            <div style={{ color: cat.color }}>{cat.icon}</div>
            <span className="text-lg font-medium" style={{ color: cat.color }}>
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
