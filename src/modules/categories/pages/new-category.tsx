import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryForm } from "../components/category-form";

export default function NewCategory() {
  return (
    <Page>
      <PageHeader
        title="Create Category"
        description="Add a new category to the platform."
      />
      <CategoryForm />
    </Page>
  );
}
