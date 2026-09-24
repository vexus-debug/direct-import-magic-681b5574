import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Microscope,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import clinexusLogoWhite from "@/assets/site/clinexus-logo-white.png";

const DEMO_CLINICS = [
  { label: "Dental Clinic Demo", icon: Stethoscope, slug: "demo", email: "demo@clinexus.com.ng", password: "Thepassword@48" },
  { label: "Eye Clinic Demo", icon: Eye, slug: "eye", email: "demo@clinexus.com.ng", password: "Thepassword@48" },
  { label: "Diagnostic Centre Demo", icon: Microscope, slug: "diagnostic-demo", email: "demo@clinexus.com.ng", password: "Thepassword@48" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const demoActive = useRef(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && session && !demoActive.current) {
      navigate("/select-clinic", { replace: true });
    }
  }, [session, authLoading, navigate]);

  const handleDemo = async (clinic: (typeof DEMO_CLINICS)[number]) => {
    demoActive.current = true;
    setDemoLoading(clinic.slug);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: clinic.email,
        password: clinic.password,
      });
      if (error) throw error;
      navigate(`/clinic/${clinic.slug}/dashboard`, { replace: true });
    } catch (error: any) {
      demoActive.current = false;
      toast({ title: "Demo unavailable", description: error.message, variant: "destructive" });
    } finally {
      setDemoLoading(null);
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/select-clinic");
    } catch (error: any) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="site-theme min-h-[100svh] overflow-hidden">
      <div className="grid min-h-[100svh] lg:grid-cols-[minmax(0,1.12fr)_minmax(30rem,0.88fr)]">
        <section className="relative flex min-h-[18rem] flex-col justify-between overflow-hidden border-b border-primary/20 px-5 py-6 sm:px-8 lg:min-h-screen lg:border-b-0 lg:border-r lg:px-12 lg:py-10 xl:px-20">
          <div aria-hidden="true" className="absolute inset-0 opacity-80">
            <div className="absolute left-[12%] top-[42%] h-px w-[62%] bg-primary/25" />
            <div className="absolute bottom-[22%] right-[8%] h-32 w-32 rounded-full border border-primary/20 sm:h-48 sm:w-48" />
            <div className="absolute bottom-[calc(22%+2rem)] right-[calc(8%+2rem)] h-16 w-16 rounded-full border border-primary/30 sm:h-24 sm:w-24" />
            <Activity className="absolute left-[12%] top-[calc(42%-1.25rem)] h-10 w-10 text-primary" strokeWidth={1.25} />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" aria-label="Clinexus home" className="inline-flex">
              <img src={clinexusLogoWhite} alt="Clinexus" className="h-8 w-auto sm:h-9" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-foreground/60 transition-colors hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to website</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>

          <div className="relative z-10 max-w-2xl pb-2 pt-14 sm:pt-20 lg:pb-24 lg:pt-24">
            <span className="site-eyebrow text-primary">Clinic operations software</span>
            <h1 className="mt-4 max-w-xl text-3xl text-foreground sm:text-4xl lg:text-5xl">
              A calmer clinic starts here.
            </h1>
            <p className="mt-4 hidden max-w-lg text-base leading-relaxed text-foreground/55 sm:block">
              Return to the workspace that keeps your patients, appointments, billing, and team in sync.
            </p>
          </div>

          <div className="relative z-10 hidden items-center gap-2 border-t border-primary/15 pt-5 text-xs text-foreground/45 lg:flex">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Secure access to your clinic workspace
          </div>
        </section>

        <section className="site-section-light flex items-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-md lg:mx-0">
            <div className="mb-8">
              <span className="site-eyebrow text-primary">Welcome back</span>
              <h2 className="mt-3 text-3xl text-foreground sm:text-4xl">Sign in to Clinexus</h2>
              <p className="mt-2 text-sm text-muted-foreground">Enter your details to continue to your clinic.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@clinic.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-12 rounded-sm border-border bg-background px-4 text-base shadow-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-sm border-border bg-background px-4 pr-12 text-base shadow-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1 top-1 h-10 w-10 rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              <Button type="submit" size="lg" className="h-12 w-full rounded-sm font-semibold" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>

              <div className="flex items-center gap-4 py-1" aria-hidden="true">
                <span className="h-px flex-1 bg-border" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">or explore first</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" size="lg" className="h-12 w-full rounded-sm" disabled={Boolean(demoLoading)}>
                    {demoLoading ? "Opening demo..." : "Try a demo clinic"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-sm">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Choose a demo clinic</DropdownMenuLabel>
                  {DEMO_CLINICS.map((clinic) => (
                    <DropdownMenuItem key={clinic.label} onSelect={() => handleDemo(clinic)} className="gap-2 py-2.5">
                      <clinic.icon className="h-4 w-4 text-primary" />
                      {clinic.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground lg:text-left">
              Don&apos;t have an account?{" "}
              <a href="https://wa.me/2349017758165" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">
                Create account
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}