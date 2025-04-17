import * as z from "zod"

// User schema
export const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

// Profile schema
export const profileSchema = z.object({
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters." }).optional(),
  location: z.string().max(100, { message: "Location must not exceed 100 characters." }).optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  skills: z.array(z.string()).optional(),
})

// Community schema
export const communitySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  isPrivate: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

// Event schema
export const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  isVirtual: z.boolean().default(false),
  maxAttendees: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
})

// Post schema
export const postSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  communityId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
})

// Comment schema
export const commentSchema = z.object({
  content: z.string().min(1, { message: "Comment cannot be empty." }),
  postId: z.string().uuid(),
})

// Resource schema
export const resourceSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  url: z.string().url({ message: "Please enter a valid URL." }),
  type: z.enum(["article", "video", "book", "course", "other"]),
  tags: z.array(z.string()).optional(),
})

// Hackathon schema
export const hackathonSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  registrationDeadline: z.date({ required_error: "Registration deadline is required." }),
  maxTeamSize: z.number().int().positive().default(5),
  prizes: z.array(z.string()).optional(),
  sponsors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

// Team schema
export const teamSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  hackathonId: z.string().uuid(),
  members: z.array(z.string().uuid()).optional(),
})

// Project schema
export const projectSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  repoUrl: z.string().url({ message: "Please enter a valid repository URL." }).optional(),
  demoUrl: z.string().url({ message: "Please enter a valid demo URL." }).optional(),
  teamId: z.string().uuid(),
  hackathonId: z.string().uuid(),
  technologies: z.array(z.string()).optional(),
})

// Forum schema
export const forumSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  communityId: z.string().uuid().optional(),
})

// Topic schema
export const topicSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  forumId: z.string().uuid(),
  tags: z.array(z.string()).optional(),
})

// Reply schema
export const replySchema = z.object({
  content: z.string().min(1, { message: "Reply cannot be empty." }),
  topicId: z.string().uuid(),
})

// Group schema
export const groupSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  isPrivate: z.boolean().default(false),
  communityId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
})

// Poll schema
export const pollSchema = z.object({
  question: z.string().min(5, { message: "Question must be at least 5 characters." }),
  options: z.array(z.string()).min(2, { message: "Poll must have at least 2 options." }),
  multipleChoice: z.boolean().default(false),
  endDate: z.date().optional(),
  communityId: z.string().uuid().optional(),
  groupId: z.string().uuid().optional(),
})

// Vote schema
export const voteSchema = z.object({
  pollId: z.string().uuid(),
  optionIds: z.array(z.string().uuid()),
})

// Message schema
export const messageSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty." }),
  recipientId: z.string().uuid(),
})

// Notification schema
export const notificationSchema = z.object({
  type: z.enum(["message", "mention", "comment", "like", "follow", "event", "invitation", "announcement"]),
  content: z.string(),
  linkUrl: z.string().optional(),
  isRead: z.boolean().default(false),
})

// Badge schema
export const badgeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }),
  requirement: z.string().min(5, { message: "Requirement must be at least 5 characters." }),
  pointsValue: z.number().int().nonnegative(),
})

// Job schema
export const jobSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  requirements: z.string().min(10, { message: "Requirements must be at least 10 characters." }),
  salary: z.string().optional(),
  contactEmail: z.string().email({ message: "Please enter a valid email address." }),
  applicationUrl: z.string().url({ message: "Please enter a valid application URL." }).optional(),
  isRemote: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  postedBy: z.string().uuid(),
  expiresAt: z.date().optional(),
})
