import CourseCatalog from "@/components/courses/CourseCatalog";

export const metadata = {
  title: "Course Catalog | LexBlue",
  description: "Browse all courses.",
};

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="font-headline text-display-lg text-primary mb-3">
            Course Catalog
          </h1>

          <p className="text-body-lg text-muted-foreground">
            Discover practical courses designed to help you build technical
            skills, explore modern technologies, and grow your career in the
            digital world.
          </p>
        </div>

        <CourseCatalog />
      </div>
    </main>
  );
}
