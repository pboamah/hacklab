"use client"

import { DropdownMenuLabel } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useGroupStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface MemberManagementProps {
  groupId: string
}

export const MemberManagement = observer(({ groupId }: MemberManagementProps) => {
  const groupStore = useGroupStore()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>("member")
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [roleToEdit, setRoleToEdit] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<
    {
      name: string
      description: string
      enabled: boolean
    }[]
  >([])

  useEffect(() => {
    groupStore.fetchGroupById(groupId)
    groupStore.fetchGroupMembers(groupId)
  }, [groupStore, groupId])

  const handleSendInvite = async () => {
    // This would connect to an API to send an invitation
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`,
    })
    setInviteEmail("")
    setInviteDialogOpen(false)
  }

  const handleRoleChange = async () => {
    if (!selectedUserId) return

    try {
      // Update the user's role in the group
      toast({
        title: "Role updated",
        description: "The user's role has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error updating role",
        description: "There was an error updating the user's role.",
        variant: "destructive",
      })
    } finally {
      setRoleDialogOpen(false)
    }
  }

  const handleRemoveMember = (memberId: string) => {
    // Remove the member from the group
    toast({
      title: "Member removed",
      description: "The team member has been removed from the team",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Manage Members</h3>
        <Button variant="outline" size="sm" onClick={() => setInviteDialogOpen(true)}>
          Invite Member
        </Button>
      </div>

      <Input placeholder="Search members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      <div className="space-y-3">
        {groupStore.getGroupMembers(groupId).map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.user?.avatar_url || "/placeholder.svg"} alt={member.user?.full_name} />
                <AvatarFallback>{member.user?.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{member.user?.full_name}</div>
                <div className="text-sm text-muted-foreground">{member.user?.email}</div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUserId(member.id)
                    setRoleToEdit(member.role)
                    setRoleDialogOpen(true)
                  }}
                >
                  Change Role
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="text-red-600">
                  Remove from Group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>Send an invitation to a user to join this group.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="Enter email address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInvite} disabled={!inviteEmail}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>Select a new role for the user.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label>New Role</Label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="member">Member</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
})
