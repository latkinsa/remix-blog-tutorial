import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { getPosts, createPost } from "~/models/post.server";
import { checkBearerToken } from "~/utils";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

export const action = async ({ request }: ActionArgs) => {
  checkBearerToken(request);
  const {title, slug, markdown} = await request.json();
  
  const errors = {
    title:
      title && typeof title === "string"
        ? null
        : "Title string is required",
    slug:
      slug && typeof slug === "string"
        ? null
        : "Slug string is required",
    markdown:
      markdown && typeof markdown === "string"
        ? null
        : "Markdown string is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) throw json({error: "Bad Request", cause: errors}, 400);

  const post = await createPost({title, slug, markdown});
  const location = new URL(post.slug, request.url + (request.url.endsWith("/")? "" : "/"));
  // console.log(location);
  return json(
    post,
    {status: 201, headers: {location: location.href}}
  );
};
