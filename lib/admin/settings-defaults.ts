import { TEMPLATES, SIGNATURE, type Template } from "./templates";
import { DEFAULT_CALCULATOR_PRICING, type CalculatorPricing } from "@/lib/calculator";

export type NotifyEvents = { enquiry: boolean; booking: boolean; cancelled: boolean; subscriber: boolean; summary: boolean };
export type BuildOnePrice = { amount: number; durationLabel: string };

export type Settings = {
  recipients: string[];
  events: NotifyEvents;
  summaryTime: string;
  fromName: string;
  signature: string;
  templates: Template[];
  retention: { spamDays: number; enquiryMonths: number };
  calculatorPricing: CalculatorPricing;
  buildOnePrice: BuildOnePrice;
  passwordChangedAt?: string;
};

export const DEFAULT_SETTINGS: Settings = {
  recipients: ["info@techclues.co.uk"],
  events: { enquiry: true, booking: true, cancelled: true, subscriber: false, summary: true },
  summaryTime: "08:00",
  fromName: "TechClues",
  signature: SIGNATURE,
  templates: TEMPLATES,
  retention: { spamDays: 30, enquiryMonths: 0 },
  calculatorPricing: DEFAULT_CALCULATOR_PRICING,
  buildOnePrice: { amount: 499, durationLabel: "7 days" },
};
