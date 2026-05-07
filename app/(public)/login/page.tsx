import { login } from '@/app/actions/auth'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-card p-8 flex flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-green-700 flex items-center justify-center">
            <span className="text-white font-black text-lg leading-none">C</span>
          </div>
          <div className="text-center">
            <div className="font-black text-green-900 tracking-widest text-sm">CRESCER</div>
            <div className="text-muted text-xs font-semibold tracking-widest">GESTÃO ESCOLAR</div>
          </div>
        </div>

        <h1 className="text-xl font-extrabold text-green-900 text-center">Entrar</h1>

        {error && (
          <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center">
            E-mail ou senha incorretos.
          </p>
        )}

        <form className="flex flex-col gap-4" action={login}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-green-900" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-11 px-4 rounded-xl border border-border bg-white text-sm font-medium text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-green-700/30 focus:border-green-700"
              placeholder="seu@email.com.br"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-green-900" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-11 px-4 rounded-xl border border-border bg-white text-sm font-medium text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-green-700/30 focus:border-green-700"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="h-11 rounded-xl bg-green-700 text-white font-bold text-sm hover:bg-green-600 transition-colors mt-1"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-muted font-medium">
          Acesso somente por convite da escola.
        </p>
      </div>
    </div>
  )
}
