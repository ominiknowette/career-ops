"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { firebaseClientConfig, hasFirebaseClientConfig } from "./client-config";

export function getFirebaseApp() {
  if (!hasFirebaseClientConfig()) {
    throw new Error("Firebase client config is missing. Check web/.env.local.");
  }
  return getApps().length ? getApp() : initializeApp(firebaseClientConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export const googleProvider = new GoogleAuthProvider();
