import { AuditLogEntry } from './types';
import { getEnvConfig } from './env';
import { createAdminClient } from './supabase/admin';

// In-memory audit log storage for Demo mode
const DEMO_AUDIT_LOGS: AuditLogEntry[] = [];

export async function recordAuditLog(entry: {
  entityName: string;
  entityId: string;
  action: string;
  actorId: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress?: string | null;
}): Promise<AuditLogEntry> {
  const config = getEnvConfig();

  const logEntry: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    entity_name: entry.entityName,
    entity_id: entry.entityId,
    action: entry.action,
    actor_id: entry.actorId,
    old_values: entry.oldValues || null,
    new_values: entry.newValues || null,
    ip_address: entry.ipAddress || null,
    timestamp: new Date().toISOString(),
  };

  if (config.isDemo) {
    DEMO_AUDIT_LOGS.unshift(logEntry);
    return logEntry;
  }

  // Development or Production: insert via Server Admin client
  const supabase = createAdminClient();
  const { error } = await supabase.from('audit_logs').insert({
    entity_name: logEntry.entity_name,
    entity_id: logEntry.entity_id,
    action: logEntry.action,
    actor_id: logEntry.actor_id,
    old_values: logEntry.old_values,
    new_values: logEntry.new_values,
    ip_address: logEntry.ip_address,
  });

  if (error) {
    console.error('Failed to persist audit log to Supabase:', error.message);
  }

  return logEntry;
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  const config = getEnvConfig();

  if (config.isDemo) {
    return [...DEMO_AUDIT_LOGS];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }

  return (data || []) as AuditLogEntry[];
}
