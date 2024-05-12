import { validateCredentials } from "~/data/validation.server";
import AuthForm, { AuthFormProps } from "./AuthForm";
import { login, signup } from "~/data/auth.server";

export default function Index() {
  return <AuthForm />;
}

export async function action({ request }: { request: Request }) {
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || "login";

  const formData = await request.formData();
  const credantials = Object.fromEntries(formData) as AuthFormProps;

  try {
    validateCredentials(credantials);
  } catch (errors) {
    return errors;
  }

  try {
    if (authMode === "login") {
      return await login(credantials);
    } else {
      return await signup(credantials);
    }
  } catch (error) {
    const typedError = error as Response;

    if (typedError.status === 401) {
      return { credantials: "Invalid email or password" };
    }
    if (typedError.status === 422) {
      return { credantials: typedError.statusText };
    }
    return { credantials: "An error occurred" };
  }
}
