import { getExpenses } from "~/data/expenses.server";
import Chart from "./Chart";
import ExpenseStatistics from "./ExpenseStatistics";
import { ExpenseProps } from "../_app.expenses/route";
import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import ErrorComponent from "~/components/util/Error";
import { requireUserSession } from "~/data/auth.server";

export default function Index() {
  const expenses = useLoaderData() as ExpenseProps[];

  return (
    <main>
      <Chart expenses={expenses} />
      <ExpenseStatistics expenses={expenses} />
    </main>
  );
}

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserSession(request);

  const expenses = await getExpenses(userId);
  if (!expenses || expenses.length === 0) {
    throw json(
      { message: "Could not load expenses for the requested analysis." },
      { status: 404, statusText: "Expenses not found" }
    );
  }
  return expenses;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <ErrorComponent title={error.statusText}>
          <p>{error.data?.message || "An error occurred. Please try again."}</p>
        </ErrorComponent>
      </main>
    );
  }

  return null;
}
