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
import { adminTransactionsControllerAddRequirement } from "@/lib/api/generated";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

interface AddRequirementDialogProps {
  transactionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRequiredFrom?: "BUYER" | "SELLER";
}

export function AddRequirementDialog({
  transactionId,
  open,
  onOpenChange,
  defaultRequiredFrom = "SELLER",
}: AddRequirementDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "OTHER",
      name: "",
      requiredFrom: defaultRequiredFrom,
      isMandatory: true,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      adminTransactionsControllerAddRequirement({
        path: { id: transactionId },
        body: values,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transaction", transactionId],
      });
      toast.success("Requirement added successfully");
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Failed to add requirement:", error);
      toast.error("Failed to add requirement");
    },
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction Requirement</DialogTitle>
          <DialogDescription>
            Request a specific document from either the buyer or the seller.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="space-y-4"
          >
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Adding..." : "Add Requirement"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
