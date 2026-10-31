import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, Field, submitClass } from "@/components/auth-shell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Kindle event planner" },
      {
        name: "description",
        content: "Log in to Kindle to see your event budget, timeline and vendor checklist.",
      },
      { property: "og:title", content: "Log in — Kindle event planner" },
      {
        property: "og:description",
        content: "Pick up your wedding, birthday or community event plan where you left it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  return (
    <AuthShell
      title="Welcome back"
      sub="Log in to pick up your plan."
      footer={
        <>
          New to Kindle?{" "}
          <Link to="/register" className="font-medium text-foreground underline">
            Create an account
          </Link>
        </>
      }
    >
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/dashboard" });
        }}
      >
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
        <Field
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
        <div className="flex justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-primary" />
            Remember me
          </label>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Forgot password?
          </a>
        </div>
        <button className={submitClass}>Log in</button>
      </form>
    </AuthShell>
  );
}
