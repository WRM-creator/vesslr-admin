import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const images = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1599839443657-36e392668578?q=80&w=2668&auto=format&fit=crop",
    alt: "Cargo Inspection",
    caption: "Cargo Hold 1",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1599839185012-70b7713f06cb?q=80&w=2668&auto=format&fit=crop",
    alt: "Sampling Process",
    caption: "Sampling",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1599839352758-cda6b7ac0a9a?q=80&w=2668&auto=format&fit=crop",
    alt: "Seal Inspection",
    caption: "Seal Verification",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1621932363539-78f9219322c3?q=80&w=2670&auto=format&fit=crop",
    alt: "Meter Reading",
    caption: "Meter Reading",
  },
];

export function TransactionQQMedia() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspection Media</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-md border"
            >
              <AspectRatio ratio={4 / 3}>
                <img
                  src={img.url}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </AspectRatio>
              <div className="absolute right-0 bottom-0 left-0 bg-black/60 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {img.caption}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
