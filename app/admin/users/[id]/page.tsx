"use client";

import { useNotification } from "@/app/components/notification";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUserProvider } from "@/app/components/userprovider";

const UpdateUser = () => {
  const params = useParams();
  const userId = params.id as string;
  const [roles, setRoles] = useState<[]>([]);
  const { getUserdata } = useUserProvider();
  const userData = getUserdata();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    roleId: "",
    oldpassword: "",
    image: "",
  });
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");
        const data = await res.json();
        if (data.message.success) {
          setRoles(data.message.roles);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();

        if (data.success) {
          setFormData({
            id: userId,
            name: data.message.user.name || "",
            email: data.message.user.email || "",
            password: "",
            roleId: data.message.user.roleId || "",
            image: data.message.user.image || "",
            oldpassword: "",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) {
      fetchRoles();
      fetchUser();
    }
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.name ||
      !formData.roleId ||
      !formData.oldpassword
    ) {
      showNotification("All fields are required", "warning", 1500);
      return;
    }
    try {
      const res = await fetch(`/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        showNotification(result.message, "success", 1500);
      } else {
        showNotification(result.message, "warning", 2000);
      }
    } catch (error) {
      showNotification("Failed to update", "error", 1500);
    }
  };

  return (
    <div className="p-2 bg-gradient-to-r from-cyan-100 to-amber-100 ml-8 mr-8 rounded-4xl bg-opacity-60">
      <div className="flex flex-col space-y-4 p-5 rounded-4xl bg-white/60 h-fit">
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">
                Update Profile
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Edit the user information below.
              </p>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Name */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                {/* old password */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="oldpassword"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    old Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="oldpassword"
                      name="oldpassword"
                      type="password"
                      value={formData.oldpassword}
                      onChange={handleChange}
                      placeholder="Old password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                {/* Password */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    New Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="image"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Image Url
                  </label>
                  <div className="mt-2">
                    <input
                      id="image"
                      name="image"
                      type="text"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Use correct image url"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                {/* Role */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="roleId"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Role
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="roleId"
                      name="roleId"
                      disabled={userData?.role !== 1}
                      value={formData.roleId}
                      onChange={handleChange}
                      className="col-start-1 row-start-1 disabled:bg-gray-200 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option value="">Select a role</option>
                      {roles.map((role: any) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  {formData.image ? (
                    <img src={formData.image} className="rounded-xl w-30" />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md cursor-pointer bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
