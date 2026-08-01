export function describeSignalingError(error: unknown, operation: string): string {
  const code = (error as { code?: string })?.code;
  if (code === "permission-denied") {
    return `Call signaling unavailable (${operation}): Firestore denied access. The "calls" security rules in the Firebase console must match firestore.rules (read/update for both participants) and the composite index must be enabled.`;
  }
  if (code === "failed-precondition") {
    return `Call signaling unavailable (${operation}): Firestore query needs the composite index on "calls" (calleeId ASC, status ASC). Create it in Firebase console > Firestore > Indexes and wait until Enabled.`;
  }
  return `Call signaling unavailable (${operation}): ${error instanceof Error ? error.message : String(error)}`;
}
