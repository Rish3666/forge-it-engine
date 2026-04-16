import type { Metadata } from "next";
import QuizClient from "@/app/quiz/QuizClient";

export const metadata: Metadata = {
  title: "Distro Match Quiz — DistroForge",
  description:
    "Answer a few questions and we'll match you with the perfect Linux distribution for your hardware, workflow, and personality.",
};

export default function QuizPage() {
  return <QuizClient />;
}
