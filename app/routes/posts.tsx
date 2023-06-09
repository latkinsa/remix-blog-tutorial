import { Link, Outlet } from "@remix-run/react";

export default function PostsPage() {
  return (
    <main>
      <h2>Posts</h2>
      <div className="flex-1 p-6">
        <Outlet />
      </div>
      <Link to="admin" className="text-red-600 underline">
        Admin
      </Link>
    </main>
  );
}
