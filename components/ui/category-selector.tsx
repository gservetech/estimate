"use client";
import { Category } from "@/types/Category.types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
}

const CategorySelector = ({ categories }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? categories.find((category) => category.id === Number(value))
                ?.category_name || "Unknown Category"
            : "Filter by Category"}

          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search category..."
            className="h-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const selectedCategory = categories.find((c) =>
                  c.category_name
                    ?.toLowerCase()
                    .includes(e.currentTarget.value.toLowerCase())
                );
                if (selectedCategory?.category_name) {
                  const slug = encodeURIComponent(
                    selectedCategory.category_name
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                  ); // Convert name to slug
                  setValue(String(selectedCategory.id)); // Convert id to a string
                  router.push(`/categories/${slug}`);
                  setOpen(false);
                }
              }
            }}
          />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id} // Ensure 'id' is used consistently
                  value={category.category_name} // Use 'category_name' instead of 'title'
                  onSelect={() => {
                    const slug = encodeURIComponent(
                      category.category_name.toLowerCase().replace(/\s+/g, "-")
                    ); // Convert category_name to slug
                    setValue(
                      value === String(category.id) ? "" : String(category.id)
                    ); // Convert 'id' to string
                    router.push(`/categories/${slug}`);
                    setOpen(false);
                  }}
                >
                  {category.category_name}{" "}
                  {/* Use 'category_name' instead of 'title' */}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === String(category.id)
                        ? "opacity-100"
                        : "opacity-0" // Convert 'id' to string for comparison
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelector;
