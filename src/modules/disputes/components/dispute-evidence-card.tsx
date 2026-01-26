import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { Dispute } from "@/lib/api/disputes";
import { FileText, Image as ImageIcon, Scale, Video } from "lucide-react";

type EvidenceItem = Dispute["evidence"][number];

interface DisputeEvidenceCardProps {
  evidence: EvidenceItem[];
  initiatorId: string;
  respondentId: string;
}

function EvidenceFile({ item }: { item: EvidenceItem }) {
  const Icon =
    item.type === "image"
      ? ImageIcon
      : item.type === "video"
        ? Video
        : FileText;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group bg-card relative cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md">
          <div className="bg-muted flex aspect-video w-full items-center justify-center">
            {item.type === "image" ? (
              <img
                src={item.url}
                alt="Evidence"
                className="h-full w-full object-cover"
              />
            ) : (
              <Icon className="text-muted-foreground h-8 w-8" />
            )}
          </div>
          <div className="p-3">
            <h4 className="truncate text-sm font-medium">Evidence File</h4>
            <div className="text-muted-foreground mt-2 flex items-center justify-between text-[10px]">
              <span className="capitalize">{item.type}</span>
              <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <div className="space-y-4">
          <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-black/5">
            {item.type === "image" ? (
              <img
                src={item.url}
                alt="Evidence"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="p-8 text-center">
                <Icon className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <p className="text-muted-foreground">Preview not available</p>
                <Button variant="outline" className="mt-4">
                  Download File
                </Button>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Evidence Details</h3>
            <p className="text-muted-foreground mt-1">
              Uploaded on {new Date(item.uploadedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DisputeEvidenceCard({
  evidence,
  initiatorId,
  respondentId,
}: DisputeEvidenceCardProps) {
  const claimantEvidence = evidence.filter((e) => e.uploadedBy === initiatorId);
  const respondentEvidence = evidence.filter(
    (e) => e.uploadedBy === respondentId,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Submitted Evidence
        </CardTitle>
        <Scale className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Claimant Section */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
            <span className="rounded-full bg-blue-100 px-2 py-0.5 dark:bg-blue-900/30">
              Initiator Proof
            </span>
          </h4>
          {claimantEvidence.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {claimantEvidence.map((item, idx) => (
                <EvidenceFile key={idx} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              No evidence submitted yet.
            </p>
          )}
        </div>

        {/* Respondent Section */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-orange-600 uppercase dark:text-orange-400">
            <span className="rounded-full bg-orange-100 px-2 py-0.5 dark:bg-orange-900/30">
              Respondent Defense
            </span>
          </h4>
          {respondentEvidence.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {respondentEvidence.map((item, idx) => (
                <EvidenceFile key={idx} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              No evidence submitted yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
