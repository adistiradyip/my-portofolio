import { getAdminTestimonials } from "@/lib/queries";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export default async function TestimonialsPage() {
  const testimonials = await getAdminTestimonials();
  return <TestimonialsManager testimonials={testimonials} />;
}
