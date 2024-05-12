import { Outlet } from "@remix-run/react";
import MainHeader from "./MainHeader";
import { getUserFromSession } from "~/data/auth.server";

export default function MarketingLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />;
    </>
  );
}

export function loader({ request }: { request: Request }) {
  return getUserFromSession(request);
}
