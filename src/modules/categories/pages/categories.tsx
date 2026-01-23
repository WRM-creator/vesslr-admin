import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { CategoriesTable } from "../components/categories-table";
import type { CategoryTableItem } from "../components/categories-table/columns";
import { MOCK_CATEGORY_DATA } from "../lib/category-details-model";

// Generate some mock data for the list view
const MOCK_CATEGORIES: CategoryTableItem[] = [
  {
    ...MOCK_CATEGORY_DATA,
    id: "cat_commodities",
    productCount: 1243,
  },
  {
    ...MOCK_CATEGORY_DATA,
    id: "cat_equipment",
    identity: {
      ...MOCK_CATEGORY_DATA.identity,
      name: "Heavy Machinery & Equipment",
      description:
        "Drilling rigs, pumps, generators, and exploration equipment.",
      parentId: "Equipment",
      tags: ["machinery", "high-value", "logistics-heavy"],
      status: "active",
    },
    productCount: 452,
  },
  {
    ...MOCK_CATEGORY_DATA,
    id: "cat_logistics",
    identity: {
      ...MOCK_CATEGORY_DATA.identity,
      name: "Logistics & Chartering",
      description:
        "Vessel charters, pipeline capacity, and specialized freight services.",
      parentId: "Services",
      tags: ["services", "transport", "time-sensitive"],
      status: "active",
    },
    productCount: 189,
  },
  {
    ...MOCK_CATEGORY_DATA,
    id: "cat_safety",
    identity: {
      ...MOCK_CATEGORY_DATA.identity,
      name: "Safety & Compliance (HSE)",
      description:
        "Personal protective equipment, hazard control, and environmental safety.",
      parentId: "Supplies",
      tags: ["safety", "consumables", "regulated"],
      status: "active",
    },
    productCount: 3500,
  },
  {
    ...MOCK_CATEGORY_DATA,
    id: "cat_data",
    identity: {
      ...MOCK_CATEGORY_DATA.identity,
      name: "Data & Intelligence",
      description: "Seismic data, market reports, and geological surveys.",
      parentId: "Digital Products",
      tags: ["digital", "intellectual-property"],
      status: "draft",
    },
    productCount: 56,
  },
];

export default function CategoriesPage() {
  return (
    <Page>
      <PageHeader
        title="Categories"
        description="Manage product categories and their configuration rules."
      />

      <CategoriesTable data={MOCK_CATEGORIES} />
    </Page>
  );
}
