CREATE TABLE "classes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "classes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DROP INDEX "santri_profiles_currentClass_idx";--> statement-breakpoint
ALTER TABLE "santri_profiles" ADD COLUMN "class_id" text;--> statement-breakpoint
ALTER TABLE "santri_profiles" ADD CONSTRAINT "santri_profiles_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "santri_profiles_classId_idx" ON "santri_profiles" USING btree ("class_id");--> statement-breakpoint
ALTER TABLE "santri_profiles" DROP COLUMN "current_class";