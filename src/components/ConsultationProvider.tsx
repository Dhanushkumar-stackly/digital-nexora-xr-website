import { ReactNode, useCallback, useState } from "react";

import ConsultationModal from "./ConsultationModal";
import { ConsultationContext } from "../hooks/useConsultation";

const ConsultationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const openConsultation = useCallback(() => setOpen(true), []);

  return (
    <ConsultationContext.Provider value={openConsultation}>
      {children}
      <ConsultationModal isOpen={open} onClose={() => setOpen(false)} />
    </ConsultationContext.Provider>
  );
};

export default ConsultationProvider;
