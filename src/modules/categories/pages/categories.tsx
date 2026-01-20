import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { CategoriesTable } from "../components/categories-table";
import type { CategoryTableItem } from "../components/categories-table/columns";
import { MOCK_CATEGORY_DATA } from "../lib/category-details-model";

// Generate some mock data for the list view
const MOCK_CATEGORIES: CategoryTableItem[] = [
  {
    ...MOCK_CATEGORY_DATA,
    id: "cat_chemical",
    productCount: 1243,
  },
  {
    ...MOCK_CATEGORY_DATA,
    id: "cat_electronics",
    identity: {
      ...MOCK_CATEGORY_DATA.identity,
      name: "Consumer Electronics",
      description: "Mobile phones, laptops, and accessories",
      tags: ["tech", "consumer", "high-value"],
      status: "active",
    },
    productCount: 4521,
  },
  {
    ...MOCK_CATEGORY_DATA,
    id: "cat_textiles",
    identity: {
      ...MOCK_CATEGORY_DATA.identity,
      name: "Textiles & Fabrics",
      description: "Raw fabrics and finished textile products",
      tags: ["raw material", "fashion"],
      status: "active",
    },
    productCount: 890,
  },
  {
    ...MOCK_CATEGORY_DATA,
    id: "cat_machinery",
    identity: {
      ...MOCK_CATEGORY_DATA.identity,
      name: "Heavy Machinery",
      description: "Industrial equipment and heavy machinery",
      tags: ["industrial", "heavy"],
      status: "draft",
    },
    productCount: 0,
  },
  {
    ...MOCK_CATEGORY_DATA,
    id: "cat_pharma",
    identity: {
      ...MOCK_CATEGORY_DATA.identity,
      name: "Pharmaceuticals",
      description: "Medical drugs and supplements",
      tags: ["medical", "regulated"],
      status: "deprecated",
    },
    productCount: 120,
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
