"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfilePage = () => {
  const [values, setValues] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+8801234567890",
  });

  const handleChange =
    (key: "name" | "email" | "phone") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSave = () => {
    console.log("Updated Profile:", values);

    
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Account Information
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Update your personal information here
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="bg-black hover:bg-gray-800 text-white"
          >
            Save Changes
          </Button>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <Label htmlFor="name" className="text-sm font-medium text-gray-900">
              Name
            </Label>
            <div className="sm:col-span-2">
              <Input
                id="name"
                type="text"
                value={values.name}
                onChange={handleChange("name")}
                className="w-full"
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <Label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email
            </Label>
            <div className="sm:col-span-2">
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={handleChange("email")}
                className="w-full"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
              Phone Number
            </Label>
            <div className="sm:col-span-2">
              <div className="flex">
                <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                  <span className="text-sm text-gray-700">BD</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange("phone")}
                  className="rounded-l-none flex-1"
                />
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-6 border-t">
            <Label className="text-sm font-medium text-gray-900">
              Password
            </Label>
            <div className="sm:col-span-2 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Last updated recently
              </span>
              <Button
                variant="link"
                className="text-sm underline p-0 h-auto"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
