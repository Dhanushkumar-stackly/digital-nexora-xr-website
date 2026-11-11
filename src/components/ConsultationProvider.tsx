import { ReactNode, useCallback, useState } from "react";

import ConsultationModal from "./ConsultationModal";
import { ConsultationContext } from "../hooks/useConsultation";

const ConsultationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");

  const openConsultation = useCallback((nextTopic?: string) => {
    setTopic(nextTopic ?? "");
    setOpen(true);
  }, []);

  return (
    <ConsultationContext.Provider value={openConsultation}>
      {children}
      <ConsultationModal isOpen={open} topic={topic} onClose={() => setOpen(false)} />
    </ConsultationContext.Provider>
  );
};

export default ConsultationProvider;
