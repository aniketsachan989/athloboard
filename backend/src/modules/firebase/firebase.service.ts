import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app: admin.app.App;

  onModuleInit() {
    this.initFirebase();
  }

  initFirebase(): admin.app.App {
    if (admin.apps.length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID || 'athloboard-fc213';
      this.app = admin.initializeApp({
        projectId: projectId,
      });
      this.logger.log(`Firebase Admin SDK initialized successfully (Project ID: ${projectId})`);
    } else {
      this.app = admin.app();
    }
    return this.app;
  }

  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    if (admin.apps.length === 0) {
      this.initFirebase();
    }
    return admin.auth().verifyIdToken(token);
  }

  async checkHealth(): Promise<{
    status: 'connected' | 'error';
    projectId: string;
    appsCount: number;
    latencyMs: number;
    certsReachable: boolean;
    message?: string;
  }> {
    const start = Date.now();
    try {
      if (admin.apps.length === 0) {
        this.initFirebase();
      }

      // Check public token signing certs reachability from Google
      const certRes = await fetch(
        'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
        { signal: AbortSignal.timeout(5000) }
      );
      const latency = Date.now() - start;

      return {
        status: 'connected',
        projectId: process.env.FIREBASE_PROJECT_ID || 'athloboard-fc213',
        appsCount: admin.apps.length,
        latencyMs: latency,
        certsReachable: certRes.ok,
      };
    } catch (err: any) {
      return {
        status: 'error',
        projectId: process.env.FIREBASE_PROJECT_ID || 'athloboard-fc213',
        appsCount: admin.apps.length,
        latencyMs: Date.now() - start,
        certsReachable: false,
        message: err.message,
      };
    }
  }
}
