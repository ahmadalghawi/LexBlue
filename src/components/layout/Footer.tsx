export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card py-10 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} LexBlue. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
