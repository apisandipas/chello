import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "~/lib/utils/use-app-session";
import { createFileRoute, redirect } from "@tanstack/react-router";

const logoutFn = createServerFn().handler(async () => {
  const session = await useAppSession();
  session.clear();
  throw redirect({
    href: '/auth/login',
  });
});

export const Route = createFileRoute('/auth/logout')({
  preload: false,
  loader: () => logoutFn(),

});

