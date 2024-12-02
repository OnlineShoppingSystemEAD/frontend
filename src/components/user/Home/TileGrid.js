import React, { useEffect, useState } from 'react';
import ProductService from '../../../api/services/ProductService';

const TileGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ProductService.getCategories();
        console.log("API Response:", response.data); // Debugging log
        setCategories(response.data || []); // Adjust based on the API response structure
      } catch (error) {
        console.error("Failed to load categories:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading categories...</div>;
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return <div className="p-6 text-center">No categories available.</div>;
  }

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {categories.map((category) => (
            <div
                key={category.id}
                className="relative overflow-hidden bg-gray-100 rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            >
              {/* Image Container */}
              <div className="overflow-hidden rounded-t-lg h-64">
                <img
                    src={category.imageURL} // Ensure this matches the field in your API response
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                />
              </div>

              {/* Text Content */}
              <div className="p-4 bg-white">
                <h2 className="font-bold text-xl text-gray-800">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
        ))}
      </div>
  );
};

export default TileGrid;
