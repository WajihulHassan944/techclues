import type { Metadata } from "next";
import GameDevelopmentMarkup from "@/components/GameDevelopmentMarkup";

export const metadata: Metadata = {
  title: "Game Development Services for UK Studios | TechClues",
  description: "Full-cycle game development, from art to multiplayer systems, across Unity, Unreal, AR/VR/XR, UEFN and Web3.",
  alternates: { canonical: "https://techclues.co.uk/services/game-development" },
};

export default function Page() {
  return <GameDevelopmentMarkup />;
}
