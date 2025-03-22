import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { ReactNode } from "react";
import { CreateBoardButton } from "~/components/boards/CreateBoardButton";
import { Toaster } from "~/components/ui/sonner";
import { fetchSessionUser } from "~/lib/services/auth";
import appCss from "../index.css?url";

export const Route = createRootRoute({
  notFoundComponent: () => <div>Not Found</div>,
  beforeLoad: async () => {
    // get the user from the session and add to context
    const user = await fetchSessionUser();

    console.log("root- beforeLoas - user", user);
    return {
      user,
    };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Chello",
      },
      {
        name: "description",
        content: "Chello is a simple and easy-to-use board app.",
      },
      {
        name: "og:image",
        content: "/chello.svg",
      },
      {
        name: "og:title",
        content: "Chello",
      },
      {
        name: "og:description",
        content: "Chello is a simple and easy-to-use board app.",
      },
      {
        name: "og:image",
        content: "/chello.svg",
      },
      {
        name: "og:image:width",
        content: "512",
      },
      {
        name: "og:image:height",
        content: "512",
      },

    ],
    links: [
      { rel: "stylesheet", href: appCss }, { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <>
          <div className="p-2 flex gap-3 items-center">
            <Link to="/" className="[&.active]:font-bold ">
              <img src="/chello.svg" alt="Chello" title="Chello" className="w-6 h-6" />
            </Link>
            <Link to="/about" className="[&.active]:font-bold">
              About
            </Link>
            <Link to="/boards" className="[&.active]:font-bold">
              Boards
            </Link>
            <>
              <Link to="/auth/login" className="[&.active]:font-bold">
                Login
              </Link>
              <Link to="/auth/signup" className="[&.active]:font-bold">
                Signup
              </Link>
            </>

            <Link to="/auth/logout" className="[&.active]:font-bold">
              Logout
            </Link>
            <div className="ml-auto">
              <CreateBoardButton />
            </div>
          </div>
          <hr />
        </>
        {children}
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}
