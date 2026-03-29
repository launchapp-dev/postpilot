import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { post } from "@/db/schema";
import { PostEditor } from "./post-editor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { id } = await params;

  const found = await db.query.post.findFirst({
    where: and(eq(post.id, id), eq(post.userId, session.user.id)),
  });

  if (!found) notFound();

  return <PostEditor post={found} />;
}
