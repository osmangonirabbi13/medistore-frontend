"use client";

import { checkoutFromCart } from "@/actions/order.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";

const checkoutSchema = z.object({
  shippingName: z.string().min(2, "Name is required"),
  shippingPhone: z.string().min(7, "Phone is required"),
  shippingAddressLine1: z.string().min(5, "Address is required"),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z.string().min(2, "City is required"),
  shippingPostalCode: z.string().optional(),
  shippingCountry: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutFormClient() {
  const form = useForm({
    defaultValues: {
      shippingName: "",
      shippingPhone: "",
      shippingAddressLine1: "",
      shippingAddressLine2: "",
      shippingCity: "",
      shippingPostalCode: "",
      shippingCountry: "Bangladesh",
    } as CheckoutFormValues,

    validators: {
      onSubmit: ({ value }) => {
        const parsed = checkoutSchema.safeParse(value);
        if (parsed.success) return;
        return parsed.error.issues.map((i) => i.message);
      },
    },

    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Placing order...");

      const payload = {
        shippingName: value.shippingName,
        shippingPhone: value.shippingPhone,
        shippingAddressLine1: value.shippingAddressLine1,
        shippingAddressLine2: value.shippingAddressLine2 || undefined,
        shippingCity: value.shippingCity,
        shippingPostalCode: value.shippingPostalCode || undefined,
        shippingCountry: value.shippingCountry || "Bangladesh",
        paymentMethod: "COD", 
      };

      try {
        const res = await checkoutFromCart(payload);

        if (!res?.success) {
          toast.error(res?.message || "Checkout failed", { id: toastId });
          return;
        }

        toast.success("Checkout success", { id: toastId });
      } catch (err) {
        toast.error("Something Went Wrong", { id: toastId });
      }
    },
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>
          Enter shipping information to place your order
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="checkout-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            
            <form.Field
              name="shippingName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Osman Goni"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

          
            <form.Field
              name="shippingPhone"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="01712345678"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

         
            <form.Field
              name="shippingAddressLine1"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Address Line 1
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="House 12, Road 5, Dhanmondi"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            
            <form.Field
              name="shippingAddressLine2"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Address Line 2 (Optional)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="2nd Floor"
                  />
                </Field>
              )}
            />

            
            <form.Field
              name="shippingCity"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>City</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Dhaka"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            
            <form.Field
              name="shippingPostalCode"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Postal Code (Optional)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="1209"
                  />
                </Field>
              )}
            />

           
            <form.Field
              name="shippingCountry"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Bangladesh"
                  />
                </Field>
              )}
            />

            
            <div className="rounded-lg border p-3 text-sm text-muted-foreground">
              Payment Method: <span className="font-medium text-foreground">Cash on Delivery (COD)</span>
            </div>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col">
        <Button form="checkout-form" type="submit" className="w-full">
          Place Order
        </Button>
      </CardFooter>
    </Card>
  );
}
