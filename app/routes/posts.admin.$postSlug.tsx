import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { getPost, updatePost, deletePost } from "~/models/post.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.postSlug, `slug is required`);
  const post = await getPost(params.postSlug);
  invariant(post, `Post not found: ${params.postSlug}`);

  return json({ post });
};

// switch (request.method) {
//     case "POST": {
//       /* handle "POST" */
//     }
//     case "PUT": {
//       /* handle "PUT" */
//     }
//     case "PATCH": {
//       /* handle "PATCH" */
//     }
//     case "DELETE": {
//       /* handle "DELETE" */
//     }
// }

export const action = async ({ request, params }: ActionArgs) => {
  if (request.method === "DELETE") {

    invariant(params.postSlug, "slug not found");
    await deletePost(params.postSlug);

  } else {

    const formData = await request.formData();
    const title = formData.get("title");
    const slug = formData.get("slug");
    const markdown = formData.get("markdown");

    const errors = {
      title: title ? null : "Title is required",
      slug: slug ? null : "Slug is required",
      markdown: markdown ? null : "Markdown is required",
    };
    const hasErrors = Object.values(errors).some(
      (errorMessage) => errorMessage
    );
    if (hasErrors) {
      return json(errors);
    }

    invariant(typeof title === "string", "title must be a string");
    invariant(typeof slug === "string", "slug must be a string");
    invariant(typeof markdown === "string", "markdown must be a string");

    await updatePost({ title, slug, markdown });
  }

  return redirect("/posts/admin");
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function EditPost() {
  const { post } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();
  const navigation = useNavigation();
  const isUpdating = Boolean(navigation.state === "submitting");
  return (
    <div>
    <Form method="post">
      <h1 className="text-2xl">New Post</h1>
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={post.title}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={post.slug}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
          defaultValue={post.markdown}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Post"}
        </button>
      </p>
    </Form>
    <Form method="DELETE">
    <button
          type="submit"
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
          disabled={isUpdating}
        >
          {isUpdating ? "Deleting..." : "Delete Post"}
        </button>
    </Form>
    </div>
  );
}
