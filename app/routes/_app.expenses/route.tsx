import { Link, Outlet, useLoaderData } from "@remix-run/react";
import ExpensesList from "./ExpensesList";
import { FaDownload, FaPlus } from "react-icons/fa";
import { getExpenses } from "~/data/expenses.server";
import { requireUserSession } from "~/data/auth.server";

export type ExpenseProps = {
  id: string;
  title: string;
  amount: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export default function ExpensesLayout() {
  const expenses = useLoaderData() as ExpenseProps[];

  const hasExpenses = expenses && expenses.length > 0;

  return (
    <>
      <Outlet />
      <section id="expenses-actions">
        <Link to="add">
          <FaPlus />
          <span>Add Expense</span>
        </Link>
        <a href="/expenses/raw">
          <FaDownload />
          <span>Load Raw Data</span>
        </a>
      </section>
      <main>
        {expenses && <ExpensesList expenses={expenses} />}
        {!hasExpenses && (
          <section id="no-expenses">
            <h1>No expense found</h1>
            <p>
              start <Link to="add">adding expenses</Link> to see them here
            </p>
          </section>
        )}
      </main>
    </>
  );
}

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserSession(request);

  return getExpenses(userId);
}
