"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/lib/api/auth";
import { IconArrowLeft, IconArrowRight, IconEye, IconEyeOff } from "./icons";

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [done, setDone] = useState(false);

  if (!email || !token) {
    return (
      <div className="adm-login">
        <div className="adm-login-card adm-fadein">
          <h1>Reset link invalid</h1>
          <p className="adm-note">This reset link is missing its token — copy the full link from the email, or request a new one.</p>
          <p className="adm-login-foot">
            <Link href="/admin/login">
              <IconArrowLeft /> Back to sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="adm-login">
        <div className="adm-login-card adm-fadein">
          <h1>Password updated</h1>
          <p className="adm-note">Your password has been changed and every other session has been signed out.</p>
          <button type="button" className="adm-btn" onClick={() => router.replace("/admin/login")}>
            Sign in <IconArrowRight />
          </button>
        </div>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("Those passwords don't match.");
    setError(undefined);
    setBusy(true);
    try {
      await resetPassword(email, token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reset your password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm-login">
      <div className="adm-login-card adm-fadein">
        <img src="/images/techclues-logo.png" alt="TechClues" width={302} height={125} />
        <h1>Set a new password</h1>
        <p className="adm-note">for {email}</p>
        <form className="adm-form" onSubmit={submit} noValidate>
          <div className="adm-field">
            <label htmlFor="rp-password">New password</label>
            <div className="adm-input-wrap">
              <input id="rp-password" className="adm-input" type={show ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="adm-eye" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>
                {show ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>
          <div className="adm-field">
            <label htmlFor="rp-confirm">Confirm password</label>
            <input id="rp-confirm" className="adm-input" type={show ? "text" : "password"} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {error && (
            <p className="adm-err" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="adm-btn" disabled={busy}>
            {busy ? "Saving…" : "Set password"} <IconArrowRight />
          </button>
        </form>
        <p className="adm-login-foot">
          <Link href="/admin/login">
            <IconArrowLeft /> Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
