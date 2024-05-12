import {
  Form,
  Link,
  useActionData,
  useMatches,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { ExpenseProps } from "~/routes/_app.expenses/route";

export type ExpenseFormProps = {
  title: string;
  amount: string;
  date: string;
};

function ExpenseForm() {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10
  const validationErrors: { [key: string]: string } | undefined =
    useActionData() || undefined;
  const params = useParams();
  const expenses = useMatches().find((match) => match.pathname === "/expenses")
    ?.data as ExpenseProps[];
  const expenseData = expenses.find(
    (expense: ExpenseProps) => expense.id === params.id
  );
  const navigation = useNavigation();
  const isSubmiting = navigation.state !== "idle";

  if (params.id && !expenseData) {
    return (
      <div className="form-actions">
        <p>Expense not found</p>
        <Link to="..">Back</Link>
      </div>
    );
  }

  const defaultValues = expenseData || { title: "", amount: "", date: "" };

  return (
    <Form
      method={expenseData ? "patch" : "post"}
      className="form"
      id="expense-form"
    >
      <p>
        <label htmlFor="title">Expense Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={30}
          defaultValue={defaultValues.title}
        />
      </p>

      <div className="form-row">
        <p>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            required
            defaultValue={defaultValues.amount}
          />
        </p>
        <p>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            max={today}
            required
            defaultValue={
              defaultValues.date ? defaultValues.date.slice(0, 10) : ""
            }
          />
        </p>
      </div>
      {validationErrors && (
        <ul>
          {Object.values(validationErrors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <div className="form-actions">
        <button disabled={isSubmiting}>
          {isSubmiting ? "Saving..." : "Save Expense"}
        </button>
        <Link to="..">Cancel</Link>
      </div>
    </Form>
  );
}

export default ExpenseForm;
