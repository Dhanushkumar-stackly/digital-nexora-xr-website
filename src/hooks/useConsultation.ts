import { createContext, useContext } from "react";

export const ConsultationContext = createContext<() => void>(() => {});

export const useConsultation = () => useContext(ConsultationContext);
