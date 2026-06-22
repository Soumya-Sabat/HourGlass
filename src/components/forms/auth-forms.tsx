"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
// import { signIn, useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Loader2,
  Mail,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { FieldLabel, Message } from "@/components/forms/auth-form-fields";
import type { FormState } from "@/components/forms/auth-form.types";
import { buildRegisterPayload, postJson } from "@/components/forms/auth-form-utils";
import {
  RegisterSectionContent,
  registerSections,
} from "@/components/forms/auth-register-sections";

const OTP_LENGTH = 6;
const OTP_CHARACTER_FILTER = /[^A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/g;

function normalizeOtpInput(value: string) {
  return value.replace(OTP_CHARACTER_FILTER, "").slice(0, OTP_LENGTH);
}

function OtpBoxInput({
  value,
  onChange,
  onComplete,
  disabled,
  ariaLabel,
  compactMobile = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  ariaLabel: string;
  compactMobile?: boolean;
}) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const characters = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? "");

  function focusInput(index: number) {
    inputRefs.current[Math.max(0, Math.min(OTP_LENGTH - 1, index))]?.focus();
  }

  function commitValue(nextValue: string) {
    const normalizedValue = normalizeOtpInput(nextValue);
    onChange(normalizedValue);

    if (normalizedValue.length === OTP_LENGTH && normalizedValue !== value) {
      onComplete?.(normalizedValue);
    }
  }

  function replaceFromIndex(index: number, input: string) {
    const normalizedInput = normalizeOtpInput(input);
    const nextCharacters = characters.slice();

    if (!normalizedInput) {
      nextCharacters[index] = "";
      commitValue(nextCharacters.join(""));
      return;
    }

    normalizedInput.split("").forEach((character, offset) => {
      if (index + offset < OTP_LENGTH) {
        nextCharacters[index + offset] = character;
      }
    });

    const nextValue = nextCharacters.join("");
    commitValue(nextValue);
    focusInput(Math.min(index + normalizedInput.length, OTP_LENGTH - 1));
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    replaceFromIndex(index, event.target.value);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !characters[index] && index > 0) {
      event.preventDefault();
      const nextCharacters = characters.slice();
      nextCharacters[index - 1] = "";
      commitValue(nextCharacters.join(""));
      focusInput(index - 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    replaceFromIndex(index, event.clipboardData.getData("text"));
  }

  return (
    <div className={`grid grid-cols-6 ${compactMobile ? "gap-1.5 sm:gap-3" : "gap-2 sm:gap-3"}`} role="group" aria-label={ariaLabel}>
      {characters.map((character, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          required
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoCapitalize="none"
          maxLength={OTP_LENGTH}
          spellCheck={false}
          disabled={disabled}
          value={character}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onFocus={(event) => event.target.select()}
          aria-label={`${ariaLabel} character ${index + 1}`}
          className={`${compactMobile ? "h-10 text-sm sm:h-14 sm:text-lg" : "h-12 text-base sm:h-14 sm:text-lg"} min-w-0 rounded-lg border border-slate-200 bg-white text-center font-black text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70`}
        />
      ))}
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [state, setState] = useState<FormState>({});
  const [loading, setLoading] = useState(false);
  const verifyingOtpRef = useRef(false);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldownSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1_000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  function startOtpCooldown() {
    setCooldownSeconds(30);
  }

  async function handleRequestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setUnverifiedEmail("");
    setState({});

    try {
      const endpoint = otpSent ? "/api/auth/resend-otp" : "/api/auth/login";
      const payload = otpSent ? { email, purpose: "login" } : { email };
      const result = await postJson<{ message: string }>(endpoint, payload);
      if ("institutionId" in result && typeof result.institutionId === "string") {
        setInstitutionId(result.institutionId);
      }

      setOtpSent(true);
      startOtpCooldown();
      setState({
        success: otpSent ? result.message : "OTP sent. Check your email and enter the code below.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send OTP.";

      if (message.toLowerCase().includes("verify your email")) {
        setUnverifiedEmail(email);
      }

      setState({ error: message });
    } finally {
      setLoading(false);
    }
  }

  async function verifyLoginOtp(code: string) {
    const normalizedOtp = normalizeOtpInput(code);

    if (!email || normalizedOtp.length !== OTP_LENGTH || verifyingOtpRef.current) {
      return;
    }

    verifyingOtpRef.current = true;
    setLoading(true);
    setState({});

    try {
      const result = await postJson<{ message: string; redirectTo?: string }>("/api/auth/verify-login", {
        email,
        otp: normalizedOtp,
      });

      // Session-based auth scaffold for later DB/session wiring:
      // const result = await signIn("credentials", {
      //   email,
      //   otp: normalizedOtp,
      //   redirect: false,
      // });
      // if (result?.error) {
      //   setState({ error: "Invalid or expired OTP. Request a fresh code and try again." });
      //   return;
      // }

      router.push(result.redirectTo ?? "/dashboard");
      router.refresh();
    } catch {
      setState({ error: "Invalid or expired OTP. Request a fresh code and try again." });
    } finally {
      verifyingOtpRef.current = false;
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await verifyLoginOtp(otp);
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <form onSubmit={handleRequestOtp} className="space-y-4">
        <div className="space-y-2">
          <FieldLabel>Email</FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@institution.ac.in"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10 sm:h-12"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email || (otpSent && cooldownSeconds > 0)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-400 px-5 text-sm font-black text-black shadow-lg shadow-blue-900/10 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:h-12"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : otpSent && cooldownSeconds > 0 ? (
            <Clock3 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {otpSent
            ? cooldownSeconds > 0
              ? `Resend OTP in ${cooldownSeconds}s`
              : "Resend OTP"
            : "Send OTP"}
        </button>
      </form>

      {institutionId && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-black text-blue-800">
          Institution ID: <span className="tracking-[0.2em]">{institutionId}</span>
        </div>
      )}

      {otpSent && (
        <form onSubmit={handleVerifyOtp} className="space-y-4 border-t border-slate-200 pt-4 sm:space-y-5 sm:pt-5">
          <div className="space-y-2">
            <FieldLabel>Verification Code</FieldLabel>
            <OtpBoxInput
              value={otp}
              onChange={setOtp}
              onComplete={verifyLoginOtp}
              disabled={loading}
              ariaLabel="Login OTP"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== OTP_LENGTH}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-black text-white shadow-lg shadow-orange-700/10 transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Verify and Login
          </button>
        </form>
      )}

      <Message state={state} />

      {unverifiedEmail && (
        <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          <p>This account is created but not verified yet.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-amber-500 px-4 text-xs font-black uppercase text-white transition hover:bg-amber-600"
            >
              Continue verification
            </Link>
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setState({});

                try {
                  const result = await postJson<{ message: string }>("/api/auth/resend-otp", {
                    email: unverifiedEmail,
                    purpose: "email-verification",
                  });

                  setState({ success: `${result.message} Enter the code on the verification page.` });
                } catch (error) {
                  setState({
                    error: error instanceof Error ? error.message : "Unable to resend verification OTP.",
                  });
                } finally {
                  setLoading(false);
                }
              }}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-amber-200 bg-white px-4 text-xs font-black uppercase text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Resend OTP
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center text-sm font-bold text-slate-500">
        <Link href="/register" className="text-brand-blue hover:text-brand-dark">
          Create account
        </Link>
      </div>
    </div>
  );
}

type RegisterFormProps = {
  currentStep: number;
  onStepChange: (step: number) => void;
};

export function RegisterForm({ currentStep, onStepChange }: RegisterFormProps) {
  const router = useRouter();
  // const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const sectionScrollerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<FormState>({});
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<"institution" | "user">("user");
  const [institutionFound, setInstitutionFound] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const activeSections = registerSections;
  const currentSection = activeSections[Math.min(currentStep, activeSections.length - 1)];
  const isLastStep = currentStep === activeSections.length - 1;
  // const isSessionRegistration = session?.user && !session.user.role;

  // useEffect(() => {
  //   const form = formRef.current;
    // const user = session?.user;

    // if (!form || !user || user.role) {
    //   return;
    // }

  //   function setValue(name: string, value?: string | null) {
  //     const control = form?.elements.namedItem(name);

  //     if (!(control instanceof HTMLInputElement) || control.value || !value) {
  //       return;
  //     }

  //     control.value = value;
  //   }

  //   setValue("fullName", user.name);
  //   setValue("email", user.email);
  //   setValue("phoneNumber", user.phoneNumber);
  //   setValue("address.country", user.address?.country);
  //   setValue("address.state", user.address?.state);
  //   setValue("address.city", user.address?.city);
  //   setValue("address.postalCode", user.address?.postalCode);
  //   setValue("address.line", user.address?.line);
  // }, [session]);

  useEffect(() => {
    sectionScrollerRef.current?.scrollTo({ top: 0, left: 0 });
  }, [currentStep]);

  function handleAccountTypeChange(nextAccountType: "institution" | "user") {
    setAccountType(nextAccountType);
    onStepChange(0);
    setState({});
    setInstitutionFound(false);
    setSelectedRole("");
  }

  function getSectionControls(sectionId: string) {
    const form = formRef.current;

    if (!form) {
      return [];
    }

    return Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        `[data-register-section="${sectionId}"] input, [data-register-section="${sectionId}"] select, [data-register-section="${sectionId}"] textarea`,
      ),
    );
  }

  function validateSection(sectionId: string, report = true) {
    const invalidControl = getSectionControls(sectionId).find((control) => !control.checkValidity());

    if (!invalidControl) {
      return true;
    }

    if (report) {
      invalidControl.reportValidity();
    }

    return false;
  }

  function validateCurrentStep() {
    return validateSection(currentSection.id);
  }

  function validateAllSteps() {
    const invalidStep = activeSections.findIndex((section) => !validateSection(section.id, false));

    if (invalidStep === -1) {
      return true;
    }

    onStepChange(invalidStep);
    window.setTimeout(() => validateSection(activeSections[invalidStep].id), 120);

    return false;
  }

  async function verifyInstitutionId() {
    const form = formRef.current;
    const control = form?.elements.namedItem("institutionId");

    if (!(control instanceof HTMLInputElement)) {
      return true;
    }

    const nextInstitutionId = control.value.trim().toUpperCase();

    if (!control.checkValidity()) {
      control.reportValidity();
      return false;
    }

    setLoading(true);
    setState({});

    try {
      await postJson<{ institutionId: string }>("/api/auth/institutions/lookup", {
        institutionId: nextInstitutionId,
      });
      control.value = nextInstitutionId;
      setInstitutionFound(true);
      setState({ success: "Institution found. Continue with role and personal details." });
      return true;
    } catch (error) {
      setInstitutionFound(false);
      setState({ error: error instanceof Error ? error.message : "Institution ID was not found." });
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleNext() {
    if (!validateCurrentStep()) {
      return;
    }

    if (accountType === "user" && currentSection.id === "institution" && !(await verifyInstitutionId())) {
      return;
    }

    onStepChange(Math.min(activeSections.length - 1, currentStep + 1));
  }

  function handleBack() {
    onStepChange(Math.max(0, currentStep - 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLastStep) {
      await handleNext();
      return;
    }

    if (!validateAllSteps()) {
      return;
    }

    setLoading(true);
    setState({});

    const form = new FormData(event.currentTarget);
    const { email, payload } = buildRegisterPayload(form);

    try {
      const result = await postJson<{
        message: string;
        emailSent: boolean;
        verificationRequired?: boolean;
        signInProvider?: string;
        accountType?: "institution" | "user";
      }>(
        "/api/auth/register",
        payload,
      );
      setState({ success: result.message });

      if (result.emailSent || result.verificationRequired) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}&type=${accountType}`);
      } else {
        event.currentTarget.reset();
          onStepChange(0);
          setAccountType("user");
          setInstitutionFound(false);
          setSelectedRole("");
      }
    } catch (error) {
      setState({ error: error instanceof Error ? error.message : "Registration failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative z-10 flex min-w-0 flex-col overflow-visible rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:max-h-[calc(100dvh-11rem)] lg:min-h-0 lg:overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-4 sm:p-6 lg:p-7">
        <div className="mb-5 flex shrink-0 flex-col gap-5 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2 min-w-0">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 break-words">Join with Us</h3>
            {/* <p className="max-w-2xl text-sm font-medium leading-6 text-slate-500 break-words">{currentSection.description}</p> */}
          </div>
        </div>

        <div ref={sectionScrollerRef} className="min-w-0 touch-pan-y overflow-visible pr-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain no-scrollbar">
          <div
            className="flex min-w-0 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentStep * 100}%)` }}
          >
            {activeSections.map((section, index) => (
              <section
                key={section.id}
                data-register-section={section.id}
                aria-hidden={index !== currentStep}
                className={`min-w-0 basis-full shrink-0 ${
                  index === currentStep ? "h-auto overflow-visible py-1" : "h-0 overflow-hidden py-0"
                }`}
              >
                <RegisterSectionContent
                  sectionId={section.id}
                  accountType={accountType}
                  institutionFound={institutionFound}
                  selectedRole={selectedRole}
                  onAccountTypeChange={handleAccountTypeChange}
                  onRoleChange={setSelectedRole}
                />
              </section>
            ))}
          </div>
        </div>

        <div className="shrink-0">
          <Message state={state} />
        </div>

        <div className="mt-5 flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={currentStep === 0 || loading}
            onClick={handleBack}
            className="inline-flex h-9 w-full touch-manipulation items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {isLastStep ? (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-lg bg-brand-orange px-5 text-sm font-black text-slate-600 shadow-lg shadow-orange-700/10 transition hover:bg-brand-orange/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Create Your Account
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
            onClick={handleNext}
              className="inline-flex h-9 w-full touch-manipulation items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-black text-white shadow-lg shadow-orange-700/10 transition hover:bg-brand-orange disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p className="border border-slate-100 px-5 py-4 text-center text-sm font-bold text-slate-500">
        Already registered?{" "}
        <Link href="/login" className="text-brand-blue hover:text-brand-dark">
          Sign In
        </Link>
      </p>
    </form>
  );
}

function VerifyEmailFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [verifiedInstitutionId, setVerifiedInstitutionId] = useState("");
  const [otp, setOtp] = useState("");
  const [state, setState] = useState<FormState>({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const verifyingOtpRef = useRef(false);

  async function verifyEmailOtp(code: string) {
    const normalizedOtp = normalizeOtpInput(code);

    if (!email || normalizedOtp.length !== OTP_LENGTH || verifyingOtpRef.current) {
      return;
    }

    verifyingOtpRef.current = true;
    setLoading(true);
    setState({});

    try {
      const result = await postJson<{ message: string; institutionId?: string }>("/api/auth/verify-email", {
        email,
        otp: normalizedOtp,
      });
      if (result.institutionId) {
        setVerifiedInstitutionId(result.institutionId);
        setState({ success: result.message });
      } else {
        setState({ success: `${result.message} Redirecting to login...` });
        setTimeout(() => router.push(`/login?email=${encodeURIComponent(email)}`), 900);
      }
    } catch (error) {
      setState({ error: error instanceof Error ? error.message : "Email verification failed." });
    } finally {
      verifyingOtpRef.current = false;
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await verifyEmailOtp(otp);
  }

  async function handleResend() {
    setResending(true);
    setState({});

    try {
      const result = await postJson<{ message: string }>("/api/auth/resend-otp", { email });
      setState({ success: result.message });
    } catch (error) {
      setState({ error: error instanceof Error ? error.message : "Unable to resend OTP." });
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <FieldLabel>Email</FieldLabel>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            required
            disabled
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your Email ID"
            className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel>Email Verification OTP</FieldLabel>
        <OtpBoxInput
          value={otp}
          onChange={setOtp}
          onComplete={verifyEmailOtp}
          disabled={loading}
          ariaLabel="Email verification OTP"
          compactMobile
        />
      </div>

      <Message state={state} />

      {verifiedInstitutionId && (
        <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-xs font-black uppercase text-emerald-700">Institution ID</p>
          <p className="text-3xl font-black tracking-[0.24em] text-emerald-900">{verifiedInstitutionId}</p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`HourGlass institution ID: ${verifiedInstitutionId}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            Share on WhatsApp
          </a>
          <Link
            href={`/login?email=${encodeURIComponent(email)}`}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-emerald-200 bg-white px-5 text-sm font-black text-emerald-800 transition hover:bg-emerald-100"
          >
            Continue to login
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !email || otp.length !== 6}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-black text-white shadow-lg shadow-orange-700/10 transition hover:bg-brand-orange/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        Verify Email
      </button>

      <button
        type="button"
        disabled={resending || !email}
        onClick={handleResend}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        Resend Verification Email
      </button>

      <p className="text-center text-sm font-bold text-slate-500">
        Already verified?{" "}
        <Link href="/login" className="text-brand-blue hover:text-brand-dark">
          Login with OTP
        </Link>
      </p>
    </form>
  );
}

export function VerifyEmailForm() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailFormContent />
    </Suspense>
  );
}
