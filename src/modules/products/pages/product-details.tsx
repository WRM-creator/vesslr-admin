import { MoreVertical } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Mock data for initial scaffolding
const MOCK_PRODUCT = {
  _id: "prod_12345",
  title: "Headphones",
  description: "High quality wireless headphones with noise cancellation.",
  price: 199.99,
  currency: "USD",
  condition: "new",
  availableQuantity: 45,
  images: ["https://placehold.co/600x400"],
  category: {
    _id: "cat_1",
    name: "Electronics"
  },
  slug: "headphones-wireless"
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  // Simulate loading
  const isLoading = false;
  // Simulate data
  const product = MOCK_PRODUCT; 

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

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-destructive">Failed to load product.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mw-screen-xl mx-auto pb-8">
      <PageHeader 
        title={product.title ?? "Product"}
        back={{ href: "/products", label: "Products" }}
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
                         <DropdownMenuItem>Archive Product</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            Delete Product
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
                    Basic details about the product.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" defaultValue={product.title} placeholder="e.g. Wireless Headphones" />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="description">Description</Label>
                        <Textarea id="description" defaultValue={product.description} className="min-h-[120px]" />
                    </div>
                </CardContent>
            </Card>

            {/* Pricing & Inventory */}
             <Card>
                <CardHeader>
                    <CardTitle>Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label htmlFor="price">Price</Label>
                             <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                <Input id="price" type="number" className="pl-7" defaultValue={product.price} />
                             </div>
                        </div>
                         <div className="space-y-2">
                             <Label htmlFor="currency">Currency</Label>
                             <Input id="currency" defaultValue={product.currency} disabled />
                        </div>
                    </div>
                    
                     <div className="space-y-2">
                        <Label htmlFor="quantity">Available Quantity</Label>
                         <Input id="quantity" type="number" defaultValue={product.availableQuantity} />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-4">
            {/* Media Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>
                        Product images.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="aspect-square w-full overflow-hidden rounded-md border bg-muted relative group">
                         {product.images?.[0] ? (
                             <img 
                                src={product.images[0]} 
                                alt={product.title} 
                                className="h-full w-full object-cover" 
                            />
                         ) : (
                             <div className="flex items-center justify-center h-full text-muted-foreground">
                                No image
                             </div>
                         )}
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="secondary" size="sm">Change Image</Button>
                         </div>
                    </div>
                </CardContent>
            </Card>
            
            {/* Properties / Organization */}
             <Card>
                <CardHeader>
                    <CardTitle>Organization</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Category</Label>
                         <Select defaultValue={product.category?._id}>
                             <SelectTrigger>
                                 <SelectValue placeholder="Select category" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value={product.category?._id || "1"}>{product.category?.name}</SelectItem>
                                 {/* Mock other categories */}
                                 <SelectItem value="cat_2">Clothing</SelectItem>
                                 <SelectItem value="cat_3">Home & Garden</SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                      <div className="space-y-2">
                        <Label>Condition</Label>
                         <Select defaultValue={product.condition}>
                             <SelectTrigger>
                                 <SelectValue placeholder="Select condition" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="new">New</SelectItem>
                                 <SelectItem value="used">Used</SelectItem>
                                 <SelectItem value="refurbished">Refurbished</SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                </CardContent>
             </Card>

             {/* Metadata */}
             <Card>
                <CardHeader>
                     <CardTitle>Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" defaultValue={product.slug} />
                     </div>
                </CardContent>
             </Card>
        </div>
      </div>
    </div>
  );
}
