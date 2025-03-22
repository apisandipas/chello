import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { Toaster } from "~/components/ui/sonner";
import { ReactNode } from "react";
import appCss from "../index.css?url";
import { CreateBoardButton } from "~/components/boards/CreateBoardButton";

export const Route = createRootRoute({
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
        content: "/chell.svg",
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
        content: "/chell.svg",
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
      { rel: "stylesheet", href: appCss },
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
  const isAuthRoute = router.state.location.pathname.startsWith('/auth');

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {!isAuthRoute && (
          <>
            <div className="p-2 flex gap-3 items-center">
              <Link to="/" className="[&.active]:font-bold ">
                <img src="/chell.svg" alt="Chello" className="w-6 h-6" />
              </Link>
              <Link to="/about" className="[&.active]:font-bold">
                About
              </Link>
              <Link to="/boards" className="[&.active]:font-bold">
                Boards
              </Link>
              <Link to="/auth/login" className="[&.active]:font-bold">
                Login
              </Link>
              <Link to="/auth/signup" className="[&.active]:font-bold">
                Signup
              </Link>
              <div className="ml-auto">
                <CreateBoardButton />
              </div>
            </div>
            <hr />
          </>
        )}
        {children}
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}
