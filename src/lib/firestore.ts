import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { app } from "./firebase";
import type { Course, Enrollment } from "@/types";

export const db = getFirestore(app);

/**
 * PASO 1: Obtener todos los enrollments (inscripciones) de un usuario
 *
 * Esta función busca en la colección "enrollments" todos los documentos
 * donde el campo "userId" coincida con el UID del usuario actual.
 *
 * @param userId - El UID del usuario (de Firebase Auth)
 * @returns Array de enrollments del usuario
 */
export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  // Creamos una query que filtra por userId
  const q = query(
    collection(db, "enrollments"),
    where("userId", "==", userId)
  );

  // Ejecutamos la query
  const snapshot = await getDocs(q);

  // Convertimos los documentos a objetos Enrollment
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Enrollment[];
}

/**
 * PASO 2: Obtener los detalles de un curso por su ID
 *
 * Esta función obtiene un documento específico de la colección "courses"
 * usando su ID.
 *
 * @param courseId - El ID del curso
 * @returns El curso o null si no existe
 */
export async function getCourseById(courseId: string): Promise<Course | null> {
  // Referencia al documento
  const ref = doc(db, "courses", courseId);

  // Obtenemos el documento
  const snap = await getDoc(ref);

  // Si existe, retornamos los datos
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as Course;
  }

  return null;
}

/**
 * PASO 3: Marcar una lección como completada
 *
 * Esta función actualiza el enrollment para:
 * 1. Agregar el lessonId al array de lecciones completadas
 * 2. Actualizar el progreso total
 * 3. Guardar la última lección vista
 *
 * @param enrollmentId - ID del documento enrollment
 * @param lessonId - ID de la lección completada
 * @param moduleId - ID del módulo actual
 * @param newProgress - Nuevo porcentaje de progreso (0-100)
 */
export async function markLessonComplete(
  enrollmentId: string,
  lessonId: string,
  moduleId: string,
  newProgress: number
): Promise<void> {
  const enrollmentRef = doc(db, "enrollments", enrollmentId);

  await updateDoc(enrollmentRef, {
    // arrayUnion agrega el lessonId solo si no existe ya
    completedLessons: arrayUnion(lessonId),
    lastLessonId: lessonId,
    lastModuleId: moduleId,
    progress: newProgress,
  });
}

/**
 * PASO 4: Calcular el progreso del curso
 *
 * Cuenta todas las lecciones del curso y calcula qué porcentaje
 * ha sido completado.
 *
 * @param course - El curso con sus módulos y lecciones
 * @param completedLessons - Array de IDs de lecciones completadas
 * @returns Porcentaje de progreso (0-100)
 */
export function calculateProgress(
  course: Course,
  completedLessons: string[]
): number {
  // Contamos el total de lecciones en todos los módulos
  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  if (totalLessons === 0) return 0;

  // Calculamos el porcentaje
  return Math.round((completedLessons.length / totalLessons) * 100);
}
