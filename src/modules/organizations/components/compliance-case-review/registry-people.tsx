import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  RegistryBeneficialOwnerDto,
  RegistryDataDto,
  RegistryFiduciaryDto,
  RegistryPersonDto,
  RegistryTrusteeDto,
} from "@/lib/api/generated";
import { Loader2Icon, UserPlusIcon } from "lucide-react";
import type { ComplianceCase } from "./types";

function Field({ label, value }: { label: string; value?: string | boolean }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-0.5 text-sm">{String(value)}</p>
    </div>
  );
}

function formatDate(iso?: string) {
  if (!iso) return undefined;
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function PersonCard({ person }: { person: RegistryPersonDto }) {
  return (
    <div className="rounded-md border p-4">
      <p className="mb-3 font-medium">{person.name ?? "—"}</p>
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <Field label="Occupation" value={person.occupation} />
        <Field label="Nationality" value={person.nationality} />
        <Field label="Gender" value={person.gender} />
        <Field label="Date of birth" value={formatDate(person.dateOfBirth)} />
        <Field label="Shareholdings" value={person.shareholdings} />
        <Field label="ID type" value={person.idType} />
        <Field label="ID number" value={person.idNumber} />
        <Field label="Phone" value={person.phoneNumber} />
        <Field label="Address" value={person.address} />
      </div>
    </div>
  );
}

function BeneficialOwnerCard({ owner }: { owner: RegistryBeneficialOwnerDto }) {
  return (
    <div className="rounded-md border p-4">
      <p className="mb-3 font-medium">{owner.name ?? "—"}</p>
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <Field label="Shareholder type" value={owner.shareholderType} />
        <Field label="Shareholdings" value={owner.shareholdings} />
        <Field label="Nationality" value={owner.nationality} />
        <Field label="Gender" value={owner.gender} />
        <Field label="Phone" value={owner.phoneNumber} />
        <Field label="Reg. number" value={owner.registrationNumber} />
        <Field label="Address" value={owner.address} />
      </div>
    </div>
  );
}

function TrusteeCard({ trustee }: { trustee: RegistryTrusteeDto }) {
  return (
    <div className="rounded-md border p-4">
      <div className="mb-3 flex items-center gap-2">
        <p className="font-medium">{trustee.name ?? "—"}</p>
        {trustee.isChairman && (
          <span className="text-muted-foreground text-xs">(Chairman)</span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <Field label="Type" value={trustee.trusteeType} />
        <Field label="Occupation" value={trustee.occupation} />
        <Field label="Nationality" value={trustee.nationality} />
        <Field label="Gender" value={trustee.gender} />
        <Field label="Date of birth" value={formatDate(trustee.dateOfBirth)} />
        <Field label="Date of appointment" value={formatDate(trustee.dateOfAppointment)} />
        <Field label="Phone" value={trustee.phoneNumber} />
        <Field label="Email" value={trustee.email} />
        <Field label="Reg. number" value={trustee.registrationNumber} />
        <Field label="Address" value={trustee.address} />
      </div>
    </div>
  );
}

function FiduciaryCard({ fiduciary }: { fiduciary: RegistryFiduciaryDto }) {
  return (
    <div className="rounded-md border p-4">
      <p className="mb-3 font-medium">{fiduciary.name ?? "—"}</p>
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <Field label="Type" value={fiduciary.fiduciaryType} />
        <Field label="Status" value={fiduciary.status} />
        <Field label="Reg. number" value={fiduciary.registrationNumber} />
        <Field label="Address" value={fiduciary.address} />
      </div>
    </div>
  );
}

function EmptyTab() {
  return (
    <p className="text-muted-foreground py-6 text-center text-sm">
      No records returned by registry.
    </p>
  );
}

interface RegistryPeopleProps {
  registryData: RegistryDataDto;
  /** Registry-vs-stored divergence; drives the adopt banner when present. */
  reconciliation?: ComplianceCase["peopleReconciliation"];
  /** Adopt the missing registry people into the stored profile. */
  onAdopt?: () => void;
  isAdopting?: boolean;
}

/**
 * The registry-found-people-the-profile-never-stored divergence, made visible
 * and fixable in place. Adoption is gap-fill only (nothing stored is touched)
 * and the adopted people arrive incomplete, so the banner names exactly who is
 * missing instead of a bare count.
 */
function ReconciliationBanner({
  reconciliation,
  onAdopt,
  isAdopting,
}: {
  reconciliation: ComplianceCase["peopleReconciliation"];
  onAdopt?: () => void;
  isAdopting?: boolean;
}) {
  const missing = [
    ...reconciliation.directorsNotStored.map((n) => ({ n, role: "director" })),
    ...reconciliation.ownersNotStored.map((n) => ({ n, role: "owner" })),
  ];
  if (missing.length === 0) return null;
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/40">
      <div>
        <p className="font-medium">
          The registry lists {missing.length}{" "}
          {missing.length === 1 ? "person" : "people"} not stored on this
          profile
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {missing.map(({ n, role }) => `${n} (${role})`).join(", ")}
        </p>
      </div>
      {onAdopt && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAdopt}
          disabled={isAdopting}
        >
          {isAdopting ? (
            <Loader2Icon className="mr-1.5 size-4 animate-spin" />
          ) : (
            <UserPlusIcon className="mr-1.5 size-4" />
          )}
          Adopt from registry
        </Button>
      )}
    </div>
  );
}

export function RegistryPeople({
  registryData,
  reconciliation,
  onAdopt,
  isAdopting,
}: RegistryPeopleProps) {
  const { directors = [], beneficialOwners = [], proprietors = [], trustees = [], fiduciaries = [] } =
    registryData;

  const tabs = [
    { id: "directors", label: `Directors (${directors.length})`, show: true },
    { id: "beneficial_owners", label: `Beneficial Owners (${beneficialOwners.length})`, show: beneficialOwners.length > 0 },
    { id: "proprietors", label: `Proprietors (${proprietors.length})`, show: proprietors.length > 0 },
    { id: "trustees", label: `Trustees (${trustees.length})`, show: trustees.length > 0 },
    { id: "fiduciaries", label: `Fiduciaries (${fiduciaries.length})`, show: fiduciaries.length > 0 },
  ].filter((t) => t.show);

  const defaultTab = tabs[0]?.id ?? "directors";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Associated Persons</CardTitle>
          {reconciliation && (
            <span className="text-muted-foreground text-xs">
              Stored on profile: {reconciliation.storedDirectors}{" "}
              {reconciliation.storedDirectors === 1 ? "director" : "directors"},{" "}
              {reconciliation.storedOwners}{" "}
              {reconciliation.storedOwners === 1 ? "owner" : "owners"}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reconciliation && (
          <ReconciliationBanner
            reconciliation={reconciliation}
            onAdopt={onAdopt}
            isAdopting={isAdopting}
          />
        )}
        <Tabs defaultValue={defaultTab}>
          <TabsList className="mb-4">
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="directors" className="space-y-3">
            {directors.length === 0 ? (
              <EmptyTab />
            ) : (
              directors.map((d, i) => <PersonCard key={i} person={d} />)
            )}
          </TabsContent>

          <TabsContent value="beneficial_owners" className="space-y-3">
            {beneficialOwners.length === 0 ? (
              <EmptyTab />
            ) : (
              beneficialOwners.map((o, i) => <BeneficialOwnerCard key={i} owner={o} />)
            )}
          </TabsContent>

          <TabsContent value="proprietors" className="space-y-3">
            {proprietors.length === 0 ? (
              <EmptyTab />
            ) : (
              proprietors.map((p, i) => <PersonCard key={i} person={p} />)
            )}
          </TabsContent>

          <TabsContent value="trustees" className="space-y-3">
            {trustees.length === 0 ? (
              <EmptyTab />
            ) : (
              trustees.map((t, i) => <TrusteeCard key={i} trustee={t} />)
            )}
          </TabsContent>

          <TabsContent value="fiduciaries" className="space-y-3">
            {fiduciaries.length === 0 ? (
              <EmptyTab />
            ) : (
              fiduciaries.map((f, i) => <FiduciaryCard key={i} fiduciary={f} />)
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
