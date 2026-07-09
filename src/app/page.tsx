import { Hero } from "@/components/home/Hero/Hero";
import { ValueProps } from "@/components/home/ValueProps/ValueProps";
import { FeaturedCategories } from "@/components/home/FeaturedCategories/FeaturedCategories";
import { StoryStrip } from "@/components/home/StoryStrip/StoryStrip";
import { LatestPosts } from "@/components/home/LatestPosts/LatestPosts";

// Time-based ISR — keep in sync with REVALIDATE.content (see AGENTS.md).
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <FeaturedCategories />
      <StoryStrip />
      <LatestPosts />
    </>
  );
}
