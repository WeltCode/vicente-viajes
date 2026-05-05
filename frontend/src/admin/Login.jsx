import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, UserRound, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import logoImage from "../assets/images/vicentelogo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate("/admin");
    } catch (err) {
      setError("Credenciales invalidas");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#e8efec] px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#58b5ad]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-[#1f7770]/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_30px_80px_rgba(16,42,43,0.16)] backdrop-blur-xl sm:min-h-[88vh] lg:grid-cols-[1.15fr_1fr]">
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#155f5a] via-[#1f7770] to-[#3d9b90] p-10 text-white lg:block">
          <div className="absolute right-10 top-10 h-24 w-24 rounded-full border border-white/20" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />

          <img src={logoImage} alt="Vicente Viajes" className="h-12 w-auto object-contain" />
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/75">Panel Admin</p>

          <h1 className="mt-14 font-display text-4xl font-semibold leading-tight">
            Gestiona tu agencia
            <br />
            con estilo.
          </h1>

          <p className="mt-5 max-w-sm text-base text-white/85">
            Controla excursiones, playas y ofertas desde un panel seguro, rapido y elegante.
          </p>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-[#d8f5ea]" />
            <p className="text-sm text-white/90">Acceso protegido por token</p>
          </div>
        </aside>

        <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-5 flex flex-col items-center text-center lg:hidden">
              <img src={logoImage} alt="Vicente Viajes" className="h-12 w-auto object-contain sm:h-14" />
              <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#5f7170]">Panel Admin</p>
            </div>

            <div className="mb-6 text-center lg:text-left">
              <h2 className="font-display text-3xl font-semibold text-[#152530] sm:text-4xl">Bienvenido</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5f7170]">Inicia sesion para entrar al panel de administracion.</p>
            </div>

            {error && (
              <p className="mb-4 rounded-xl border border-[#f2caca] bg-[#fdebec] px-4 py-3 text-sm font-medium text-[#a24444]">
                Credenciales invalidas
              </p>
            )}

            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#4f6361]">
              Usuario
            </label>
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#ccdbd7] bg-[#eef3f1] px-3 focus-within:border-[#1f7770]">
              <UserRound className="h-4 w-4 text-[#5f7773]" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 w-full bg-transparent text-sm text-[#152530] outline-none placeholder:text-[#8ea09d] sm:h-12"
                placeholder="Tu usuario"
                autoComplete="username"
              />
            </div>

            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#4f6361]">
              Contrasena
            </label>
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#ccdbd7] bg-[#eef3f1] px-3 focus-within:border-[#1f7770] sm:mb-6">
              <Lock className="h-4 w-4 text-[#5f7773]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full bg-transparent text-sm text-[#152530] outline-none placeholder:text-[#8ea09d] sm:h-12"
                placeholder="Tu contrasena"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rounded-md p-1 text-[#5f7773] transition hover:bg-[#dce6e3]"
                aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full rounded-xl bg-gradient-to-r from-[#1f7770] to-[#3f9b90] py-3.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(31,119,112,0.35)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(31,119,112,0.45)] disabled:cursor-not-allowed disabled:opacity-80"
            >
              <span className="inline-flex items-center gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Validando..." : "Entrar al panel"}
              </span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
