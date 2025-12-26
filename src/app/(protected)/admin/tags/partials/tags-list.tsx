"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconTags, IconTrash } from "@tabler/icons-react";
import { Tag, CATEGORY_STYLES } from "./types";
import { TagDeleteAlert } from "./tags-dialogs";

interface TagsListProps {
  tags: Tag[];
  onDelete: (id: string) => void;
  setDialogOpen: (open: boolean) => void;
}

export function TagsList({ tags, onDelete, setDialogOpen }: TagsListProps) {
  // Group tags by category
  const tagsByCategory = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  // Get all unique categories (sorted)
  const sortedCategories = Object.keys(tagsByCategory).sort();

  const getCategoryStyle = (categoryName: string) => {
    return (
      CATEGORY_STYLES[categoryName] ||
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
    );
  };

  if (sortedCategories.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
          <IconTags className="h-10 w-10 mb-4 opacity-50" />
          <p>Belum ada data bank komentar.</p>
          <Button
            variant="link"
            onClick={() => setDialogOpen(true)}
            className="mt-2"
          >
            Tambah Tag Pertama
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <IconTags className="size-4" />
        <span>
          Total {tags.length} tag dalam {sortedCategories.length} kategori
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedCategories.map((category) => {
          const categoryTags = tagsByCategory[category] || [];
          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{category}</span>
                  <Badge variant="secondary" className="font-normal">
                    {categoryTags.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categoryTags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`group flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors ${getCategoryStyle(
                        category
                      )}`}
                    >
                      <span>{tag.tagText}</span>
                      <TagDeleteAlert
                        tagText={tag.tagText}
                        onConfirm={() => onDelete(tag.id)}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent"
                        >
                          <IconTrash className="size-3 text-red-500" />
                        </Button>
                      </TagDeleteAlert>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
