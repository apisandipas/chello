import { Link } from "@tanstack/react-router"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"
import { SessionUser } from "~/lib/utils/use-app-session"

export const AccountMenu = ({ user }: { user: SessionUser }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="font-bold mr-2 flex items-center gap-2">
          {user.email}
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to="/auth/logout" className='w-full'>
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}