import ExpenseListItem from "./ExpenseListItem";
import { ExpenseProps } from "./route";

function ExpensesList({ expenses }: { expenses: ExpenseProps[] }) {
  return (
    <ol id="expenses-list">
      {expenses.map((expense) => (
        <li key={expense.id}>
          <ExpenseListItem
            id={expense.id}
            title={expense.title}
            amount={Number(expense.amount)}
          />
        </li>
      ))}
    </ol>
  );
}

export default ExpensesList;
