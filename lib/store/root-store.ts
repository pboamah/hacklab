import { makeAutoObservable } from "mobx"
import { UserStore } from "./user-store"
import { CommunityStore } from "./community-store"
import { EventStore } from "./event-store"
import { HackathonStore } from "./hackathon-store"
import { JobStore } from "./job-store"
import { PostStore } from "./post-store"
import { AdminStore } from "./admin-store"
import { MessageStore } from "./message-store"
import { ReactionStore } from "./reaction-store"
import { BrandingStore } from "./branding-store"
import { ProfileStore } from "./profile-store"
import { CommentStore } from "./comment-store"
import { ForumStore } from "./forum-store"
import { GroupStore } from "./group-store"
import { PollStore } from "./poll-store"
import { ResourceStore } from "./resource-store"
import { NotificationStore } from "./notification-store"
import { enableStaticRendering } from "mobx-react-lite"
import { configure } from "mobx"

// Configure MobX
configure({
  enforceActions: "observed",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: false,
})

// Enable static rendering for server-side rendering
enableStaticRendering(typeof window === "undefined")

export class RootStore {
  userStore: UserStore
  communityStore: CommunityStore
  eventStore: EventStore
  hackathonStore: HackathonStore
  jobStore: JobStore
  postStore: PostStore
  adminStore: AdminStore
  messageStore: MessageStore
  reactionStore: ReactionStore
  brandingStore: BrandingStore
  profileStore: ProfileStore
  commentStore: CommentStore
  forumStore: ForumStore
  groupStore: GroupStore
  pollStore: PollStore
  resourceStore: ResourceStore
  notificationStore: NotificationStore

  constructor() {
    this.userStore = new UserStore(this)
    this.communityStore = new CommunityStore(this)
    this.eventStore = new EventStore(this)
    this.hackathonStore = new HackathonStore(this)
    this.jobStore = new JobStore(this)
    this.postStore = new PostStore(this)
    this.adminStore = new AdminStore(this)
    this.messageStore = new MessageStore(this)
    this.reactionStore = new ReactionStore(this)
    this.brandingStore = new BrandingStore(this)
    this.profileStore = new ProfileStore(this)
    this.commentStore = new CommentStore(this)
    this.forumStore = new ForumStore(this)
    this.groupStore = new GroupStore(this)
    this.pollStore = new PollStore(this)
    this.resourceStore = new ResourceStore(this)
    this.notificationStore = new NotificationStore(this)

    makeAutoObservable(this)
  }
}

const rootStore = new RootStore()

export const useNotificationStore = () => rootStore.notificationStore
export const useGamificationStore = () => rootStore.hackathonStore
export default rootStore
export const useCommunityStore = () => rootStore.communityStore
export const useEventStore = () => rootStore.eventStore
export const useUserStore = () => rootStore.userStore
export const useProfileStore = () => rootStore.profileStore
export const useMessageStore = () => rootStore.messageStore
export const useForumStore = () => rootStore.forumStore
export const useGroupStore = () => rootStore.groupStore
export const usePollStore = () => rootStore.pollStore
export const useResourceStore = () => rootStore.resourceStore
export const useHackathonStore = () => rootStore.hackathonStore
