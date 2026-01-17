-- Migration: Performance Indexes
-- Date: 2026-01-18
-- 
-- Adds indexes for common query patterns to improve performance.

-- Events table: Queries by workspace and task
CREATE INDEX IF NOT EXISTS idx_events_workspace_task 
  ON events(workspace_id, task_id);

-- Events table: Time-ordered queries
CREATE INDEX IF NOT EXISTS idx_events_workspace_created 
  ON events(workspace_id, created_at DESC);

-- Events table: Event type filtering
CREATE INDEX IF NOT EXISTS idx_events_type 
  ON events(workspace_id, event_type);

-- Proof packets: Status filtering
CREATE INDEX IF NOT EXISTS idx_proof_packets_workspace_status 
  ON proof_packets(workspace_id, status);

-- Proof packets: Task lookup
CREATE INDEX IF NOT EXISTS idx_proof_packets_task 
  ON proof_packets(workspace_id, task_id);

-- Closure jobs: Queue processing
CREATE INDEX IF NOT EXISTS idx_closure_jobs_status_scheduled 
  ON closure_jobs(status, scheduled_for);

-- Closure jobs: Workspace lookup
CREATE INDEX IF NOT EXISTS idx_closure_jobs_workspace 
  ON closure_jobs(workspace_id, status);

-- Policies: Workspace lookup
CREATE INDEX IF NOT EXISTS idx_policies_workspace 
  ON policies(workspace_id);
