import { json } from "@remix-run/node";
import { prisma } from "./prisma.server";
import { ExpenseFormProps } from "~/components/ExpenseForm";

export async function addExpense(
  expenseData: ExpenseFormProps,
  userId: string | undefined
) {
  try {
    return await prisma.expense.create({
      data: {
        title: expenseData.title,
        amount: +expenseData.amount,
        date: new Date(expenseData.date),
        User: { connect: { id: userId } },
      },
    });
  } catch (error) {
    throw new Error("Error adding expense");
  }
}

export async function getExpenses(userId: string | undefined) {
  if (!userId) {
    throw json({ message: "User not found" }, { status: 404 });
  }
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    return expenses;
  } catch (error) {
    throw new Error("Error getting expenses");
  }
}

// export async function getExpense(expenseId: string | undefined) {
//   try {
//     const expense = await prisma.expense.findUnique({
//       where: { id: expenseId },
//     });
//     return expense;
//   } catch (error) {
//     throw new Error("Error getting expense");
//   }
// }

export async function updateExpense(
  expenseId: string | undefined,
  expenseData: ExpenseFormProps
) {
  try {
    return await prisma.expense.update({
      where: { id: expenseId },
      data: {
        title: expenseData.title,
        amount: +expenseData.amount,
        date: new Date(expenseData.date),
      },
    });
  } catch (error) {
    throw new Error("Error updating expense");
  }
}

export async function deleteExpense(expenseId: string | undefined) {
  try {
    return await prisma.expense.delete({
      where: { id: expenseId },
    });
  } catch (error) {
    throw new Error("Error deleting expense");
  }
}
