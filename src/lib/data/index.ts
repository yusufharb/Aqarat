import { getEnvConfig } from '../env';
import type { DataRepository } from './repository';
import { DemoRepository } from './demo-repository';
import { SupabaseRepository } from './supabase-repository';

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

  // development or production: use Supabase
  return new SupabaseRepository();
}

export * from './repository';
export * from './demo-repository';
export * from './demo-data';
