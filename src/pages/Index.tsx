import { useBluerage } from "@/hooks/use-bluerage";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {

  const { safeAreaInsets } = useBluerage();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error, toast]);

  const safeAreaStyle = {
    paddingTop: `${safeAreaInsets.top}px`,
    paddingBottom: `${safeAreaInsets.bottom}px`,
    paddingLeft: `${safeAreaInsets.left}px`,
    paddingRight: `${safeAreaInsets.right}px`,
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={safeAreaStyle}>
      <div className="text-center">
        <h1 className="text-2xl">Blank App</h1>
      </div>
    </div>
  );
};

export default Index;
