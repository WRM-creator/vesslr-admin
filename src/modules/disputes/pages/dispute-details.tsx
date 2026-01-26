import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { getDispute } from "@/lib/api/disputes";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Flag, MoreVertical } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// Components
import { DisputeContextCard } from "../components/dispute-context-card";
import { DisputeEvidenceCard } from "../components/dispute-evidence-card";
import { DisputeOverviewCard } from "../components/dispute-overview-card";
import { DisputePartiesCard } from "../components/dispute-parties-card";
import { DisputeResolutionCard } from "../components/dispute-resolution-card";
import { DisputeTimelineCard } from "../components/dispute-timeline-card";

export default function DisputeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["disputes", id],
    queryFn: () => getDispute(id!),
    enabled: !!id,
  });

  if (isLoading || !data) {
    return (
      <Page>
        <div>Loading...</div>
      </Page>
    );
  }

  return (
    <Page>
      {/* Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="hover:text-primary pl-0 hover:bg-transparent"
          onClick={() => navigate("/disputes")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Disputes
        </Button>
      </div>

      {/* Header & Actions */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <PageHeader
            title={`Dispute #${data._id}`}
            description={`Last updated ${new Date(data.updatedAt).toLocaleDateString()}`}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-muted-foreground">
            Escalate to Legal
          </Button>
          <Button variant="destructive" size="icon">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (66%) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <DisputeOverviewCard data={data} />

          {/* Context (Transaction & Product) */}
          <DisputeContextCard data={data} />

          {/* Evidence */}
          <DisputeEvidenceCard
            evidence={data.evidence || []}
            initiatorId={data.initiator._id}
            respondentId={data.respondent._id}
          />

          {/* Timeline / Chat */}
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="font-semibold">Case Timeline & Messages</h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <DisputeTimelineCard
                timeline={[
                  {
                    id: "1",
                    type: "system",
                    title: "Dispute Opened",
                    timestamp: data.createdAt,
                    description: "Dispute was initiated automatically.",
                    actor: "System",
                    actorRole: "system",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Column (33%) */}
        <div className="space-y-6">
          {/* Resolution Control (Sticky/High Priority) */}
          <div className="sticky top-6 space-y-6">
            <DisputeResolutionCard data={data} />

            {/* Parties */}
            <DisputePartiesCard
              claimant={data.initiator}
              respondent={data.respondent}
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
