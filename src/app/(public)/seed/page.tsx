"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { seedTestCourse, seedTestEnrollment, seedMyLearningData, seedDemoCourses } from "@/lib/seed";

export default function SeedPage() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSeedCourse = async () => {
    setLoading(true);
    setStatus("Creating test course...");
    try {
      const courseId = await seedTestCourse();
      setStatus(`Course created: ${courseId}`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleSeedEnrollment = async () => {
    if (!user) {
      setStatus("Error: You must be logged in to create an enrollment");
      return;
    }
    setLoading(true);
    setStatus("Creating enrollment for your user...");
    try {
      const enrollmentId = await seedTestEnrollment(user.uid);
      setStatus(`Enrollment created: ${enrollmentId}`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleSeedAll = async () => {
    if (!user) {
      setStatus("Error: You must be logged in");
      return;
    }
    setLoading(true);
    setStatus("Creating course and enrollment...");
    try {
      const result = await seedMyLearningData(user.uid);
      setStatus(`Done! Course: ${result.courseId}, Enrollment: ${result.enrollmentId}`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleSeedDemo = async () => {
    setLoading(true);
    setStatus("Wiping existing courses and seeding new catalog...");
    try {
      const results = await seedDemoCourses();
      setStatus(`Success! Seeded ${results.length} new courses.`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Seed Test Data</h1>
      <p className="text-muted-foreground mb-8">
        Create test data in Firestore for My Learning
      </p>

      {/* User Status */}
      <div className="bg-card rounded-xl p-4 mb-6 border">
        <p className="text-sm text-muted-foreground">Logged in as:</p>
        {authLoading ? (
          <p className="font-mono">Loading...</p>
        ) : user ? (
          <div>
            <p className="font-mono text-primary">{user.email}</p>
            <p className="font-mono text-xs text-muted-foreground">UID: {user.uid}</p>
          </div>
        ) : (
          <p className="text-destructive">Not logged in. Please login first.</p>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button
          onClick={handleSeedCourse}
          disabled={loading}
          className="w-full bg-secondary text-foreground py-3 px-4 rounded-xl font-medium hover:bg-secondary/80 transition disabled:opacity-50"
        >
          1. Create Test Course Only
        </button>

        <button
          onClick={handleSeedEnrollment}
          disabled={loading || !user}
          className="w-full bg-secondary text-foreground py-3 px-4 rounded-xl font-medium hover:bg-secondary/80 transition disabled:opacity-50"
        >
          2. Create Enrollment Only (requires login)
        </button>

        <button
          onClick={handleSeedAll}
          disabled={loading || !user}
          className="w-full bg-primary text-primary-foreground py-4 px-4 rounded-xl font-bold hover:bg-primary/90 transition disabled:opacity-50"
        >
          Create All (Course + Enrollment)
        </button>

        <div className="pt-8 border-t">
          <h2 className="text-xl font-bold mb-4">Production Seed</h2>
          <button
            onClick={handleSeedDemo}
            disabled={loading}
            className="w-full bg-amber-500 text-white py-4 px-4 rounded-xl font-bold hover:bg-amber-600 transition disabled:opacity-50 shadow-lg"
          >
            Seed Demo Courses (Wipe & Reload Catalog)
          </button>
        </div>
      </div>

      {/* Status */}
      {status && (
        <div className={`mt-6 p-4 rounded-xl ${status.includes("Error") ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-600"}`}>
          <p className="font-mono text-sm">{status}</p>
        </div>
      )}

      {/* Next Steps */}
      {status && !status.includes("Error") && status.includes("Done") && (
        <div className="mt-6 p-4 bg-primary/10 rounded-xl">
          <p className="font-medium mb-2">Next step:</p>
          <a
            href="/mylearning"
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90"
          >
            Go to My Learning →
          </a>
        </div>
      )}
    </div>
  );
}
