import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  type: z.enum([
    "INVOICE",
    "PACKING_LIST",
    "CERTIFICATE_OF_ORIGIN",
    "SAFETY_DATA_SHEET",
    "BILL_OF_LADING",
    "OTHER",
  ]),
  name: z.string().min(1, "Name is required"),
  requiredFrom: z.enum(["BUYER", "SELLER"]),
  isMandatory: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditRequirementDialogProps {
  transactionId: string;
  requirement: any; // Using any for now or TransactionDocumentSlotDto if it has _id
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRequirementDialog({
  transactionId,
  requirement,
  open,
  onOpenChange,
}: EditRequirementDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "OTHER",
      name: "",
      requiredFrom: "SELLER",
      isMandatory: true,
    },
  });

  useEffect(() => {
    if (requirement) {
      form.reset({
        type: requirement.type as any,
        name: requirement.name,
        requiredFrom: requirement.requiredFrom as any,
        isMandatory: requirement.isMandatory ?? false,
      });
    }
  }, [requirement, form]);

  const { mutate: updateRequirement, isPending } =
    api.admin.transactions.updateRequirement.useMutation({
      onSuccess: () => {
        toast.success("Requirement updated successfully");
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Failed to update requirement:", error);
        toast.error("Failed to update requirement");
      },
    });

  function onSubmit(values: FormValues) {
    if (!requirement?._id) return;
    updateRequirement({
      path: { id: transactionId, requirementId: requirement._id },
      body: values,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction Requirement</DialogTitle>
          <DialogDescription>
            Update the details for this document requirement.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Quality Certificate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INVOICE">Invoice</SelectItem>
                      <SelectItem value="PACKING_LIST">Packing List</SelectItem>
                      <SelectItem value="CERTIFICATE_OF_ORIGIN">
                        Certificate of Origin
                      </SelectItem>
                      <SelectItem value="SAFETY_DATA_SHEET">
                        Safety Data Sheet (SDS)
                      </SelectItem>
                      <SelectItem value="BILL_OF_LADING">
                        Bill of Lading
                      </SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="requiredFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required From</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Who should provide this?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BUYER">Buyer</SelectItem>
                      <SelectItem value="SELLER">Seller</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="isMandatory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Mandatory</FormLabel>
                    <FormDescription>
                      Is this document required to proceed?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Requirement"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
