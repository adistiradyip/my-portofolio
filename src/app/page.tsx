import type { Metadata } from "next";
import { PortfolioNavbar } from "@/components/portfolio/portfolio-navbar";
import { HeroSection } from "@/components/portfolio/hero-section";
import { ServicesSection } from "@/components/portfolio/services-section";
import { AboutSection } from "@/components/portfolio/about-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { TestimonialsSection } from "@/components/portfolio/testimonials-section";
import { ContactSection } from "@/components/portfolio/contact-section";
import { BlogsSection } from "@/components/portfolio/blogs-section";
import { PortfolioFooter } from "@/components/portfolio/portfolio-footer";
import { ScrollToTop } from "@/components/portfolio/scroll-to-top";
import { PortfolioProviders } from "@/components/portfolio/portfolio-providers";
import { getBlogPosts, getExperiences, getProfile, getProjects, getServices, getSkills, getTestimonials } from "@/lib/queries";
import { buildHomeMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return buildHomeMetadata(profile);
}

export default async function HomePage() {
  const [profile, projects, skills, experiences, testimonials, blogPosts, services] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
    getExperiences(),
    getTestimonials(),
    getBlogPosts(),
    getServices(),
  ]);

  return (
    <PortfolioProviders>
      <main className="bg-pf-bg text-pf-text">
        <PortfolioNavbar brandName={profile.full_name} />
        <HeroSection profile={profile} />
        <AboutSection profile={profile} skills={skills} experiences={experiences} />
        <ServicesSection services={services} />
        <ProjectsSection
          projects={projects}
          skills={skills}
          experienceCount={experiences.length}
        />
        <TestimonialsSection testimonials={testimonials} />
        <BlogsSection posts={blogPosts} />
        <ContactSection profile={profile} />
        <PortfolioFooter profile={profile} />
        <ScrollToTop />
      </main>
    </PortfolioProviders>
  );
}
