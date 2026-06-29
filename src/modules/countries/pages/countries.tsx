import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import type { Country } from "@/lib/api/generated";

export default function CountriesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = api.admin.locations.countries.useQuery({});
  const { mutate: setSanctioned, isPending, variables } =
    api.admin.locations.setSanctioned.useMutation();

  // The list endpoint returns a bare Country[]; tolerate an enveloped shape too.
  const countries: Country[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data as Country[];
    const inner = (data as unknown as { data?: unknown }).data;
    return Array.isArray(inner) ? (inner as Country[]) : [];
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = q
      ? countries.filter(
          (c) =>
            c.name?.toLowerCase().includes(q) ||
            c.iso2?.toLowerCase().includes(q),
        )
      : countries;
    return [...rows].sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, search]);

  const blockedCount = countries.filter((c) => c.sanctioned).length;
  const pendingIso2 = isPending ? variables?.path?.iso2 : undefined;

  const handleToggle = (country: Country, next: boolean) => {
    setSanctioned(
      { path: { iso2: country.iso2 }, body: { sanctioned: next } },
      {
        onSuccess: () =>
          toast.success(
            next
              ? `${country.name} is now blocked from onboarding`
              : `${country.name} can now onboard`,
          ),
        onError: (err) =>
          toast.error(
            (err as { message?: string })?.message ||
              `Failed to update ${country.name}`,
          ),
      },
    );
  };

  return (
    <Page>
      <PageHeader
        title="Countries"
        description="Control which countries can onboard. Blocking a country (sanctions / embargo) hides it from the signup picker and rejects new signups for it."
      />

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Search by country or ISO code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Badge variant={blockedCount ? "destructive" : "secondary"}>
            {blockedCount} blocked
          </Badge>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>ISO</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Onboarding</TableHead>
                <TableHead className="text-right">Blocked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No countries found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((country) => (
                  <TableRow key={country.iso2}>
                    <TableCell className="font-medium">{country.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {country.iso2}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {country.currency || "—"}
                    </TableCell>
                    <TableCell>
                      {country.sanctioned ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : (
                        <Badge variant="secondary">Allowed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={country.sanctioned}
                        disabled={pendingIso2 === country.iso2}
                        onCheckedChange={(next) => handleToggle(country, next)}
                        aria-label={`Block ${country.name} from onboarding`}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Page>
  );
}
