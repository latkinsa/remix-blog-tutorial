import { prisma } from "~/db.server";
import type { Post } from "@prisma/client";

export type PostData = Pick<Post, "slug" | "title" | "markdown">;

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(post: PostData) {
  return prisma.post.create({ data: post });
}

export async function updatePost(post: PostData) {
  return prisma.post.upsert({
    where: { slug: post.slug },
    update: post,
    create: post,
  });
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}
