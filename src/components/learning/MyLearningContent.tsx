"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getUserEnrollments,
  getCourseById,
  markLessonComplete,
  calculateProgress,
} from "@/lib/firestore";
import { LessonPlayer } from "./LessonPlayer";
import type { Chapter } from "./ChapterList";
import type { Course, Enrollment, Lesson, Module } from "@/types";

/**
 * ============================================================
 * COMPONENTE PRINCIPAL: MyLearningContent
 * ============================================================
 *
 * Este componente muestra el contenido de aprendizaje del usuario.
 * Conecta con Firestore para obtener:
 * 1. Los enrollments (inscripciones) del usuario
 * 2. Los detalles del curso actual
 *
 * FLUJO DE DATOS:
 * Usuario → AuthContext → userId
 * userId → Firestore enrollments → courseId
 * courseId → Firestore courses → Course data
 * Course data → Transform → LessonPlayer props
 */

export function MyLearningContent() {
  // ============================================================
  // PASO 1: Obtener el usuario actual desde AuthContext
  // ============================================================
  const { user, loading: authLoading } = useAuth();

  // ============================================================
  // PASO 2: Estados para manejar los datos
  // ============================================================
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para rastrear la lección actual
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

  // ============================================================
  // PASO 3: Cargar datos cuando el usuario esté disponible
  // ============================================================
  useEffect(() => {
    async function loadUserLearning() {
      // Si aún está cargando la autenticación, esperamos
      if (authLoading) return;

      // Si no hay usuario logueado, mostramos mensaje
      if (!user) {
        setLoading(false);
        setError("Please log in to see your learning progress.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // PASO 3.1: Obtener los enrollments del usuario
        const enrollments = await getUserEnrollments(user.uid);

        // Si no tiene inscripciones, mostramos mensaje
        if (enrollments.length === 0) {
          setLoading(false);
          setError("You haven't enrolled in any courses yet. Browse our catalog to get started!");
          return;
        }

        // PASO 3.2: Por ahora, tomamos el primer enrollment
        // (En el futuro podrías agregar un selector de cursos)
        const currentEnrollment = enrollments[0];
        setEnrollment(currentEnrollment);

        // PASO 3.3: Obtener los detalles del curso
        const courseData = await getCourseById(currentEnrollment.courseId);

        if (!courseData) {
          setError("Course not found. It may have been deleted.");
          setLoading(false);
          return;
        }

        setCourse(courseData);

        // PASO 3.4: Encontrar la lección actual basada en lastLessonId
        if (currentEnrollment.lastLessonId && currentEnrollment.lastModuleId) {
          const moduleIdx = courseData.modules.findIndex(
            (m) => m.id === currentEnrollment.lastModuleId
          );
          if (moduleIdx !== -1) {
            setCurrentModuleIndex(moduleIdx);
            const lessonIdx = courseData.modules[moduleIdx].lessons.findIndex(
              (l) => l.id === currentEnrollment.lastLessonId
            );
            if (lessonIdx !== -1) {
              setCurrentLessonIndex(lessonIdx);
            }
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading learning data:", err);
        setError("Failed to load your learning data. Please try again.");
        setLoading(false);
      }
    }

    loadUserLearning();
  }, [user, authLoading]);

  // ============================================================
  // PASO 4: Función para avanzar a la siguiente lección
  // ============================================================
  const handleNextLesson = async () => {
    if (!course || !enrollment) return;

    const currentModule = course.modules[currentModuleIndex];
    const currentLesson = currentModule.lessons[currentLessonIndex];

    // Marcar la lección actual como completada
    const newCompletedLessons = enrollment.completedLessons.includes(currentLesson.id)
      ? enrollment.completedLessons
      : [...enrollment.completedLessons, currentLesson.id];

    const newProgress = calculateProgress(course, newCompletedLessons);

    // Determinar la siguiente lección
    let nextModuleIndex = currentModuleIndex;
    let nextLessonIndex = currentLessonIndex + 1;

    // Si terminamos las lecciones del módulo actual, pasamos al siguiente módulo
    if (nextLessonIndex >= currentModule.lessons.length) {
      nextModuleIndex++;
      nextLessonIndex = 0;
    }

    // Verificar si hay más lecciones
    if (nextModuleIndex < course.modules.length) {
      const nextModule = course.modules[nextModuleIndex];
      const nextLesson = nextModule.lessons[nextLessonIndex];

      // Actualizar en Firestore
      await markLessonComplete(
        enrollment.id,
        nextLesson.id,
        nextModule.id,
        newProgress
      );

      // Actualizar estado local
      setEnrollment({
        ...enrollment,
        completedLessons: newCompletedLessons,
        progress: newProgress,
        lastLessonId: nextLesson.id,
        lastModuleId: nextModule.id,
      });

      setCurrentModuleIndex(nextModuleIndex);
      setCurrentLessonIndex(nextLessonIndex);
    }
  };

  // ============================================================
  // PASO 4.5: Función para cambiar de capítulo (cuando el usuario hace clic)
  // ============================================================
  const handleChapterSelect = (flatIndex: number) => {
    if (!course) return;

    // Convertir el índice plano a índices de módulo y lección
    let count = 0;
    for (let modIdx = 0; modIdx < course.modules.length; modIdx++) {
      const module = course.modules[modIdx];
      for (let lesIdx = 0; lesIdx < module.lessons.length; lesIdx++) {
        if (count === flatIndex) {
          setCurrentModuleIndex(modIdx);
          setCurrentLessonIndex(lesIdx);
          return;
        }
        count++;
      }
    }
  };

  // ============================================================
  // PASO 5: Transformar datos del curso al formato de Chapter
  // ============================================================
  const transformToChapters = (
    course: Course,
    completedLessons: string[],
    currentLessonId: string
  ): Chapter[] => {
    // Aplanamos todas las lecciones de todos los módulos
    const allLessons: (Lesson & { moduleTitle: string })[] = [];

    course.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        allLessons.push({ ...lesson, moduleTitle: module.title });
      });
    });

    // Convertimos al formato Chapter
    return allLessons.map((lesson, index) => ({
      id: index + 1,
      title: lesson.title,
      duration: formatDuration(lesson.duration),
      isCompleted: completedLessons.includes(lesson.id),
      isActive: lesson.id === currentLessonId,
      isLive: lesson.id === currentLessonId,
    }));
  };

  // ============================================================
  // PASO 6: Utilidad para formatear duración (segundos → MM:SS)
  // ============================================================
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ============================================================
  // RENDERIZADO: Estados de carga, error y contenido
  // ============================================================

  // Estado de carga
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your learning...</p>
        </div>
      </div>
    );
  }

  // Estado de error o sin datos
  if (error || !course || !enrollment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {error ? "Oops!" : "No Course Found"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {error || "We couldn't find your course data."}
          </p>
          <a
            href="/courses"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Browse Courses
          </a>
        </div>
      </div>
    );
  }

  // Obtener datos de la lección actual
  const currentModule = course.modules[currentModuleIndex];
  const currentLesson = currentModule.lessons[currentLessonIndex];

  // Calcular tiempo total del curso
  const totalSeconds = course.modules.reduce(
    (total, mod) => total + mod.lessons.reduce((t, l) => t + l.duration, 0),
    0
  );

  // Calcular tiempo restante
  const completedSeconds = course.modules.reduce((total, mod) => {
    return total + mod.lessons
      .filter((l) => enrollment.completedLessons.includes(l.id))
      .reduce((t, l) => t + l.duration, 0);
  }, 0);
  const remainingSeconds = totalSeconds - completedSeconds;
  const remainingMins = Math.ceil(remainingSeconds / 60);

  // Transformar a chapters
  const chapters = transformToChapters(
    course,
    enrollment.completedLessons,
    currentLesson.id
  );

  // Calcular progreso dinámicamente
  const totalLessons = course.modules.reduce((t, m) => t + m.lessons.length, 0);
  const completedCount = enrollment.completedLessons.length;
  const dynamicProgress = Math.round((completedCount / totalLessons) * 100);

  // ============================================================
  // RENDERIZADO PRINCIPAL
  // ============================================================
  return (
    <div className="min-h-screen bg-background pt-8">
      <LessonPlayer
        title={currentLesson.title}
        breadcrumb={["MY LEARNING", course.title.toUpperCase()]}
        currentTime="0:00"
        totalTime={formatDuration(currentLesson.duration)}
        videoUrl={currentLesson.videoUrl}
        moduleNumber={currentModuleIndex + 1}
        totalModules={course.modules.length}
        remainingTime={`${remainingMins} MIN`}
        description={
          currentLesson.description ||
          currentModule.title ||
          course.description
        }
        chapters={chapters}
        currentChapter={completedCount}
        totalChapters={totalLessons}
        keyTakeaway={`Progress: ${dynamicProgress}% complete`}
        resourceTitle="Resources"
        resourceDescription={`Continue learning ${course.title}`}
        onNextLesson={handleNextLesson}
        onChapterSelect={handleChapterSelect}
      />
    </div>
  );
}
