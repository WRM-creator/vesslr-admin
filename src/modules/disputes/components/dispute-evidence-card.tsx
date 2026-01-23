import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Image as ImageIcon, Scale, Video } from "lucide-react";
import type { EvidenceItem } from "../lib/dispute-details-model";

interface DisputeEvidenceCardProps {
  evidence: EvidenceItem[];
}

function EvidenceFile({ item }: { item: EvidenceItem }) {
  const Icon =
    item.fileType === "image"
      ? ImageIcon
      : item.fileType === "video"
        ? Video
        : FileText;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group bg-card relative cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md">
          <div className="bg-muted flex aspect-video w-full items-center justify-center">
            {item.fileType === "image" ? (
              <img
                src={item.fileUrl}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <Icon className="text-muted-foreground h-8 w-8" />
            )}
          </div>
          <div className="p-3">
            <h4 className="truncate text-sm font-medium">{item.title}</h4>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
              {item.description}
            </p>
            <div className="text-muted-foreground mt-2 flex items-center justify-between text-[10px]">
              <span className="capitalize">{item.fileType}</span>
              <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <div className="space-y-4">
          <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-black/5">
            {item.fileType === "image" ? (
              <img
                src={item.fileUrl}
                alt={item.title}
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
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-muted-foreground mt-1">{item.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DisputeEvidenceCard({ evidence }: DisputeEvidenceCardProps) {
  const claimantEvidence = evidence.filter((e) => e.submittedBy === "claimant");
  const respondentEvidence = evidence.filter(
    (e) => e.submittedBy === "respondent",
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
              Claimant Proof
            </span>
          </h4>
          {claimantEvidence.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {claimantEvidence.map((item) => (
                <EvidenceFile key={item.id} item={item} />
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
              {respondentEvidence.map((item) => (
                <EvidenceFile key={item.id} item={item} />
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
