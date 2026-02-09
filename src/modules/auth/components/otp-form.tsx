import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { otpSchema, type OtpValues } from "../schemas";

interface OtpFormProps {
  onSubmit: (values: OtpValues) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function OtpForm({ onSubmit, onBack, isLoading }: OtpFormProps) {
  const form = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                    if (value.length === 6 && !isLoading) {
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="border-input h-12 w-12 rounded-md border text-lg"
                      />
                    ))}
                  </div>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>
        <div className="text-center">
          <Button
            variant="link"
            size="sm"
            className="text-muted-foreground"
            onClick={onBack}
            type="button"
          >
            Back to login
          </Button>
        </div>
      </form>
    </Form>
  );
}
