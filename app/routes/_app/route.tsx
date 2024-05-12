import { Outlet } from "@remix-run/react";
import ExpensesHeader from "./ExpensesHeader";

export default function ExpensesAppLayout() {
  return (
    <>
      <ExpensesHeader />
      <Outlet />;
    </>
  );
}
