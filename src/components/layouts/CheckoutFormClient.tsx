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
import {
  Banknote,
  MapPin,
  Phone,
  Truck,
  User,
  Building,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation"; 

const checkoutSchema = z.object({
  shippingName: z.string().min(2, "Name is required"),
  shippingPhone: z.string().min(11, "Valid phone number required"),
  shippingAddressLine1: z.string().min(5, "Address is required"),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z.string().min(2, "City is required"),
  shippingPostalCode: z.string().optional(),
  shippingCountry: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutFormClient() {
  const router = useRouter(); 

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
        paymentMethod: "COD" as const,
      };

      try {
        const res = await checkoutFromCart(payload);

        if (!res?.success) {
          toast.error(res?.message || "Checkout failed", { id: toastId });
          return;
        }

        toast.success("Order placed successfully!", { id: toastId });
        
        
        router.push("/"); 
        router.refresh(); 

      } catch (err) {
        toast.error("Something Went Wrong", { id: toastId });
      }
    },
  });

  return (
    <Card className="w-full max-w-3xl mt-20 mb-20 mx-auto shadow-lg border-muted/60">
      <CardHeader className="border-b bg-muted/20 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Truck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Shipping Details</CardTitle>
            <CardDescription>
              Where should we deliver your medicine?
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-8">
        <form
          id="checkout-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
         
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <form.Field
                name="shippingName"
                children={(field) => (
                  <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                    <FieldLabel>Full Name</FieldLabel>
                    <Input
                      placeholder="e.g. Osman Goni"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              />

              <form.Field
                name="shippingPhone"
                children={(field) => (
                  <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                    <FieldLabel>Phone Number</FieldLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="017xxxxxxxx"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>

          <div className="h-px bg-border/50" />

          {/* Section: Address */}
          <div className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Delivery Address
            </h3>

            <form.Field
              name="shippingAddressLine1"
              children={(field) => (
                <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                  <FieldLabel>Address Line 1</FieldLabel>
                  <Input
                    placeholder="House No, Road No, Area"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            />

            <form.Field
              name="shippingAddressLine2"
              children={(field) => (
                <Field>
                  <FieldLabel>Address Line 2 (Optional)</FieldLabel>
                  <Input
                    placeholder="Floor, Apartment, Landmark"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <form.Field
                name="shippingCity"
                children={(field) => (
                  <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                    <FieldLabel>City</FieldLabel>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Dhaka"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                     {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              />

              <form.Field
                name="shippingPostalCode"
                children={(field) => (
                  <Field>
                    <FieldLabel>Postal Code</FieldLabel>
                    <Input
                      placeholder="1200"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              />

              <form.Field
                name="shippingCountry"
                children={(field) => (
                  <Field>
                    <FieldLabel>Country</FieldLabel>
                    <Input
                      disabled
                      value={field.state.value}
                      className="bg-muted text-muted-foreground"
                    />
                  </Field>
                )}
              />
            </div>
          </div>

          <div className="h-px bg-border/50" />

          {/* Section: Payment */}
          <div className="space-y-4">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Banknote className="w-4 h-4" /> Payment Method
            </h3>
            
            <div className="relative flex items-center justify-between rounded-xl border border-primary/50 bg-primary/5 p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Banknote className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when you receive the order</p>
                </div>
              </div>
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
          </div>

        </form>
      </CardContent>

      <CardFooter className="flex flex-col bg-muted/20 border-t p-6">
        <Button 
          form="checkout-form" 
          type="submit" 
          size="lg"
          className="w-full text-base font-semibold shadow-md transition-all hover:scale-[1.01]"
        >
          Confirm Order
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-4">
          By placing this order, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  );
}