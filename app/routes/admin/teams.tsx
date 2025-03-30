import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { Input } from '~/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Search, ChevronDown, ChevronUp, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, Users, Shield } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/modal'

// Mock data - replace with actual API call
const mockTeams = [
  {
    id: '1',
    name: 'Engineering',
    userCount: 12,
    adminCount: 3,
    admins: [
      { email: 'john@example.com', role: 'Admin' },
      { email: 'lisa@example.com', role: 'Admin' },
      { email: 'david@example.com', role: 'Admin' },
    ],
  },
  {
    id: '2',
    name: 'Marketing',
    userCount: 8,
    adminCount: 2,
    admins: [
      { email: 'sarah@example.com', role: 'Admin' },
      { email: 'mike@example.com', role: 'Admin' },
    ],
  },
  {
    id: '3',
    name: 'Sales',
    userCount: 15,
    adminCount: 2,
    admins: [
      { email: 'alex@example.com', role: 'Admin' },
      { email: 'emma@example.com', role: 'Admin' },
    ],
  },
]

// Add this mock data for candidate admins
const mockCandidateAdmins = [
  { id: '1', email: 'john@example.com', name: 'John Doe' },
  { id: '2', email: 'sarah@example.com', name: 'Sarah Smith' },
  { id: '3', email: 'mike@example.com', name: 'Mike Johnson' },
  { id: '4', email: 'lisa@example.com', name: 'Lisa Anderson' },
  { id: '5', email: 'david@example.com', name: 'David Wilson' },
]

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

export const Route = createFileRoute('/admin/teams')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page) || 1,
      pageSize: Number(search.pageSize) || 10,
    }
  },
})

function RouteComponent() {
  const { page = 1, pageSize = 10 } = useSearch({ from: '/admin/teams' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<typeof mockTeams[0] | null>(null)
  const [viewingTeam, setViewingTeam] = useState<typeof mockTeams[0] | null>(null)
  const [adminSearchQuery, setAdminSearchQuery] = useState('')
  const [selectedAdmin, setSelectedAdmin] = useState<string>('')

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const filteredTeams = mockTeams
    .filter((team) => {
      return team.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => {
      if (!sortConfig) return 0
      const aValue = a[sortConfig.key as keyof typeof a]
      const bValue = b[sortConfig.key as keyof typeof b]
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue < bValue ? 1 : -1
    })

  const totalPages = Math.ceil(filteredTeams.length / pageSize)
  const paginatedTeams = filteredTeams.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages))
    window.history.pushState(
      {},
      '',
      `/admin/teams?page=${validPage}&pageSize=${pageSize}`
    )
  }

  const handlePageSizeChange = (newSize: number) => {
    window.history.pushState(
      {},
      '',
      `/admin/teams?page=1&pageSize=${newSize}`
    )
  }

  // Add this function to filter admins based on search
  const filteredAdmins = mockCandidateAdmins.filter(admin =>
    admin.email.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    admin.name.toLowerCase().includes(adminSearchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your teams and their members.
          </p>
        </div>
        <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team</DialogTitle>
              <DialogDescription>
                Create a new team and assign an administrator.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Team Name
                </label>
                <Input id="name" placeholder="Enter team name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="admin" className="text-sm font-medium">
                  Team Administrator
                </label>
                <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an administrator" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search admins..."
                        value={adminSearchQuery}
                        onChange={(e) => setAdminSearchQuery(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {filteredAdmins.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id}>
                        <div className="flex flex-col items-start">
                          <span>{admin.name}</span>
                          <span className="text-xs text-gray-500">{admin.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddTeamOpen(false)
                setSelectedAdmin('')
                setAdminSearchQuery('')
              }}>
                Cancel
              </Button>
              <Button>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-gray-50 hover:bg-gray-100 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {Math.min((page - 1) * pageSize + 1, filteredTeams.length)}-{Math.min(page * pageSize, filteredTeams.length)} of {filteredTeams.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Team Name
                  {sortConfig?.key === 'name' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('userCount')}
              >
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 mr-1" />
                  Users
                  {sortConfig?.key === 'userCount' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('adminCount')}
              >
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 mr-1" />
                  Admins
                  {sortConfig?.key === 'adminCount' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTeams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.userCount}</TableCell>
                <TableCell>{team.adminCount}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingTeam(team)}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTeam(team)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingTeam} onOpenChange={() => setEditingTeam(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update team details below.
            </DialogDescription>
          </DialogHeader>
          {editingTeam && (
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Team Name
                </label>
                <Input
                  id="edit-name"
                  defaultValue={editingTeam.name}
                />
              </div>
            </form>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTeam(null)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingTeam} onOpenChange={() => setViewingTeam(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewingTeam?.name} Details</DialogTitle>
            <DialogDescription>
              View team information and administrators.
            </DialogDescription>
          </DialogHeader>
          {viewingTeam && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-lg font-semibold">{viewingTeam.userCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Administrators</p>
                  <p className="text-lg font-semibold">{viewingTeam.adminCount}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Admin List</p>
                <div className="space-y-2">
                  {viewingTeam.admins.map((admin, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                    >
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{admin.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingTeam(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
