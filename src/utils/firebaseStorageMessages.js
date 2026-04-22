/**
 * Maps Firebase Storage errors to short user-facing strings.
 * @param {{ code?: string } | null | undefined} err
 * @returns {string | null} Message if recognized, otherwise null
 */
export function messageForFirebaseStorageError(err) {
  const code = err?.code;
  if (!code || typeof code !== "string" || !code.startsWith("storage/")) {
    return null;
  }
  switch (code) {
    case "storage/quota-exceeded":
      return "Firebase Storage quota exceeded — uploads are blocked until you free space (Firebase Console → Storage) or upgrade the project plan.";
    case "storage/unauthenticated":
      return "Sign in again, then retry the upload.";
    case "storage/unauthorized":
      return "Upload was denied by Storage rules. Check Firebase Storage security rules.";
    case "storage/canceled":
      return "Upload was cancelled.";
    default:
      return "Could not upload the file to Storage. Please try again.";
  }
}
