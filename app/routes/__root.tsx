import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import { ReactNode } from "react";
import { CreateBoardButton } from "~/components/boards/CreateBoardButton";
import { Toaster } from "~/components/ui/sonner";
import { fetchSessionUser } from "~/lib/services/auth";
import appCss from "../styles/index.css?url";
import { GlobalHeader } from "~/components/common/GlobalHeader";

export const Route = createRootRoute({
  notFoundComponent: () => <div>Not Found</div>,
  beforeLoad: async () => {
    const user = await fetchSessionUser();
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
  const ctx = Route.useRouteContext();
  const router = useRouter();
  const isAuthenticated = !!ctx.user;
  const isDashboardRoute = router.state.location.pathname.startsWith('/admin');

  console.log('isDashboardRoute', isDashboardRoute);
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {!isDashboardRoute && <GlobalHeader isAuthenticated={isAuthenticated} ctx={ctx ?? { user: null }} />}
        {children}
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}
