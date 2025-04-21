import { CommunityStore } from "./community-store"
import { GamificationStore } from "./gamification-store"
import { BrandingStore } from "./branding-store"
import { CommentStore } from "./comment-store"
import { UserStore } from "./user-store"
import { ReactionStore } from "./reaction-store"
import { ProfileStore } from "./profile-store"
import { MessageStore } from "./message-store"
import { ForumStore } from "./forum-store"
import { GroupStore } from "./group-store"

export class RootStore {
  communityStore: CommunityStore
  gamificationStore: GamificationStore
  brandingStore: BrandingStore
  commentStore: CommentStore
  userStore: UserStore
  reactionStore: ReactionStore
  profileStore: ProfileStore
  messageStore: MessageStore
  forumStore: ForumStore
  groupStore: GroupStore

  constructor() {
    this.communityStore = new CommunityStore(this)
    this.gamificationStore = new GamificationStore(this)
    this.brandingStore = new BrandingStore(this)
    this.commentStore = new CommentStore(this)
    this.userStore = new UserStore(this)
    this.reactionStore = new ReactionStore(this)
    this.profileStore = new ProfileStore(this)
    this.messageStore = new MessageStore(this)
    this.forumStore = new ForumStore(this)
    this.groupStore = new GroupStore(this)
  }
}

// Hook for accessing the community store
export const useCommunityStore = () => {
  const { communityStore } = useStore()
  return communityStore
}

// Hook for accessing the gamification store
export const useGamificationStore = () => {
  const { gamificationStore } = useStore()
  return gamificationStore
}

// Hook for accessing the branding store
export const useBrandingStore = () => {
  const { brandingStore } = useStore()
  return brandingStore
}

// Hook for accessing the comment store
export const useCommentStore = () => {
  const { commentStore } = useStore()
  return commentStore
}

// Hook for accessing the user store
export const useUserStore = () => {
  const { userStore } = useStore()
  return userStore
}

// Hook for accessing the reaction store
export const useReactionStore = () => {
  const { reactionStore } = useStore()
  return reactionStore
}

// Hook for accessing the profile store
export const useProfileStore = () => {
  const { profileStore } = useStore()
  return profileStore
}

// Hook for accessing the message store
export const useMessageStore = () => {
  const { messageStore } = useStore()
  return messageStore
}

// Hook for accessing the forum store
export const useForumStore = () => {
  const { forumStore } = useStore()
  return forumStore
}

// Hook for accessing the group store
export const useGroupStore = () => {
  const { groupStore } = useStore()
  return groupStore
}

// Import at the end to avoid circular dependencies
import { useStore } from "./store-provider"
