CREATE TYPE "public"."event_type" AS ENUM('handshake', 'handshake_rejected', 'pr_opened', 'pr_merged', 'pr_approved', 'ci_passed', 'ci_failed', 'closure_proposed', 'closure_approved', 'closure_vetoed', 'jira_status_changed', 'slack_message');--> statement-breakpoint
CREATE TYPE "public"."policy_tier" AS ENUM('agile', 'standard', 'hardened');--> statement-breakpoint
CREATE TYPE "public"."proof_status" AS ENUM('draft', 'pending', 'finalized', 'exported');--> statement-breakpoint
CREATE TYPE "public"."trigger_source" AS ENUM('automatic', 'jira_webhook', 'github_webhook', 'slack_webhook', 'manual');--> statement-breakpoint
CREATE TABLE "closure_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proof_packet_id" uuid NOT NULL,
	"policy_id" uuid NOT NULL,
	"status" text DEFAULT 'pending',
	"scheduled_for" timestamp NOT NULL,
	"vetoed_by" text,
	"veto_reason" text,
	"vetoed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prev_hash" text,
	"event_hash" text NOT NULL,
	"event_type" "event_type" NOT NULL,
	"trigger_source" "trigger_source" DEFAULT 'automatic',
	"payload" jsonb NOT NULL,
	"rejected_by" text,
	"rejected_at" timestamp with time zone,
	"vetoed_by" text,
	"vetoed_at" timestamp with time zone,
	"workspace_id" uuid NOT NULL,
	"task_id" text,
	"proof_packet_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"tier" "policy_tier" DEFAULT 'standard',
	"description" text,
	"required_approvals" integer DEFAULT 1 NOT NULL,
	"require_ci_pass" boolean DEFAULT true NOT NULL,
	"auto_close_delay_hours" integer DEFAULT 24 NOT NULL,
	"require_all_checks_pass" boolean DEFAULT false,
	"require_linked_issue" boolean DEFAULT false,
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proof_packets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"task_id" text NOT NULL,
	"status" "proof_status" DEFAULT 'draft',
	"ai_summary" text,
	"ai_summary_model" text,
	"handshake_event_id" uuid,
	"closure_event_id" uuid,
	"hash_chain_root" text,
	"exported_url" text,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slack_team_id" text,
	"slack_access_token" text,
	"github_org" text,
	"github_installation_id" text,
	"jira_site" text,
	"jira_access_token" text,
	"default_policy_tier" "policy_tier" DEFAULT 'standard',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "closure_jobs" ADD CONSTRAINT "closure_jobs_proof_packet_id_proof_packets_id_fk" FOREIGN KEY ("proof_packet_id") REFERENCES "public"."proof_packets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "closure_jobs" ADD CONSTRAINT "closure_jobs_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policies" ADD CONSTRAINT "policies_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proof_packets" ADD CONSTRAINT "proof_packets_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proof_packets" ADD CONSTRAINT "proof_packets_handshake_event_id_events_id_fk" FOREIGN KEY ("handshake_event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proof_packets" ADD CONSTRAINT "proof_packets_closure_event_id_events_id_fk" FOREIGN KEY ("closure_event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;