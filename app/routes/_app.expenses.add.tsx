import { redirect, useNavigate } from "@remix-run/react";
import Modal from "~/components/util/Modal";
import ExpenseForm, { ExpenseFormProps } from "~/components/ExpenseForm";
import { addExpense } from "~/data/expenses.server";
import { validateExpenseInput } from "~/data/validation.server";
import { requireUserSession } from "~/data/auth.server";

export default function Index() {
  const navigate = useNavigate();
  function closeHandler() {
    navigate("..");
  }

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  );
}

export async function action({ request }: { request: Request }) {
  const userId = await requireUserSession(request);

  const formData = await request.formData();
  const expenseData = Object.fromEntries(formData) as ExpenseFormProps;

  try {
    validateExpenseInput(expenseData);
  } catch (error) {
    return error;
  }

  await addExpense(expenseData, userId);
  return redirect("/expenses");
}
