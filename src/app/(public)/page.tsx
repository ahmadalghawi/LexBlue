import { TopHero } from "@/components/Home/TopHero";
import { HomeCourseHighlight } from "@/components/Home/CourseHighlight/HomeCourseHighlight";
import { EmailList } from "@/components/Home/EmailList";

export const metadata = {
  title: "LexBlue | Home",
  description: "Discover the best programming courses.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <TopHero />
      <HomeCourseHighlight />
      <EmailList />
    </div>
  );
}
