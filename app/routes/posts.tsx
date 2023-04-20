import { Outlet } from "@remix-run/react";

export default function PostsPage() {
  return (
    <main>
        <h2>Posts</h2>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
    </main>
  );
}