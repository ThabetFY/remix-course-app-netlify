import { json } from "@remix-run/node";
import { destroyUserSession } from "~/data/auth.server";

export function action({ request }: { request: Request }) {
  if (request.method !== "DELETE") {
    return json(null, { status: 405, statusText: "Method Not Allowed" });
  }

  return destroyUserSession(request);
}
