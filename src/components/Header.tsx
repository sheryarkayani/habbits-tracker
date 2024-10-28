import { Button } from "../components/ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { saveChanges } from "../habitService";

export default function Header() {
  const [formData, setFormData] = useState({ /* initial form data */ });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    saveChanges(formData);
  };

  return (
    <header className="bg-[#1e6e41] text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <img 
          src="/logo1.png" 
          alt="Avenue5 Logo" 
          className="h-12 mr-12"  /* Adjust the height (h-12) as per your need */
        />

        {/* Navigation */}
        <nav className="flex space-x-8 text-lg font-medium">
          {['ABOUT', 'PROPERTIES', 'PROJECTS', 'BLOG', 'CAREERS', 'CONTACT'].map((item, idx) => (
            <a
              key={idx}
              href={`/${item.toLowerCase()}`}
              className="hover:text-yellow-300 transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Search and Button */}
        <div className="flex items-center space-x-4 ml-12">
          <Input
            type="text"
            placeholder="Property ID"
            className="w-40 bg-white text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300"
          />
          <Button
            variant="outline"
            className="bg-[#2e8b57] text-white hover:bg-[#236e44] px-4 py-2 rounded-md transition-all duration-300 shadow-md"
          >
            SEND INQUIRY
          </Button>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="mt-4">
        <Input name="field1" value={formData.field1} onChange={handleInputChange} />
        <Input name="field2" value={formData.field2} onChange={handleInputChange} />
        {/* Save Button */}
        <Button onClick={handleSave} className="mt-4 bg-[#2e8b57] text-white hover:bg-[#236e44] px-4 py-2 rounded-md transition-all duration-300 shadow-md">
          Save
        </Button>
      </div>
    </header>
  );
}
