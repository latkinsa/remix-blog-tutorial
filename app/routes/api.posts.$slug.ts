import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPost } from "~/models/post.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  // curl -v --oauth2-bearer ABCabc12  URL
  if (!request.headers.get("authorization")) throw json("Not Authorized", 401);
  if (!params.slug) throw json("Bad request", 400);

  const post = await getPost(params.slug);
  return post? json({ post }) : json("Post not found", 404);
};
