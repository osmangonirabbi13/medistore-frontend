"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMyProfile, updateMyProfile } from "../../../actions/user.action";
import { toast } from "sonner";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const res = await getMyProfile();

      if (res?.success) {
        setValues({
          name: res.data?.name || "",
          email: res.data?.email || "",
          phone: res.data?.phone || "",
        });
      } else {
        toast.error(res?.message || "Failed to load profile");
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleChange =
    (key: "name" | "email" | "phone") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSave = async () => {
    setSaving(true);

    const res = await updateMyProfile(values);

    if (res?.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(res?.message || "Update failed");
    }

    setSaving(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

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
            disabled={saving}
            className="bg-black hover:bg-gray-800 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <Label>Name</Label>
            <div className="sm:col-span-2">
              <Input
                value={values.name}
                onChange={handleChange("name")}
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <Label>Email</Label>
            <div className="sm:col-span-2">
              <Input
                type="email"
                value={values.email}
                onChange={handleChange("email")}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <Label>Phone</Label>
            <div className="sm:col-span-2">
              <Input
                type="tel"
                value={values.phone}
                onChange={handleChange("phone")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
