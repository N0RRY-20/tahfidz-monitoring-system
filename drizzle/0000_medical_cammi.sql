CREATE TYPE "public"."color_status" AS ENUM('G', 'Y', 'R');--> statement-breakpoint
CREATE TYPE "public"."setoran_type" AS ENUM('ziyadah', 'murajaah');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"user_id" text NOT NULL,
	"role_id" text NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_role_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_records" (
	"id" text PRIMARY KEY NOT NULL,
	"santri_id" text NOT NULL,
	"guru_id" text NOT NULL,
	"date" date NOT NULL,
	"surah_id" integer NOT NULL,
	"ayat_start" integer NOT NULL,
	"ayat_end" integer NOT NULL,
	"color_status" "color_status" NOT NULL,
	"type" "setoran_type" NOT NULL,
	"notes_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "master_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"tag_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quran_meta" (
	"id" integer PRIMARY KEY NOT NULL,
	"surah_name" text NOT NULL,
	"surah_name_arabic" text,
	"total_ayat" integer NOT NULL,
	"juz_number" integer NOT NULL,
	"page_start" integer NOT NULL,
	"page_end" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "record_tags" (
	"record_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "record_tags_record_id_tag_id_pk" PRIMARY KEY("record_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "santri_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"full_name" text NOT NULL,
	"dob" date,
	"current_class" text,
	"assigned_guru_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_records" ADD CONSTRAINT "daily_records_santri_id_santri_profiles_id_fk" FOREIGN KEY ("santri_id") REFERENCES "public"."santri_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_records" ADD CONSTRAINT "daily_records_guru_id_user_id_fk" FOREIGN KEY ("guru_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_records" ADD CONSTRAINT "daily_records_surah_id_quran_meta_id_fk" FOREIGN KEY ("surah_id") REFERENCES "public"."quran_meta"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "record_tags" ADD CONSTRAINT "record_tags_record_id_daily_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."daily_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "record_tags" ADD CONSTRAINT "record_tags_tag_id_master_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."master_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "santri_profiles" ADD CONSTRAINT "santri_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "santri_profiles" ADD CONSTRAINT "santri_profiles_assigned_guru_id_user_id_fk" FOREIGN KEY ("assigned_guru_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_role_userId_idx" ON "user_role" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_role_roleId_idx" ON "user_role" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "daily_records_santriId_idx" ON "daily_records" USING btree ("santri_id");--> statement-breakpoint
CREATE INDEX "daily_records_guruId_idx" ON "daily_records" USING btree ("guru_id");--> statement-breakpoint
CREATE INDEX "daily_records_date_idx" ON "daily_records" USING btree ("date");--> statement-breakpoint
CREATE INDEX "daily_records_surahId_idx" ON "daily_records" USING btree ("surah_id");--> statement-breakpoint
CREATE INDEX "master_tags_category_idx" ON "master_tags" USING btree ("category");--> statement-breakpoint
CREATE INDEX "record_tags_recordId_idx" ON "record_tags" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX "record_tags_tagId_idx" ON "record_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "santri_profiles_userId_idx" ON "santri_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "santri_profiles_assignedGuruId_idx" ON "santri_profiles" USING btree ("assigned_guru_id");--> statement-breakpoint
CREATE INDEX "santri_profiles_currentClass_idx" ON "santri_profiles" USING btree ("current_class");