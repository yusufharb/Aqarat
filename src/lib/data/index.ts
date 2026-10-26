import { getEnvConfig } from '../env';
import type { DataRepository } from './repository';
import { DemoRepository } from './demo-repository';

let demoRepositoryInstance: DemoRepository | null = null;

export function getDataRepository(): DataRepository {
  if (typeof window !== 'undefined') {
    throw new Error('getDataRepository() must only be called on the server.');
  }

  const config = getEnvConfig();

  if (config.appMode === 'demo') {
    if (!demoRepositoryInstance) {
      demoRepositoryInstance = new DemoRepository();
    }
    return demoRepositoryInstance;
  }

  // development or production
  throw new Error('Supabase repository not yet implemented. Set APP_MODE=demo for now.');
}

export * from './repository';
export * from './demo-repository';
export * from './demo-data';
