import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ComplianceCaseReview } from "../components/compliance-case-review";

export default function RegistrationDetailsPage() {
  const { id: organizationId } = useParams<{ id: string }>();
  const location = useLocation();
  const orgName = location.state?.name as string | undefined;

  return (
    <Page>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="-ml-2">
              <Link to="/registrations">
                <ArrowLeftIcon className="size-4" />
              </Link>
            </Button>
            <span>{orgName ?? "Registration Review"}</span>
          </div>
        }
      />
      <ComplianceCaseReview organizationId={organizationId!} />
    </Page>
  );
}
