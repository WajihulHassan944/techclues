"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { login, restoreSession } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { ADMIN_EMAIL } from "./nav";
import { IconArrowLeft, IconArrowRight, IconEye, IconEyeOff } from "./icons";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);

  // Already signed in (valid refresh cookie): go straight to the panel.
  useEffect(() => {
    restoreSession().then((ok) => {
      if (ok) router.replace("/admin");
    });
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) er.email = "Check your email address.";
    if (!password) er.password = "Enter your password.";
    setErrors(er);
    if (Object.keys(er).length) {
      document.getElementById(er.email ? "adm-email" : "adm-password")?.focus();
      return;
    }
    setBusy(true);
    try {
      await login(email.trim(), password);
      router.replace("/admin");
    } catch (err) {
      setErrors({ form: err instanceof ApiError ? err.message : "Something went wrong. Please try again." });
      setBusy(false);
    }
  }

  return (
    <div className="adm-login">
      <div className="adm-login-card adm-fadein">
        <img src="/images/techclues-logo.png" alt="TechClues" width={216} height={34} />
        <h1>Admin sign in</h1>
        <p className="adm-sub">Manage enquiries, bookings and the blog.</p>
        <form className="adm-form" onSubmit={submit} noValidate>
          <div className="adm-field">
            <label htmlFor="adm-email">Email</label>
            <input id="adm-email" className="adm-input" type="email" autoComplete="username" inputMode="email" value={email} aria-invalid={!!errors.email} aria-describedby={errors.email ? "adm-email-err" : undefined} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && (
              <p className="adm-err" id="adm-email-err">
                {errors.email}
              </p>
            )}
          </div>
          <div className="adm-field">
            <label htmlFor="adm-password">Password</label>
            <div className="adm-input-wrap">
              <input id="adm-password" className="adm-input" type={show ? "text" : "password"} autoComplete="current-password" value={password} aria-invalid={!!errors.password} aria-describedby={errors.password ? "adm-password-err" : undefined} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="adm-eye" aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} onClick={() => setShow((s) => !s)}>
                {show ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {errors.password && (
              <p className="adm-err" id="adm-password-err">
                {errors.password}
              </p>
            )}
          </div>
          <div className="adm-row">
            <label className="adm-check">
              <input type="checkbox" defaultChecked /> Keep me signed in
            </label>
            <button type="button" className="adm-text-btn" onClick={() => setForgot((f) => !f)} aria-expanded={forgot}>
              Forgot password?
            </button>
          </div>
          {forgot && (
            <p className="adm-note" role="status">
              Password reset isn&apos;t wired up yet — ask whoever deployed the API to reset it directly.
            </p>
          )}
          {errors.form && (
            <p className="adm-err" role="alert">
              {errors.form}
            </p>
          )}
          <button type="submit" className="adm-btn" disabled={busy}>
            {busy ? (
              <>
                <span className="adm-spin" aria-hidden="true" /> Signing in…
              </>
            ) : (
              <>
                Sign in <IconArrowRight />
              </>
            )}
          </button>
        </form>
        <p className="adm-login-foot">
          <Link href="/">
            <IconArrowLeft /> Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
