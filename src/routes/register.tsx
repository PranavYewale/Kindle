import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, Field, submitClass } from "@/components/auth-shell";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — Kindle event planner" },
      {
        name: "description",
        content:
          "Sign up for Kindle and get a budget, timeline, vendor checklist and ideas for your event.",
      },
      { property: "og:title", content: "Create your account — Kindle event planner" },
      {
        property: "og:description",
        content: "Plan weddings, birthdays and community events in one calm place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  return (
    <AuthShell
      title="Start planning free"
      sub="Takes under a minute."
      panelSide="right"
      slideIn
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline">
            Log in
          </Link>
        </>
      }
    >
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const name = formData.get("name") as string;
          if (typeof window !== "undefined") {
            sessionStorage.setItem("kindle_open_wizard", "true");
            if (name && name.trim()) {
              sessionStorage.setItem("kindle_registered_name", name.trim());
            }
          }
          navigate({ to: "/dashboard" });
        }}
      >
        <Field
          label="Your name"
          name="name"
          autoComplete="name"
          required
          placeholder="Priya Sharma"
        />
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
          autoComplete="new-password"
          minLength={8}
          required
        />
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" required className="mt-1 accent-primary" />I agree to the Terms and
          Privacy policy
        </label>
        <button className={submitClass}>Create account</button>
      </form>
    </AuthShell>
  );
}
