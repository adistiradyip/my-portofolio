import { getAdminBlogPosts } from "@/lib/queries";
import { BlogPostsManager } from "@/components/admin/blog-posts-manager";

export default async function BlogPage() {
  const posts = await getAdminBlogPosts();
  return <BlogPostsManager posts={posts} />;
}
