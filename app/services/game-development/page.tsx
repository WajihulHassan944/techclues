import type { Metadata } from "next";
import GameDevelopmentMarkup from "@/components/GameDevelopmentMarkup";

export const metadata: Metadata = {
  title: "UK Game Development Services for Studios | TechClues",
  description: "End-to-end game development covering everything from art to multiplayer systems, on Unity, Unreal, AR/VR/XR, UEFN and Web3.",
  alternates: { canonical: "https://techclues.co.uk/services/game-development" },
};

export default function Page() {
  return <GameDevelopmentMarkup />;
}
