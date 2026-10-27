"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { forgotPassword, login, loginTwoFactor, restoreSession } from "@/lib/api/auth";
import { ADMIN_EMAIL } from "./nav";
import { IconArrowLeft, IconArrowRight, IconEye, IconEyeOff } from "./icons";
import LoadingWorkspace from "./LoadingWorkspace";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotBusy, setForgotBusy] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [codeErr, setCodeErr] = useState<string | undefined>();
  const [verifying, setVerifying] = useState(false);

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
      const res = await login(email.trim(), password);
      if (res.twoFactorRequired) {
        setTempToken(res.tempToken);
        setBusy(false);
        return;
      }
      setSignedIn(true);
    } catch (err) {
      setBusy(false);
      setErrors({ form: err instanceof Error ? err.message : "Sign in failed." });
    }
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (!tempToken) return;
    setCodeErr(undefined);
    setVerifying(true);
    try {
      await loginTwoFactor(tempToken, code.trim());
      router.replace("/admin");
    } catch (err) {
      setVerifying(false);
      setCodeErr(err instanceof Error ? err.message : "Incorrect code.");
    }
  }

  async function submitForgot() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors({ email: "Enter your account email above first." });
      document.getElementById("adm-email")?.focus();
      return;
    }
    setForgotBusy(true);
    try {
      await forgotPassword(email.trim());
      setForgotSent(true);
    } finally {
      setForgotBusy(false);
    }
  }

  if (tempToken)
    return (
      <div className="adm-login">
        <div className="adm-login-card adm-fadein">
          <img src="/images/techclues-logo.png" alt="TechClues" width={302} height={125} />
          <h1>Two-factor verification</h1>
          <form className="adm-form" onSubmit={submitCode} noValidate>
            <div className="adm-field">
              <label htmlFor="adm-2fa-code">Enter the 6-digit code from your authenticator app</label>
              <input
                id="adm-2fa-code"
                className="adm-input"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-invalid={!!codeErr}
              />
              {codeErr && <p className="adm-err">{codeErr}</p>}
              <p className="adm-note">You can also use one of your recovery codes.</p>
            </div>
            <button type="submit" className="adm-btn" disabled={verifying || code.trim().length < 6}>
              {verifying ? "Verifying…" : "Verify"} <IconArrowRight />
            </button>
          </form>
          <p className="adm-login-foot">
            <button type="button" className="adm-text-btn" onClick={() => setTempToken(null)}>
              <IconArrowLeft /> Back
            </button>
          </p>
        </div>
      </div>
    );

  if (signedIn)
    return (
      <LoadingWorkspace
        run={() => Promise.resolve()}
        onDone={() => router.replace("/admin")}
        onError={(message) => {
          setSignedIn(false);
          setBusy(false);
          setErrors({ form: message });
        }}
      />
    );

  return (
    <div className="adm-login">
      <div className="adm-login-card adm-fadein">
        <img src="/images/techclues-logo.png" alt="TechClues" width={302} height={125} />
        <h1>Admin sign in</h1>
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
            <button
              type="button"
              className="adm-text-btn"
              onClick={() => {
                setForgot((f) => !f);
                setForgotSent(false);
              }}
              aria-expanded={forgot}
            >
              Forgot password?
            </button>
          </div>
          {forgot && (
            <p className="adm-note" role="status">
              {forgotSent ? (
                "If that email matches an admin account, a reset link is on its way — it expires in an hour."
              ) : (
                <>
                  We&apos;ll email a reset link to the address above.{" "}
                  <button type="button" className="adm-text-btn" onClick={submitForgot} disabled={forgotBusy}>
                    {forgotBusy ? "Sending…" : "Send reset link"}
                  </button>
                </>
              )}
            </p>
          )}
          {errors.form && (
            <p className="adm-err" role="alert">
              {errors.form}
            </p>
          )}
          <button type="submit" className="adm-btn">
            Sign in <IconArrowRight />
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
