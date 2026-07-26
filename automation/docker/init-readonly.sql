-- Runs ONCE at PostgreSQL initdb, on an EMPTY database, BEFORE OpenClinica has booted
-- and created its schema. Therefore this script must NOT reference any application table
-- (audit_log_event, user_account, ...) — those do not exist yet. It only creates the
-- read-only evidence role and its database-level grants.
--
-- The table-level grants and the audit-immutability triggers are applied AFTER first boot
-- by post-schema-setup.sql (see that file and the README reproduce steps).

-- Read-only evidence role used by src/audit-db.ts (never write-capable).
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'oc_readonly') THEN
    CREATE ROLE oc_readonly LOGIN PASSWORD 'change-me-in-env';
  END IF;
END$$;

GRANT CONNECT ON DATABASE openclinica TO oc_readonly;
GRANT USAGE  ON SCHEMA public          TO oc_readonly;

-- NOTE: no GRANT SELECT ON ALL TABLES here — there are no tables at initdb time, so it
-- would grant nothing. SELECT on OpenClinica's tables is granted post-boot, and default
-- privileges must be declared FOR the app role that creates them (see post-schema-setup.sql).
