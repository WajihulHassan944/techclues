import { TEMPLATES, SIGNATURE, type Template } from "./templates";

export type NotifyEvents = { enquiry: boolean; booking: boolean; cancelled: boolean; subscriber: boolean; summary: boolean };

export type Settings = {
  recipients: string[];
  events: NotifyEvents;
  summaryTime: string;
  fromName: string;
  signature: string;
  templates: Template[];
  retention: { spamDays: number; enquiryMonths: number };
  passwordChangedAt?: string;
};

export const DEFAULT_SETTINGS: Settings = {
  recipients: ["techcluesltd@gmail.com"],
  events: { enquiry: true, booking: true, cancelled: true, subscriber: false, summary: true },
  summaryTime: "08:00",
  fromName: "TechClues",
  signature: SIGNATURE,
  templates: TEMPLATES,
  retention: { spamDays: 30, enquiryMonths: 0 },
};
