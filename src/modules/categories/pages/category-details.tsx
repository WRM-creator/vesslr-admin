import { MoreVertical } from "lucide-react";
import { useParams } from "react-router-dom";
import { CategoryProductsTable } from "../components/category-products-table";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Thumbnail } from "@/components/shared/thumbnail";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryDetails() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = api.categories.detail.useQuery({
    path: { id: id! },
  });

  const category = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mw-screen-xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-4 @md:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-destructive">Failed to load category.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mw-screen-xl mx-auto">
      <PageHeader 
        title={category.name ?? "Category"}
        back={{ href: "/categories", label: "Categories" }}
        endContent={
            <div className="flex items-center gap-2">
                <Button variant="outline">Discard</Button>
                <Button>Save Changes</Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive">
                            Delete Category
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        }
      />

      <div className="grid gap-4 @md:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
            {/* General Information Card */}
            <Card>
            <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                Basic details about the category.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={category.name} placeholder="e.g. Electronics" />
                </div>
            </CardContent>
            </Card>

            {/* Products Table */}
             <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>
                        Products assigned to this category.
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    <CategoryProductsTable categoryId={category._id} />
                </CardContent>
            </Card>
        </div>

        <div className="space-y-4">
            {/* Thumbnail/Media Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Thumbnail</CardTitle>
                    <CardDescription>
                        Used for previews and grid views.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="aspect-video w-full overflow-hidden rounded-md border bg-muted relative group">
                             <Thumbnail src={category.image} alt={category.name} className="h-full w-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="secondary" size="sm">Change Image</Button>
                             </div>
                        </div>
                         <p className="text-xs text-muted-foreground text-center">
                            Recommended dimensions: 1200x630px
                        </p>
                    </div>
                </CardContent>
            </Card>
            
            {/* Metadata/SEO Card */}
             <Card>
                <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" defaultValue={category.slug} />
                        <p className="text-[0.8rem] text-muted-foreground">
                            The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
                        </p>
                     </div>
                </CardContent>
             </Card>
             
             {/* Danger Zone removed */}
        </div>
      </div>
    </div>
  );
}
