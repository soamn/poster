"use client";

import React, { useEffect, useState } from "react";

type DashboardData = {
  users: { total: number; newLast7Days: number };
  roles: { total: number };
  posts: { total: number; published: number; draft: number; newPosts: number };
};

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
          setError(null);
        } else {
          setError("Failed to load dashboard data");
        }
      })
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <p>
          Total users: <strong>{data.users.total}</strong>
        </p>
        <p>
          New users last 7 days: <strong>{data.users.newLast7Days}</strong>
        </p>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Roles</h2>
        <p>
          Total roles: <strong>{data.roles.total}</strong>
        </p>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <p>
          Total posts: <strong>{data.posts.total}</strong>
        </p>
        <p>
          Published posts: <strong>{data.posts.published}</strong>
        </p>
        <p>
          Draft posts: <strong>{data.posts.draft}</strong>
        </p>
        <p>
          New posts last 7 days: <strong>{data.posts.newPosts}</strong>
        </p>
      </section>
    </div>
  );
};

export default Dashboard;
