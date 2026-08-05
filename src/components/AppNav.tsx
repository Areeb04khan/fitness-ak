import { Link, useRouter, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, MessageSquare, Home, ChefHat, Dumbbell } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function AppNav() {
  const router = useRouter();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <header className="border-b border-border bg-card/60 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="font-display text-xl tracking-wider">
          THE WORKOUT <span className="text-ember">ZONE</span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <NavLink to="/today" icon={<Home className="h-4 w-4" />} label="Today" />
          <NavLink to="/workout" icon={<Dumbbell className="h-4 w-4" />} label="Workout" />
          <NavLink to="/chat" icon={<MessageSquare className="h-4 w-4" />} label="Chat" />
          <NavLink to="/kitchen" icon={<ChefHat className="h-4 w-4" />} label="Kitchen" />
          <button
            onClick={signOut}
            title="Sign out"
            className="ml-2 rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  to,
  icon,
  label,
  exact,
}: {
  to: "/today" | "/workout" | "/chat" | "/kitchen";
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      className="px-3 py-1.5 rounded-md hover:bg-secondary flex items-center gap-1.5 text-muted-foreground"
      activeProps={{ className: "px-3 py-1.5 rounded-md bg-accent text-ember font-medium flex items-center gap-1.5" }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
