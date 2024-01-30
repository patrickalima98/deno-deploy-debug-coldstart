// Packages
import { z } from "zod";

export function storeValidator (data: Record<any, any>) {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    description: z.string(),
    phone_number: z
      .string()
  })

  return schema.parse({
    schema,
    data
  })
}

export function updateValidator (data: Record<any, any>) {}

export function indexAllFiltersValidator (data: Record<any, any>) {}