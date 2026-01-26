import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ExternalLinkIcon, FileTextIcon } from "lucide-react";

interface MerchantComplianceTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization: any;
}

export function MerchantComplianceTab({
  organization,
}: MerchantComplianceTabProps) {
  const documents = organization.complianceDocuments || [];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Legal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Tax ID
              </span>
              <p className="mt-1">{organization.taxId || "-"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                RC Number
              </span>
              <p className="mt-1">{organization.rcNumber || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {documents.map(
                (doc: { name: string; url: string; _id?: string }) => (
                  <Item
                    key={doc._id || doc.name}
                    variant="outline"
                    className="overflow-hidden"
                  >
                    <ItemMedia variant="icon" className="size-10">
                      <FileTextIcon className="size-5" strokeWidth={1.2} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="capitalize">{doc.name}</ItemTitle>
                      <ItemDescription>PDF Document</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          View
                          <ExternalLinkIcon className="size-3" />
                        </a>
                      </Button>
                    </ItemActions>
                  </Item>
                ),
              )}
            </div>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
              <div className="bg-muted rounded-full p-3">
                <FileTextIcon className="text-muted-foreground h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">
                This merchant hasn't uploaded any compliance documents yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
