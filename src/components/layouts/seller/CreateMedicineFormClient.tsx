"use client";

import { createMedicine, getAllCategory } from "@/actions/seller.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
};

const medicineSchema = z.object({
  sellerId: z.string().min(1, "Seller Id is required"),
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  manufacturer: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  otcNote: z.string().nullable().optional(),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, "Price must be a valid number"),
  stock: z.number().int("Stock must be an integer").min(0, "Stock can’t be negative"),
  imageUrl: z.string().url("Invalid image URL").nullable().optional(),
  isActive: z.boolean(),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

export function CreateMedicineFormClient({
  sellerId,
}: {
  sellerId: string; 
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const form = useForm({
    defaultValues: {
      sellerId: sellerId || "",
      categoryId: "",
      name: "",
      manufacturer: "",
      description: "",
      otcNote: "",
      price: "",
      stock: 0,
      imageUrl: "",
      isActive: true,
    } as unknown as MedicineFormValues,
    validators: { onSubmit: medicineSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating medicine...");

      const payload = {
        sellerId: value.sellerId,
        categoryId: value.categoryId,
        name: value.name,
        manufacturer: value.manufacturer?.trim() ? value.manufacturer.trim() : null,
        description: value.description?.trim() ? value.description.trim() : null,
        otcNote: value.otcNote?.trim() ? value.otcNote.trim() : null,
        price: String(value.price),
        stock: value.stock,
        imageUrl: value.imageUrl?.trim() ? value.imageUrl.trim() : null,
        isActive: value.isActive,
      };

      try {
        const res = await createMedicine(payload);

        if ((res as any)?.error) {
          toast.error((res as any).error.message || "Failed", { id: toastId });
          return;
        }

        if ((res as any)?.success === false) {
          toast.error((res as any)?.message || "Failed", { id: toastId });
          return;
        }

        toast.success("Medicine Created", { id: toastId });
        form.reset();
        
        form.setFieldValue("sellerId", sellerId);
      } catch (err) {
        toast.error("Something went wrong", { id: toastId });
      }
    },
  });

 
  useEffect(() => {
    (async () => {
      try {
        setLoadingCats(true);
        const res = await getAllCategory();

     
        if ((res as any)?.error) {
          toast.error((res as any)?.error?.message || "Failed to load categories");
          setCategories([]);
          return;
        }

      
        const raw = (res as any)?.data?.data ?? (res as any)?.data ?? [];
        const list = Array.isArray(raw) ? raw : [];

   
        setCategories(list.filter((c: Category) => c?.isActive !== false));
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Medicine</CardTitle>
        <CardDescription>Fill the information below to create a medicine.</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="medicine-create"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* sellerId (readonly) */}
            <form.Field
              name="sellerId"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Seller ID</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value as any}
                      readOnly
                      className="bg-muted"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

           
            <form.Field
              name="categoryId"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Category</FieldLabel>

                    <Select
                      value={(field.state.value as any) || ""}
                      onValueChange={(val) => field.handleChange(val)}
                      disabled={loadingCats}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={loadingCats ? "Loading categories..." : "Select a category"}
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {categories.length ? (
                          categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            No categories found
                          </div>
                        )}
                      </SelectContent>
                    </Select>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* name */}
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value as any}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Napa, Seclo, ..."
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* manufacturer */}
            <form.Field
              name="manufacturer"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Manufacturer (optional)</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={(field.state.value as any) ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Square, Incepta..."
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* description */}
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description (optional)</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={(field.state.value as any) ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Medicine description..."
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* otcNote */}
            <form.Field
              name="otcNote"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>OTC Note (optional)</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={(field.state.value as any) ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="OTC note..."
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* price */}
            <form.Field
              name="price"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value as any}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. 120"
                      inputMode="decimal"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* stock */}
            <form.Field
              name="stock"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Stock</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      value={Number(field.state.value ?? 0)}
                      onChange={(e) => field.handleChange(Number(e.target.value || 0))}
                      min={0}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* imageUrl */}
            <form.Field
              name="imageUrl"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Image URL (optional)</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={(field.state.value as any) ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://..."
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* isActive */}
            <form.Field
              name="isActive"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="flex items-center gap-3">
                    <input
                      id={field.name}
                      name={field.name}
                      type="checkbox"
                      checked={Boolean(field.state.value)}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <FieldLabel htmlFor={field.name}>Active</FieldLabel>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col">
        <Button form="medicine-create" type="submit" className="w-full">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
