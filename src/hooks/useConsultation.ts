import { createContext, useContext } from "react";

// Optional topic pre-fills the popup's message, e.g. the package a visitor chose.
export const ConsultationContext = createContext<(topic?: string) => void>(() => {});

export const useConsultation = () => useContext(ConsultationContext);
