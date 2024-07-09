
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."Brief" (
    "id" "text" NOT NULL,
    "title" "text" NOT NULL,
    "status" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "content" "text" NOT NULL,
    "deadline" "jsonb" NOT NULL
);

ALTER TABLE "public"."Brief" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."BriefNotification" (
    "id" "text" NOT NULL,
    "message" "text" NOT NULL,
    "read" boolean DEFAULT false NOT NULL,
    "briefId" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE "public"."BriefNotification" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Feedback" (
    "id" "text" NOT NULL,
    "content" "text" NOT NULL,
    "userId" "text",
    "briefId" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE "public"."Feedback" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" "text" NOT NULL,
    "name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "role" "text" DEFAULT 'Team Member'::"text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "password" character varying(255) NOT NULL
);

ALTER TABLE "public"."User" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."_BriefNotificationToUser" (
    "A" "text" NOT NULL,
    "B" "text" NOT NULL
);

ALTER TABLE "public"."_BriefNotificationToUser" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."_BriefToUser" (
    "A" "text" NOT NULL,
    "B" "text" NOT NULL
);

ALTER TABLE "public"."_BriefToUser" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";

ALTER TABLE ONLY "public"."BriefNotification"
    ADD CONSTRAINT "BriefNotification_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Brief"
    ADD CONSTRAINT "Brief_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Feedback"
    ADD CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING "btree" ("email");

CREATE UNIQUE INDEX "_BriefNotificationToUser_AB_unique" ON "public"."_BriefNotificationToUser" USING "btree" ("A", "B");

CREATE INDEX "_BriefNotificationToUser_B_index" ON "public"."_BriefNotificationToUser" USING "btree" ("B");

CREATE UNIQUE INDEX "_BriefToUser_AB_unique" ON "public"."_BriefToUser" USING "btree" ("A", "B");

CREATE INDEX "_BriefToUser_B_index" ON "public"."_BriefToUser" USING "btree" ("B");

ALTER TABLE ONLY "public"."BriefNotification"
    ADD CONSTRAINT "BriefNotification_briefId_fkey" FOREIGN KEY ("briefId") REFERENCES "public"."Brief"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."Feedback"
    ADD CONSTRAINT "Feedback_briefId_fkey" FOREIGN KEY ("briefId") REFERENCES "public"."Brief"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."Feedback"
    ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."_BriefNotificationToUser"
    ADD CONSTRAINT "_BriefNotificationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."BriefNotification"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."_BriefNotificationToUser"
    ADD CONSTRAINT "_BriefNotificationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."_BriefToUser"
    ADD CONSTRAINT "_BriefToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Brief"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."_BriefToUser"
    ADD CONSTRAINT "_BriefToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."Brief" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Feedback" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."Brief" TO "anon";
GRANT ALL ON TABLE "public"."Brief" TO "authenticated";
GRANT ALL ON TABLE "public"."Brief" TO "service_role";

GRANT ALL ON TABLE "public"."BriefNotification" TO "anon";
GRANT ALL ON TABLE "public"."BriefNotification" TO "authenticated";
GRANT ALL ON TABLE "public"."BriefNotification" TO "service_role";

GRANT ALL ON TABLE "public"."Feedback" TO "anon";
GRANT ALL ON TABLE "public"."Feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."Feedback" TO "service_role";

GRANT ALL ON TABLE "public"."User" TO "anon";
GRANT ALL ON TABLE "public"."User" TO "authenticated";
GRANT ALL ON TABLE "public"."User" TO "service_role";

GRANT ALL ON TABLE "public"."_BriefNotificationToUser" TO "anon";
GRANT ALL ON TABLE "public"."_BriefNotificationToUser" TO "authenticated";
GRANT ALL ON TABLE "public"."_BriefNotificationToUser" TO "service_role";

GRANT ALL ON TABLE "public"."_BriefToUser" TO "anon";
GRANT ALL ON TABLE "public"."_BriefToUser" TO "authenticated";
GRANT ALL ON TABLE "public"."_BriefToUser" TO "service_role";

GRANT ALL ON TABLE "public"."_prisma_migrations" TO "anon";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
