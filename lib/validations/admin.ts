import { z } from "zod"

export const userCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  country: z.string().optional(),
  role: z.enum(["admin", "moderator", "user"]).default("user"),
})

export const userUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  image: z.string().url("Invalid image URL").optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["admin", "moderator", "user"]).optional(),
})

export const reportUpdateSchema = z.object({
  status: z.enum(["pending", "reviewing", "approved", "rejected"]),
  resolution_notes: z.string().optional(),
})

export const communityCreateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  image: z.string().url("Invalid image URL").optional(),
  banner: z.string().url("Invalid banner URL").optional(),
  is_open: z.boolean().default(true),
  owner_id: z.string().uuid("Invalid owner ID"),
})

export const communityUpdateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  description: z.string().optional(),
  image: z.string().url("Invalid image URL").optional(),
  banner: z.string().url("Invalid banner URL").optional(),
  is_open: z.boolean().optional(),
})

export const eventCreateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  start_date: z.string().datetime("Invalid start date"),
  end_date: z.string().datetime("Invalid end date"),
  location: z.string().optional(),
  is_virtual: z.boolean().default(false),
  image: z.string().url("Invalid image URL").optional(),
  organizer_id: z.string().uuid("Invalid organizer ID"),
  community_id: z.string().uuid("Invalid community ID").optional(),
  type: z.string().optional(),
})

export const eventUpdateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  description: z.string().optional(),
  start_date: z.string().datetime("Invalid start date").optional(),
  end_date: z.string().datetime("Invalid end date").optional(),
  location: z.string().optional(),
  is_virtual: z.boolean().optional(),
  image: z.string().url("Invalid image URL").optional(),
  type: z.string().optional(),
})
