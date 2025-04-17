import { getServerClient, getBrowserClient } from "@/lib/supabase"

const AVATARS_BUCKET = "avatars"
const COMMUNITY_IMAGES_BUCKET = "community-images"
const EVENT_IMAGES_BUCKET = "event-images"
const POST_IMAGES_BUCKET = "post-images"
const RESOURCE_FILES_BUCKET = "resource-files"

// Initialize buckets
export async function initializeStorage() {
  const supabase = getServerClient()

  // Create buckets if they don't exist
  const buckets = [
    AVATARS_BUCKET,
    COMMUNITY_IMAGES_BUCKET,
    EVENT_IMAGES_BUCKET,
    POST_IMAGES_BUCKET,
    RESOURCE_FILES_BUCKET,
  ]

  for (const bucket of buckets) {
    const { data, error } = await supabase.storage.getBucket(bucket)

    if (error && error.message.includes("The resource was not found")) {
      await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })
    }
  }
}

// Generate a unique filename
export function generateUniqueFileName(fileName: string): string {
  const extension = fileName.split(".").pop()
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 10)
  return `${timestamp}-${randomString}.${extension}`
}

// Upload a file to a specific bucket
export async function uploadFile(
  file: File,
  bucket: string,
  path = "",
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const supabase = getBrowserClient()
    const uniqueFileName = generateUniqueFileName(file.name)
    const filePath = path ? `${path}/${uniqueFileName}` : uniqueFileName

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return { url: publicUrlData.publicUrl, error: null }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { url: null, error: error as Error }
  }
}

// Delete a file from a specific bucket
export async function deleteFile(filePath: string, bucket: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const supabase = getBrowserClient()

    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { success: false, error: error as Error }
  }
}

// Helper functions for specific buckets
export const uploadAvatar = (file: File, userId: string) => uploadFile(file, AVATARS_BUCKET, userId)

export const uploadCommunityImage = (file: File, communityId: string) =>
  uploadFile(file, COMMUNITY_IMAGES_BUCKET, communityId)

export const uploadEventImage = (file: File, eventId: string) => uploadFile(file, EVENT_IMAGES_BUCKET, eventId)

export const uploadPostImage = (file: File, postId: string) => uploadFile(file, POST_IMAGES_BUCKET, postId)

export const uploadResourceFile = (file: File, resourceId: string) =>
  uploadFile(file, RESOURCE_FILES_BUCKET, resourceId)

// Extract filename from URL
export function getFileNameFromUrl(url: string): string {
  const urlParts = url.split("/")
  return urlParts[urlParts.length - 1]
}
