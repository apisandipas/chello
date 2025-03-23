import { Link } from "@tanstack/react-router"
import { SessionUser } from "~/lib/utils/use-app-session"
import { CreateBoardButton } from "../boards/CreateBoardButton"
import { AccountMenu } from "./AccountMenu"

export const GlobalHeader = ({ isAuthenticated, ctx }: { isAuthenticated: boolean, ctx: { user: SessionUser | null } }) => {
  return (
    <div className="p-2 flex gap-3 items-center">
      <Link to="/" className="[&.active]:font-bold ">
        <img src="/chello.svg" alt="Chello" title="Chello" className="w-6 h-6" />
      </Link>

      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>

      {isAuthenticated && (
        <>
          <Link to="/boards" className="[&.active]:font-bold">
            Boards
          </Link>
          <CreateBoardButton />
        </>
      )}


      <div className="ml-auto flex gap-2">
        {!isAuthenticated ? (
          <div className="flex gap-2">
            <Link to="/auth/login" className="[&.active]:font-bold">
              Login
            </Link>
            <Link to="/auth/signup" className="[&.active]:font-bold">
              Signup
            </Link>
          </div>
        ) : (
          <div className="flex flex-row gap-2">
            <AccountMenu user={ctx.user as SessionUser} />
          </div>
        )}
      </div>
    </div>
  )
} 