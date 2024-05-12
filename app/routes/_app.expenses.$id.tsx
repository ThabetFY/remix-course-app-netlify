import { Params, redirect, useNavigate } from "@remix-run/react";
import Modal from "~/components/util/Modal";
import ExpenseForm, { ExpenseFormProps } from "~/components/ExpenseForm";
import { deleteExpense, updateExpense } from "~/data/expenses.server";
import { validateExpenseInput } from "~/data/validation.server";
// import { getExpense } from "~/data/expenses.server";

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

// export function loader({ params }: { params: Params }) {
//   const expenseId = params.id;
//   return getExpense(expenseId);
// }

export async function action({
  params,
  request,
}: {
  params: Params;
  request: Request;
}) {
  const expenseId = params.id;
  const formData = await request.formData();
  const expenseData = Object.fromEntries(formData) as ExpenseFormProps;

  if (request.method === "PATCH") {
    try {
      validateExpenseInput(expenseData);
    } catch (error) {
      return error;
    }

    await updateExpense(expenseId, expenseData);
    return redirect("/expenses");
  }

  if (request.method === "DELETE") {
    await deleteExpense(expenseId);
    return redirect("/expenses");
  }
}
