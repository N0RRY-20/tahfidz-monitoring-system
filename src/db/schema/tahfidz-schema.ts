import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  date,
  primaryKey,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// Enums
export const colorStatusEnum = pgEnum("color_status", ["G", "Y", "R"]);
export const setoranTypeEnum = pgEnum("setoran_type", ["ziyadah", "murajaah"]);

// ========================================
// CLASSES - Master Data Kelas
// ========================================
export const classes = pgTable("classes", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ========================================
// SANTRI PROFILES
// ========================================
export const santriProfiles = pgTable(
  "santri_profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    dob: date("dob"),
    classId: text("class_id").references(() => classes.id, {
      onDelete: "set null",
    }),
    assignedGuruId: text("assigned_guru_id").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("santri_profiles_userId_idx").on(table.userId),
    index("santri_profiles_assignedGuruId_idx").on(table.assignedGuruId),
    index("santri_profiles_classId_idx").on(table.classId),
  ]
);

// ========================================
// QURAN META - Metadata 114 Surat Al-Qur'an
// ========================================
export const quranMeta = pgTable("quran_meta", {
  id: integer("id").primaryKey(),
  surahName: text("surah_name").notNull(),
  surahNameArabic: text("surah_name_arabic"),
  totalAyat: integer("total_ayat").notNull(),
  juzNumber: integer("juz_number").notNull(),
  pageStart: integer("page_start").notNull(),
  pageEnd: integer("page_end").notNull(),
});

// ========================================
// MASTER TAGS - Bank Komentar Penilaian
// ========================================
export const masterTags = pgTable(
  "master_tags",
  {
    id: text("id").primaryKey(),
    category: text("category").notNull(),
    tagText: text("tag_text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("master_tags_category_idx").on(table.category)]
);

// ========================================
// DAILY RECORDS - Transaksi Setoran Harian
// ========================================
export const dailyRecords = pgTable(
  "daily_records",
  {
    id: text("id").primaryKey(),
    santriId: text("santri_id")
      .notNull()
      .references(() => santriProfiles.id, { onDelete: "cascade" }),
    guruId: text("guru_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    surahId: integer("surah_id")
      .notNull()
      .references(() => quranMeta.id),
    ayatStart: integer("ayat_start").notNull(),
    ayatEnd: integer("ayat_end").notNull(),
    colorStatus: colorStatusEnum("color_status").notNull(),
    type: setoranTypeEnum("type").notNull(),
    notesText: text("notes_text"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("daily_records_santriId_idx").on(table.santriId),
    index("daily_records_guruId_idx").on(table.guruId),
    index("daily_records_date_idx").on(table.date),
    index("daily_records_surahId_idx").on(table.surahId),
    index("daily_records_santri_date_type_idx").on(
      table.santriId,
      table.date,
      table.type
    ),
  ]
);

// ========================================
// RECORD TAGS - Many-to-Many daily_records & master_tags
// ========================================
export const recordTags = pgTable(
  "record_tags",
  {
    recordId: text("record_id")
      .notNull()
      .references(() => dailyRecords.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => masterTags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.recordId, table.tagId] }),
    index("record_tags_recordId_idx").on(table.recordId),
    index("record_tags_tagId_idx").on(table.tagId),
  ]
);

// ========================================
// RELATIONS
// ========================================

export const classesRelations = relations(classes, ({ many }) => ({
  santriProfiles: many(santriProfiles),
}));

export const santriProfilesRelations = relations(
  santriProfiles,
  ({ one, many }) => ({
    user: one(user, {
      fields: [santriProfiles.userId],
      references: [user.id],
    }),
    class: one(classes, {
      fields: [santriProfiles.classId],
      references: [classes.id],
    }),
    assignedGuru: one(user, {
      fields: [santriProfiles.assignedGuruId],
      references: [user.id],
      relationName: "guruToSantri",
    }),
    dailyRecords: many(dailyRecords),
  })
);

export const dailyRecordsRelations = relations(
  dailyRecords,
  ({ one, many }) => ({
    santri: one(santriProfiles, {
      fields: [dailyRecords.santriId],
      references: [santriProfiles.id],
    }),
    guru: one(user, {
      fields: [dailyRecords.guruId],
      references: [user.id],
    }),
    surah: one(quranMeta, {
      fields: [dailyRecords.surahId],
      references: [quranMeta.id],
    }),
    recordTags: many(recordTags),
  })
);

export const recordTagsRelations = relations(recordTags, ({ one }) => ({
  record: one(dailyRecords, {
    fields: [recordTags.recordId],
    references: [dailyRecords.id],
  }),
  tag: one(masterTags, {
    fields: [recordTags.tagId],
    references: [masterTags.id],
  }),
}));

export const masterTagsRelations = relations(masterTags, ({ many }) => ({
  recordTags: many(recordTags),
}));
