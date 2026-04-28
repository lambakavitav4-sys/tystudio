import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const STORAGE_KEY = "ty_first_visit_auth_shown";

const FirstVisitAuthModal = () => {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (user) return;
    if (location.pathname.startsWith("/auth")) return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, [loading, user, location.pathname]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const goToAuth = (mode: "signup" | "login") => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    navigate(`/auth?mode=${mode}`);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? dismiss() : setOpen(o))}>
      <DialogContent className="sm:max-w-md border-primary/30 bg-gradient-to-br from-background via-background to-primary/10">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Welcome to TY Studio
          </DialogTitle>
          <DialogDescription className="text-center">
            Create a free account to like, comment, upload and personalize your
            experience. We'll remember you next time.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-2">
          <Button
            size="lg"
            className="w-full"
            onClick={() => goToAuth("signup")}
          >
            Create an account
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => goToAuth("login")}
          >
            I already have an account
          </Button>
          <button
            onClick={dismiss}
            className="mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue as guest
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FirstVisitAuthModal;
