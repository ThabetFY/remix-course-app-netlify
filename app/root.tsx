import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import ErrorComponent from "./components/util/Error";

export const meta: MetaFunction = ({ error }) => {
  const errorTitle = isRouteErrorResponse(error)
    ? error.statusText
    : "An error occurred";

  return [
    { title: error ? errorTitle : "Very cool app | Remix" },
    {
      property: "og:title",
      content: "Very cool app",
    },
    {
      name: "description",
      content: "This app is the best",
    },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const isInstanceofError = error instanceof Error;

  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <ErrorComponent title={error.statusText}>
          <p>
            {error.data?.message ||
              "Somthing went wrong. Please try again later."}
          </p>
          <p>
            Back to <Link to="/">safety</Link>.
          </p>
        </ErrorComponent>
      </main>
    );
  } else if (isInstanceofError) {
    return (
      <main>
        <ErrorComponent title="An error occurred">
          <p>
            {error.message || "Somthing went wrong. Please try again later."}
          </p>
          <p>
            Back to <Link to="/">safety</Link>.
          </p>
        </ErrorComponent>
      </main>
    );
  } else {
    return (
      <main>
        <ErrorComponent title="An error occurred">
          <p>Somthing went wrong. Please try again later.</p>
          <p>
            Back to <Link to="/">safety</Link>.
          </p>
        </ErrorComponent>
      </main>
    );
  }
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap",
  },
];
