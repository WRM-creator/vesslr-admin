"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Registration = {
  id: string;
  label: string;
};

type BreadcrumbContextType = {
  overrides: Record<string, string>;
  registerLabel: (segment: string, label: string) => () => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined,
);

export const BreadcrumbProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [registrations, setRegistrations] = useState<
    Record<string, Registration[]>
  >({});

  const registerLabel = useCallback((segment: string, label: string) => {
    const id = Math.random().toString(36).substring(7);

    setRegistrations((prev) => {
      const current = prev[segment] || [];
      return {
        ...prev,
        [segment]: [...current, { id, label }],
      };
    });

    return () => {
      setRegistrations((prev) => {
        const current = prev[segment] || [];
        const next = current.filter((reg) => reg.id !== id);
        if (next.length === 0) {
          const { [segment]: _removedSegment, ...rest } = prev;
          return rest;
        }
        return {
          ...prev,
          [segment]: next,
        };
      });
    };
  }, []);

  const overrides = useMemo(() => {
    const result: Record<string, string> = {};
    Object.entries(registrations).forEach(([segment, regs]) => {
      if (regs.length > 0) {
        result[segment] = regs[regs.length - 1].label;
      }
    });
    return result;
  }, [registrations]);

  return (
    <BreadcrumbContext.Provider value={{ overrides, registerLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
};

export const useAppBreadcrumbLabel = (
  segment: string,
  label: string | undefined,
) => {
  const { registerLabel } = useBreadcrumb();

  React.useEffect(() => {
    if (!label) return;

    const unregister = registerLabel(segment, label);
    return unregister;
  }, [segment, label, registerLabel]);
};
