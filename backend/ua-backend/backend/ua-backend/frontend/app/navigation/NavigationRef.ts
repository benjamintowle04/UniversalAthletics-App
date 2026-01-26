import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function isNavigationReady() {
  return navigationRef.isReady();
}

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params);
  }
}

export function resetRootToHomeTab() {
  if (!navigationRef.isReady()) return;
  navigationRef.reset({
    index: 0,
    routes: [
      {
        name: 'HomeTab',
        state: {
          routes: [
            { name: 'Home' }
          ]
        }
      }
    ]
  });
}

export function resetRootToPreLogin() {
  if (!navigationRef.isReady()) return;
  // Reset the root navigation state so the EntryPoint screen is the first route.
  // This mirrors the HomeTab reset helper used elsewhere.
  navigationRef.reset({
    index: 0,
    routes: [
      {
        name: 'EntryPoint',
      }
    ]
  });
}

// Retry variant: attempt to reset root until the navigationRef becomes ready
export async function resetRootToHomeTabWithRetry(maxAttempts = 10, delayMs = 100) {
  let attempts = 0;
  return new Promise<void>((resolve, reject) => {
    const tryReset = () => {
      attempts += 1;
      if (navigationRef.isReady()) {
        try {
          resetRootToHomeTab();
          resolve();
        } catch (err) {
          reject(err);
        }
        return;
      }

      if (attempts >= maxAttempts) {
        reject(new Error('navigationRef not ready after retries'));
        return;
      }

      setTimeout(tryReset, delayMs);
    };

    tryReset();
  });
}

// Retry variant for resetting to the pre-login EntryPoint
export async function resetRootToPreLoginWithRetry(maxAttempts = 10, delayMs = 100) {
  let attempts = 0;
  return new Promise<void>((resolve, reject) => {
    const tryReset = () => {
      attempts += 1;
      if (navigationRef.isReady()) {
        try {
          resetRootToPreLogin();
          resolve();
        } catch (err) {
          reject(err);
        }
        return;
      }

      if (attempts >= maxAttempts) {
        reject(new Error('navigationRef not ready after retries'));
        return;
      }

      setTimeout(tryReset, delayMs);
    };

    tryReset();
  });
}

export function resetRoot(routes: any[]) {
  if (!navigationRef.isReady()) return;
  navigationRef.reset({ index: 0, routes });
}

export default navigationRef;
