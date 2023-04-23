import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { deletePost, getPost, updatePost } from "~/models/post.server";
import { checkBearerToken } from "~/utils";

export const loader = async ({ params, request }: LoaderArgs) => {
  // curl -v --oauth2-bearer ABCabc12  URL
  checkBearerToken(request);
  if (!params.slug) throw json({error: "Bad Request"}, 400);

  const post = await getPost(params.slug);
  return post ? json({ post }) : json({error: "Post not found"}, 404);
};

export const action = async ({ request, params }: ActionArgs) => {
  checkBearerToken(request);
  if (request.method === "DELETE") {
    if (!params.slug) throw json({error: "Bad Request"}, 400);
    try {
      await deletePost(params.slug);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw json({error: "Bad Request", ...e.meta}, 400);
      }
      throw e;
    }
    return new Response(undefined, { status: 204 });
  } else {
    const { title, slug, markdown } = await request.json();
    const errors = {
      title:
        title && typeof title === "string" ? null : "Title string is required",
      slug: slug && typeof slug === "string" ? null : "Slug string is required",
      markdown:
        markdown && typeof markdown === "string"
          ? null
          : "Markdown string is required",
    };
    const hasErrors = Object.values(errors).some(
      (errorMessage) => errorMessage
    );
    if (hasErrors) throw json({error: "Bad Request", cause: errors}, 400);

    const post = await updatePost({ title, slug, markdown });
    const location = new URL(
      post.slug,
      request.url.endsWith("/") ? request.url.slice(0, -1) : request.url
    );
    // console.log(location);
    return json(post, { status: 200, headers: { location: location.href } });
  }
};
