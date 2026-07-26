-- Runs ONCE AFTER OpenClinica has first booted and created its schema.
-- Apply with (adjust service/role names to your compose):
--   docker compose exec -T db psql -U openclinica -d openclinica -f - < post-schema-setup.sql
-- Re-running is safe (idempotent).
--
-- It does two things the initdb script could not:
--   1) grants the read-only evidence role SELECT on the tables OpenClinica just created,
--      plus a default privilege scoped to the APP role so future tables are covered too;
--   2) ENFORCES audit-trail immutability with triggers.
--
-- WHY TRIGGERS, NOT `REVOKE UPDATE/DELETE`:
-- OpenClinica creates (and therefore owns) its tables. A table owner keeps UPDATE/DELETE
-- regardless of REVOKE, so a REVOKE-based approach does not actually prevent tampering.
-- BEFORE UPDATE/DELETE triggers reject the operation for everyone (owner included) and are
-- what OQ-15 verifies functionally.

-- 1) Read-only SELECT for the evidence role -----------------------------------
GRANT SELECT ON ALL TABLES IN SCHEMA public TO oc_readonly;
-- Default privilege must be declared FOR the role that will create future tables (the app
-- role "openclinica"), otherwise it only covers tables created by the role running this.
ALTER DEFAULT PRIVILEGES FOR ROLE openclinica IN SCHEMA public
  GRANT SELECT ON TABLES TO oc_readonly;

-- 2) Audit-trail immutability triggers ----------------------------------------
CREATE OR REPLACE FUNCTION prevent_audit_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit trail is immutable: % on % is not permitted (VQ-005 R-04)',
    TG_OP, TG_TABLE_NAME
    USING ERRCODE = 'integrity_constraint_violation';
END;
$$ LANGUAGE plpgsql;

-- Row-level guard against UPDATE/DELETE.
-- NB: `EXECUTE PROCEDURE` (not `EXECUTE FUNCTION`) for OpenClinica CE's PostgreSQL 9.x.
DROP TRIGGER IF EXISTS trg_audit_log_event_immutable ON audit_log_event;
CREATE TRIGGER trg_audit_log_event_immutable
  BEFORE UPDATE OR DELETE ON audit_log_event
  FOR EACH ROW EXECUTE PROCEDURE prevent_audit_mutation();

DROP TRIGGER IF EXISTS trg_audit_user_login_immutable ON audit_user_login;
CREATE TRIGGER trg_audit_user_login_immutable
  BEFORE UPDATE OR DELETE ON audit_user_login
  FOR EACH ROW EXECUTE PROCEDURE prevent_audit_mutation();

-- Statement-level guard against TRUNCATE.
DROP TRIGGER IF EXISTS trg_audit_log_event_no_truncate ON audit_log_event;
CREATE TRIGGER trg_audit_log_event_no_truncate
  BEFORE TRUNCATE ON audit_log_event
  FOR EACH STATEMENT EXECUTE PROCEDURE prevent_audit_mutation();

DROP TRIGGER IF EXISTS trg_audit_user_login_no_truncate ON audit_user_login;
CREATE TRIGGER trg_audit_user_login_no_truncate
  BEFORE TRUNCATE ON audit_user_login
  FOR EACH STATEMENT EXECUTE PROCEDURE prevent_audit_mutation();
