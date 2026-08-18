"use client";

import { useRef, useState } from "react";
import { buttonClasses } from "@/app/components/ui/button-link";
import { endpoints, submitForm } from "@/app/lib/api";
import { site } from "@/app/lib/site";

/**
 * Value/label pairs mirror `MembershipApplication.Occupation` /
 * `.HeardAboutLeo` / `.Gender` / `.BloodGroup` on the Django backend exactly
 * (apps/memberships/models.py) — the `value` here is what gets POSTed.
 */
const OCCUPATIONS = [
  ["FREELANCER", "Freelancer / Self-Employed"],
  ["STUDENT_MANAGEMENT", "Student – Management / Business"],
  ["STUDENT_BSC", "Student – BSc"],
  ["STUDENT_ENGINEERING", "Student – Engineering / Technology"],
  ["STUDENT_MEDICAL", "Student – Medical / Health Sciences"],
  ["STUDENT_LAW", "Student – Law / Legal Studies"],
  ["STUDENT_SCHOOL", "Student – School (+2)"],
  ["IT_SOFTWARE", "Information Technology (IT) / Software Development"],
  ["ENGINEER", "Engineer"],
  ["HEALTHCARE", "Healthcare Professional"],
  ["TEACHER", "Teacher / Educator"],
  ["BANKING_FINANCE", "Banking / Finance / Insurance"],
  ["BUSINESS_OWNER", "Business Owner / Entrepreneur"],
  ["NGO_SOCIAL_WORK", "NGO / INGO / Social Work"],
  ["GOVERNMENT", "Government Service"],
  ["PRIVATE_SECTOR", "Private Sector Employee"],
  ["CREATIVE_ARTS", "Creative Arts / Design / Media"],
  ["HOSPITALITY_TOURISM", "Hospitality / Tourism"],
  ["OTHER", "Other"],
] as const;

const HEARD_ABOUT = [
  ["FRIEND_FAMILY", "Friend / Family"],
  ["LEO_MEMBER", "Leo Club Member"],
  ["FACEBOOK", "Facebook"],
  ["INSTAGRAM", "Instagram"],
  ["WEBSITE", "Website"],
  ["SCHOOL_COLLEGE", "School / College"],
  ["COMMUNITY_EVENT", "Community Event"],
  ["OTHER", "Other"],
] as const;

const GENDERS = [
  ["MALE", "Male"],
  ["FEMALE", "Female"],
  ["OTHER", "Other"],
] as const;

const BLOOD_GROUPS = [
  ["A_POS", "A+"],
  ["A_NEG", "A−"],
  ["B_POS", "B+"],
  ["B_NEG", "B−"],
  ["AB_POS", "AB+"],
  ["AB_NEG", "AB−"],
  ["O_POS", "O+"],
  ["O_NEG", "O−"],
  ["UNKNOWN", "Don't Know / Not Sure"],
] as const;

const STEP_META = [
  { title: "Personal Information", subtitle: "Let's start with some basic information about you.", short: "Personal" },
  { title: "Address & Contact", subtitle: "Tell us where we can reach you.", short: "Address" },
  { title: "Professional / Academic Information", subtitle: "Tell us about your current profession or field of study.", short: "Professional" },
  { title: "Personal Details", subtitle: "A few additional details for your membership profile.", short: "Details" },
  { title: "Membership Information", subtitle: "Help us understand how you discovered the Leo community.", short: "Membership" },
  { title: "Photo & Message", subtitle: "You're almost done. Add your photo and any message you'd like to share.", short: "Photo" },
] as const;

const TOTAL_STEPS = STEP_META.length;

const FIELD_STEP: Record<string, number> = {
  full_name: 1,
  email: 1,
  membership_id: 1,
  date_of_birth: 1,
  current_address: 2,
  permanent_address: 2,
  phone: 2,
  occupation_or_study: 3,
  occupation_other: 3,
  gender: 4,
  gender_other: 4,
  blood_group: 4,
  heard_about_leo: 5,
  heard_about_other: 5,
  profile_image: 6,
  message: 6,
};

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MESSAGE_MAX = 1000;

type FormValues = {
  full_name: string;
  email: string;
  membership_id: string;
  date_of_birth: string;
  current_address: string;
  permanent_address: string;
  phone: string;
  occupation_or_study: string;
  occupation_other: string;
  gender: string;
  gender_other: string;
  blood_group: string;
  heard_about_leo: string;
  heard_about_other: string;
  message: string;
  website: string;
};

const INITIAL_VALUES: FormValues = {
  full_name: "",
  email: "",
  membership_id: "",
  date_of_birth: "",
  current_address: "",
  permanent_address: "",
  phone: "",
  occupation_or_study: "",
  occupation_other: "",
  gender: "",
  gender_other: "",
  blood_group: "",
  heard_about_leo: "",
  heard_about_other: "",
  message: "",
  website: "",
};

type Status = "idle" | "submitting" | "success" | "error";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function labelFor(pairs: readonly (readonly [string, string])[], value: string) {
  return pairs.find(([v]) => v === value)?.[1] ?? "—";
}

function validateStep(step: number, v: FormValues, photo: File | null): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!v.full_name.trim() || v.full_name.trim().length < 3) {
      errors.full_name = "Please enter your full name.";
    }
    if (!v.email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!v.date_of_birth) {
      errors.date_of_birth = "Please select your date of birth.";
    } else if (v.date_of_birth > todayIso()) {
      errors.date_of_birth = "Date of birth cannot be in the future.";
    }
  }

  if (step === 2) {
    if (!v.current_address.trim()) errors.current_address = "Please enter your current address.";
    if (!v.permanent_address.trim()) errors.permanent_address = "Please enter your permanent address.";
    const digits = v.phone.replace(/\D/g, "");
    if (!digits) errors.phone = "Please enter your phone number.";
    else if (digits.length < 7) errors.phone = "Please enter a valid phone number.";
  }

  if (step === 3) {
    if (!v.occupation_or_study) errors.occupation_or_study = "Please select an option.";
    if (v.occupation_or_study === "OTHER" && !v.occupation_other.trim()) {
      errors.occupation_other = "Please specify your occupation or field of study.";
    }
  }

  if (step === 4) {
    if (!v.gender) errors.gender = "Please select a gender.";
    if (!v.blood_group) errors.blood_group = "Please select your blood group.";
  }

  if (step === 5) {
    if (!v.heard_about_leo) errors.heard_about_leo = "Please select an option.";
    if (v.heard_about_leo === "OTHER" && !v.heard_about_other.trim()) {
      errors.heard_about_other = "Please tell us how you heard about Leo.";
    }
  }

  if (step === 6) {
    if (!photo) errors.profile_image = "Please upload a passport-size photo.";
    if (v.message.length > MESSAGE_MAX) errors.message = `Please keep this under ${MESSAGE_MAX} characters.`;
  }

  return errors;
}

function FieldLabel({ htmlFor, required, children }: { htmlFor?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children} {required && <span className="text-leo-red">*</span>}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-leo-red">
      {message}
    </p>
  );
}

function fieldClass(invalid?: boolean, extra = "") {
  return `mt-1.5 w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 outline-none transition-[border-color,box-shadow] duration-[var(--duration-fast)] ${
    invalid
      ? "border-leo-red focus:border-leo-red focus:shadow-[0_0_0_3px_rgba(228,0,43,0.12)]"
      : "border-border focus:border-leo-blue focus:shadow-[0_0_0_3px_rgba(30,94,255,0.14)]"
  } ${extra}`;
}

function SelectArrow() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** Desktop step rail + mobile "Step X of N" progress. */
function Stepper({ current }: { current: number }) {
  return (
    <div>
      <div className="hidden sm:block">
        <div className="flex items-center">
          {STEP_META.map((step, i) => {
            const num = i + 1;
            const state = num < current ? "done" : num === current ? "current" : "future";
            return (
              <div key={step.title} className="flex flex-1 items-center last:flex-none">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-[var(--duration-base)] ${
                    state === "done"
                      ? "bg-leo-blue text-white"
                      : state === "current"
                        ? "bg-linear-to-br from-leo-blue to-leo-indigo text-white shadow-[0_0_0_5px_rgba(30,94,255,0.18)]"
                        : "bg-surface-blue text-muted"
                  }`}
                >
                  {state === "done" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    String(num).padStart(2, "0")
                  )}
                </span>
                {i < STEP_META.length - 1 && (
                  <span className={`mx-1.5 h-0.5 flex-1 rounded-full transition-colors duration-[var(--duration-base)] ${num < current ? "bg-leo-blue" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex">
          {STEP_META.map((step, i) => (
            <div
              key={step.title}
              className={`flex-1 text-center text-[11px] font-semibold uppercase tracking-wide last:flex-none last:text-right ${
                i + 1 === current ? "text-leo-blue" : "text-muted"
              }`}
              style={i === 0 ? { textAlign: "left" } : undefined}
            >
              {step.short}
            </div>
          ))}
        </div>
      </div>

      <div className="sm:hidden">
        <p className="text-xs font-bold uppercase tracking-widest text-leo-blue-light">
          Step {String(current).padStart(2, "0")} of {String(TOTAL_STEPS).padStart(2, "0")}
        </p>
        <div className="mt-2.5 flex gap-1.5">
          {STEP_META.map((step, i) => (
            <span
              key={step.title}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-[var(--duration-base)] ${
                i + 1 <= current ? "bg-leo-blue" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MembershipForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successDetail, setSuccessDetail] = useState("");

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setClientErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function errorFor(name: string): string | undefined {
    return clientErrors[name] ?? fieldErrors[name]?.join(" ");
  }

  function pickPhoto(file: File | null) {
    setPhotoError(null);
    setClientErrors((e) => {
      if (!("profile_image" in e)) return e;
      const next = { ...e };
      delete next.profile_image;
      return next;
    });
    if (!file) return;
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Photo must be 10 MB or smaller.");
      return;
    }
    setPhoto(file);
    setPhotoPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
  }

  function removePhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function goToStep(target: number) {
    setDirection(target >= step ? "forward" : "back");
    setStep(target);
  }

  function handleBack() {
    if (step === 1) return;
    goToStep(step - 1);
  }

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateStep(step, values, photo);
    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    if (step < TOTAL_STEPS) {
      goToStep(step + 1);
      return;
    }

    // Final step — actually submit to the Django API.
    setStatus("submitting");
    setError(null);
    setFieldErrors({});

    const data = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (key === "phone") continue;
      data.append(key, value);
    }
    const localPhone = values.phone.replace(/\D/g, "");
    data.set("phone", localPhone ? `+977 ${localPhone}` : "");
    if (photo) data.set("profile_image", photo);

    const result = await submitForm(endpoints.memberships, data);

    if (result.ok) {
      setValues(INITIAL_VALUES);
      removePhoto();
      setStep(1);
      setSuccessDetail(result.detail);
      setStatus("success");
      return;
    }

    setError(result.detail);
    setFieldErrors(result.fieldErrors);
    setStatus("error");

    const erroredField = Object.keys(result.fieldErrors)[0];
    const erroredStep = erroredField ? FIELD_STEP[erroredField] : undefined;
    if (erroredStep) goToStep(erroredStep);
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-[760px] overflow-hidden rounded-lg border border-border bg-background p-8 text-center shadow-soft-sm sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leo-blue text-white shadow-glow-blue">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <h2 className="mt-6 text-2xl font-bold text-foreground">Application Submitted Successfully</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          Thank you for your interest in joining Leo Club of Chautari Pokhara. Your
          membership application has been received.
        </p>
        {successDetail && <p className="mt-3 text-sm text-muted">{successDetail}</p>}
      </div>
    );
  }

  const meta = STEP_META[step - 1];

  return (
    <div className="mx-auto max-w-[760px] space-y-3">
      {/* Header card, with the accent bar a Google Form carries at the top. */}
      <div className="overflow-hidden rounded-lg border border-border bg-background shadow-soft-sm">
        <span aria-hidden className="block h-2.5 bg-linear-to-r from-leo-blue-dark via-leo-blue to-leo-cyan" />
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Membership Application
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {site.name} — {site.district}. Your answers are sent only to the club
            committee.
          </p>
          <p className="mt-4 border-t border-border pt-4 text-xs text-leo-red">
            * Indicates required question
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} noValidate className="space-y-3">
        {/* Progress card */}
        <div className="rounded-lg border border-border bg-background p-5 shadow-soft-sm sm:p-6">
          <Stepper current={step} />
        </div>

        <div
          key={step}
          className={`rounded-lg border border-border bg-background p-6 shadow-soft-sm sm:p-8 ${
            direction === "forward" ? "step-in-forward" : "step-in-back"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-leo-blue">
            Step {String(step).padStart(2, "0")} of {String(TOTAL_STEPS).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">{meta.title}</h3>
          <p className="mt-1.5 text-sm text-muted">{meta.subtitle}</p>

          <div className="mt-7 border-t border-border pt-7">
            {/* Honeypot — real applicants never see or fill this in. */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={(event) => set("website", event.target.value)}
              />
            </div>

            {step === 1 && (
              <>
                <div className="rounded-xl border border-leo-blue/25 bg-leo-blue/5 p-4 text-sm text-muted">
                  <span className="font-semibold text-foreground">Email *</span> — your email
                  address will be included with your membership application, so our team
                  can contact you about next steps.
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="full_name" required>
                      Full Name
                    </FieldLabel>
                    <input
                      id="full_name"
                      value={values.full_name}
                      onChange={(event) => set("full_name", event.target.value)}
                      placeholder="Enter your full name"
                      className={fieldClass(Boolean(errorFor("full_name")))}
                      aria-invalid={Boolean(errorFor("full_name")) || undefined}
                      aria-describedby="full_name-error"
                    />
                    <FieldError id="full_name-error" message={errorFor("full_name")} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="email" required>
                      Your Email
                    </FieldLabel>
                    <input
                      id="email"
                      type="email"
                      value={values.email}
                      onChange={(event) => set("email", event.target.value)}
                      placeholder="you@example.com"
                      className={fieldClass(Boolean(errorFor("email")))}
                      aria-invalid={Boolean(errorFor("email")) || undefined}
                      aria-describedby="email-error"
                    />
                    <FieldError id="email-error" message={errorFor("email")} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="membership_id">Membership ID</FieldLabel>
                    <input
                      id="membership_id"
                      value={values.membership_id}
                      onChange={(event) => set("membership_id", event.target.value)}
                      placeholder="Enter membership ID, if applicable"
                      className={fieldClass()}
                    />
                    <p className="mt-1.5 text-xs text-muted">Optional</p>
                  </div>
                  <div>
                    <FieldLabel htmlFor="date_of_birth" required>
                      Date of Birth (AD)
                    </FieldLabel>
                    <input
                      id="date_of_birth"
                      type="date"
                      max={todayIso()}
                      value={values.date_of_birth}
                      onChange={(event) => set("date_of_birth", event.target.value)}
                      className={fieldClass(Boolean(errorFor("date_of_birth")), "")}
                      aria-invalid={Boolean(errorFor("date_of_birth")) || undefined}
                      aria-describedby="date_of_birth-error"
                    />
                    <FieldError id="date_of_birth-error" message={errorFor("date_of_birth")} />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="current_address" required>
                    Current Address
                  </FieldLabel>
                  <textarea
                    id="current_address"
                    rows={2}
                    value={values.current_address}
                    onChange={(event) => set("current_address", event.target.value)}
                    placeholder="Enter your current address"
                    className={fieldClass(Boolean(errorFor("current_address")))}
                    aria-invalid={Boolean(errorFor("current_address")) || undefined}
                  />
                  <FieldError id="current_address-error" message={errorFor("current_address")} />
                </div>
                <div>
                  <FieldLabel htmlFor="permanent_address" required>
                    Permanent Address
                  </FieldLabel>
                  <textarea
                    id="permanent_address"
                    rows={2}
                    value={values.permanent_address}
                    onChange={(event) => set("permanent_address", event.target.value)}
                    placeholder="Enter your permanent address"
                    className={fieldClass(Boolean(errorFor("permanent_address")))}
                    aria-invalid={Boolean(errorFor("permanent_address")) || undefined}
                  />
                  <FieldError id="permanent_address-error" message={errorFor("permanent_address")} />
                </div>
                <div className="sm:col-span-2 sm:max-w-sm">
                  <FieldLabel htmlFor="phone" required>
                    Phone Number
                  </FieldLabel>
                  <div
                    className={`mt-1.5 flex overflow-hidden rounded-lg border bg-background transition-[border-color,box-shadow] duration-[var(--duration-fast)] focus-within:shadow-[0_0_0_3px_rgba(30,94,255,0.14)] ${
                      errorFor("phone") ? "border-leo-red" : "border-border focus-within:border-leo-blue"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 border-r border-border bg-surface px-3.5 text-sm font-semibold text-muted">
                      <span aria-hidden>🇳🇵</span>+977
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      value={values.phone}
                      onChange={(event) => set("phone", event.target.value.replace(/[^\d]/g, ""))}
                      placeholder="98XXXXXXXX"
                      className="w-full min-w-0 bg-transparent px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted/70"
                      aria-invalid={Boolean(errorFor("phone")) || undefined}
                      aria-describedby="phone-error"
                    />
                  </div>
                  <FieldError id="phone-error" message={errorFor("phone")} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <FieldLabel htmlFor="occupation_or_study" required>
                  Occupation / Profession / Field of Study
                </FieldLabel>
                <div className="relative">
                  <select
                    id="occupation_or_study"
                    value={values.occupation_or_study}
                    onChange={(event) => set("occupation_or_study", event.target.value)}
                    className={fieldClass(Boolean(errorFor("occupation_or_study")), "appearance-none pr-10")}
                    aria-invalid={Boolean(errorFor("occupation_or_study")) || undefined}
                  >
                    <option value="" disabled className="bg-background">
                      Select your profession or field of study
                    </option>
                    {OCCUPATIONS.map(([value, label]) => (
                      <option key={value} value={value} className="bg-background text-foreground">
                        {label}
                      </option>
                    ))}
                  </select>
                  <SelectArrow />
                </div>
                <FieldError id="occupation_or_study-error" message={errorFor("occupation_or_study")} />

                {values.occupation_or_study === "OTHER" && (
                  <div className="step-in-forward mt-4">
                    <FieldLabel htmlFor="occupation_other" required>
                      Please specify
                    </FieldLabel>
                    <input
                      id="occupation_other"
                      value={values.occupation_other}
                      onChange={(event) => set("occupation_other", event.target.value)}
                      className={fieldClass(Boolean(errorFor("occupation_other")))}
                    />
                    <FieldError id="occupation_other-error" message={errorFor("occupation_other")} />
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <FieldLabel required>Gender</FieldLabel>
                  <div className="mt-2 flex flex-wrap gap-2.5">
                    {GENDERS.map(([value, label]) => (
                      <label key={value} className="relative">
                        <input
                          type="radio"
                          name="gender"
                          value={value}
                          checked={values.gender === value}
                          onChange={(event) => set("gender", event.target.value)}
                          className="peer sr-only"
                        />
                        <span className="flex h-11 min-w-[84px] cursor-pointer items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium text-muted transition-colors duration-[var(--duration-fast)] peer-checked:border-leo-blue peer-checked:bg-leo-blue peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-leo-blue">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <FieldError id="gender-error" message={errorFor("gender")} />

                  {values.gender === "OTHER" && (
                    <div className="step-in-forward mt-4">
                      <FieldLabel htmlFor="gender_other">Please specify</FieldLabel>
                      <input
                        id="gender_other"
                        value={values.gender_other}
                        onChange={(event) => set("gender_other", event.target.value)}
                        className={fieldClass()}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <FieldLabel htmlFor="blood_group" required>
                    Blood Group
                  </FieldLabel>
                  <div className="relative">
                    <select
                      id="blood_group"
                      value={values.blood_group}
                      onChange={(event) => set("blood_group", event.target.value)}
                      className={fieldClass(Boolean(errorFor("blood_group")), "appearance-none pr-10")}
                      aria-invalid={Boolean(errorFor("blood_group")) || undefined}
                    >
                      <option value="" disabled className="bg-background">
                        Select your blood group
                      </option>
                      {BLOOD_GROUPS.map(([value, label]) => (
                        <option key={value} value={value} className="bg-background text-foreground">
                          {label}
                        </option>
                      ))}
                    </select>
                    <SelectArrow />
                  </div>
                  <FieldError id="blood_group-error" message={errorFor("blood_group")} />
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <FieldLabel htmlFor="heard_about_leo" required>
                  How do you know about Leo?
                </FieldLabel>
                <div className="relative">
                  <select
                    id="heard_about_leo"
                    value={values.heard_about_leo}
                    onChange={(event) => set("heard_about_leo", event.target.value)}
                    className={fieldClass(Boolean(errorFor("heard_about_leo")), "appearance-none pr-10")}
                    aria-invalid={Boolean(errorFor("heard_about_leo")) || undefined}
                  >
                    <option value="" disabled className="bg-background">
                      Select an option
                    </option>
                    {HEARD_ABOUT.map(([value, label]) => (
                      <option key={value} value={value} className="bg-background text-foreground">
                        {label}
                      </option>
                    ))}
                  </select>
                  <SelectArrow />
                </div>
                <FieldError id="heard_about_leo-error" message={errorFor("heard_about_leo")} />

                {values.heard_about_leo === "OTHER" && (
                  <div className="step-in-forward mt-4">
                    <FieldLabel htmlFor="heard_about_other" required>
                      Please specify
                    </FieldLabel>
                    <input
                      id="heard_about_other"
                      value={values.heard_about_other}
                      onChange={(event) => set("heard_about_other", event.target.value)}
                      className={fieldClass(Boolean(errorFor("heard_about_other")))}
                    />
                    <FieldError id="heard_about_other-error" message={errorFor("heard_about_other")} />
                  </div>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-7">
                <div>
                  <FieldLabel required>Passport Photo</FieldLabel>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(event) => pickPhoto(event.target.files?.[0] ?? null)}
                    className="hidden"
                  />

                  {photo ? (
                    <div className="step-in-forward mt-2 flex items-center gap-4 rounded-lg border border-border bg-surface p-3">
                      {photoPreview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoPreview} alt="Selected photo preview" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{photo.name}</p>
                        <p className="text-xs text-muted">{(photo.size / (1024 * 1024)).toFixed(1)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors duration-[var(--duration-fast)] hover:border-leo-blue hover:text-leo-blue"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={removePhoto}
                        aria-label="Remove photo"
                        className="rounded-full border border-border p-1.5 text-muted transition-colors duration-[var(--duration-fast)] hover:border-leo-red hover:text-leo-red"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="6" y1="6" x2="18" y2="18" />
                          <line x1="18" y1="6" x2="6" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(event) => {
                        event.preventDefault();
                        setDragActive(false);
                        pickPhoto(event.dataTransfer.files?.[0] ?? null);
                      }}
                      className={`mt-2 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors duration-[var(--duration-fast)] ${
                        dragActive
                          ? "border-leo-blue bg-leo-blue/10"
                          : errorFor("profile_image") || photoError
                            ? "border-leo-red"
                            : "border-border hover:border-leo-blue"
                      }`}
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-blue text-leo-blue">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3v12" />
                          <path d="m7 8 5-5 5 5" />
                          <path d="M5 21h14" />
                        </svg>
                      </span>
                      <span className="text-sm font-semibold text-foreground">Upload a passport-size photo</span>
                      <span className="text-xs text-muted">Click to browse or drag and drop</span>
                      <span className="text-xs text-muted">JPG, PNG or WEBP • Max 10 MB</span>
                    </button>
                  )}
                  <FieldError id="profile_image-error" message={photoError ?? errorFor("profile_image")} />
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Message
                    </label>
                  </div>
                  <div className="relative">
                    <textarea
                      id="message"
                      rows={4}
                      maxLength={MESSAGE_MAX}
                      value={values.message}
                      onChange={(event) => set("message", event.target.value)}
                      placeholder="Tell us why you'd like to join or anything else you'd like us to know..."
                      className={fieldClass(Boolean(errorFor("message")), "pb-7")}
                    />
                    <span className="pointer-events-none absolute bottom-2.5 right-3.5 text-[11px] text-muted">
                      {values.message.length}/{MESSAGE_MAX}
                    </span>
                  </div>
                  <FieldError id="message-error" message={errorFor("message")} />
                </div>

                <div className="rounded-lg border border-border bg-surface p-5">
                  <p className="section-label text-leo-blue-light">Application Summary</p>
                  <dl className="mt-3 space-y-2.5 text-sm">
                    {[
                      { label: "Name", value: values.full_name || "—", step: 1 },
                      { label: "Email", value: values.email || "—", step: 1 },
                      { label: "Phone", value: values.phone ? `+977 ${values.phone}` : "—", step: 2 },
                      {
                        label: "Occupation",
                        value:
                          values.occupation_or_study === "OTHER"
                            ? values.occupation_other || "Other"
                            : labelFor(OCCUPATIONS, values.occupation_or_study),
                        step: 3,
                      },
                      { label: "Blood Group", value: labelFor(BLOOD_GROUPS, values.blood_group), step: 4 },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-4 border-b border-border pb-2.5 last:border-0 last:pb-0">
                        <dt className="text-muted">{row.label}</dt>
                        <div className="flex items-center gap-3">
                          <dd className="max-w-[14rem] truncate text-right font-medium text-foreground">{row.value}</dd>
                          <button
                            type="button"
                            onClick={() => goToStep(row.step)}
                            className="text-xs font-semibold text-leo-blue transition-colors hover:text-leo-blue-dark"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-leo-red/30 bg-leo-red/10 p-3 text-sm text-leo-red">{error}</p>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted transition-colors duration-[var(--duration-fast)] hover:border-leo-blue hover:text-leo-blue"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className={buttonClasses(
              "primary",
              "md",
              "disabled:opacity-60 disabled:hover:translate-y-0",
            )}
          >
            {status === "submitting" ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z" />
                </svg>
                Submitting…
              </span>
            ) : step === TOTAL_STEPS ? (
              "Submit Application →"
            ) : (
              "Continue →"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
