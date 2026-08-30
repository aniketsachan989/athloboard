import * as admin from 'firebase-admin';

export function initFirebaseAdmin(): admin.app.App {
  if (admin.apps.length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'athloboard-fc213';
    return admin.initializeApp({
      projectId: projectId,
    });
  }
  return admin.app();
}

export const firebaseAdmin = initFirebaseAdmin();
