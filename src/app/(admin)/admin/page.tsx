export const metadata = {
  title: "Admin Panel | LexBlue",
  description: "Course management.",
};

export default function AdminPage() {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-lg shadow-ambient">
      <h1 className="font-headline text-display-sm text-primary mb-4">Admin Dashboard</h1>
      <p className="text-body-lg text-on-surface-variant">
        TODO: Build the Course management tools (CRUD for courses, modules, lessons).
      </p>
    </div>
  );
}
