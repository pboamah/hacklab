import { getBrowserClient } from "@/lib/supabase"

export async function seedGamificationData() {
  const supabase = getBrowserClient()

  // Check if we already have badges
  const { data: existingBadges } = await supabase.from("badges").select("id").limit(1)

  // Only seed if we don't have badges yet
  if (existingBadges && existingBadges.length > 0) {
    console.log("Badges already exist, skipping seed")
    return
  }

  // Add badge images
  const badges = [
    {
      name: "Newcomer",
      description: "Joined the community",
      requirement: "Join the platform",
      points_value: 0,
      image_url: "/badges/newcomer.svg",
    },
    {
      name: "Socializer",
      description: "Connected with 5 community members",
      requirement: "Connect with 5 members",
      points_value: 50,
      image_url: "/badges/socializer.svg",
    },
    {
      name: "Event Enthusiast",
      description: "Attended 3 events",
      requirement: "Attend 3 events",
      points_value: 100,
      image_url: "/badges/event-enthusiast.svg",
    },
    {
      name: "Content Creator",
      description: "Created 5 posts",
      requirement: "Create 5 posts",
      points_value: 150,
      image_url: "/badges/content-creator.svg",
    },
    {
      name: "Contributor",
      description: "Received 10 likes on content",
      requirement: "Receive 10 likes",
      points_value: 200,
      image_url: "/badges/contributor.svg",
    },
    {
      name: "Resource Maven",
      description: "Shared 3 resources",
      requirement: "Share 3 resources",
      points_value: 150,
      image_url: "/badges/resource-maven.svg",
    },
    {
      name: "Community Leader",
      description: "Created a community group",
      requirement: "Create a community",
      points_value: 300,
      image_url: "/badges/community-leader.svg",
    },
    {
      name: "Event Organizer",
      description: "Organized an event",
      requirement: "Organize an event",
      points_value: 250,
      image_url: "/badges/event-organizer.svg",
    },
  ]

  // Insert badges
  const { error } = await supabase.from("badges").insert(badges)

  if (error) {
    console.error("Error seeding badges:", error)
    return
  }

  console.log("Successfully seeded gamification data")
}
