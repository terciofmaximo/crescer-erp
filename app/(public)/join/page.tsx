import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isExpired } from '@/lib/utils'
import type { Database } from '@/lib/types'

type InvitationRow = Database['public']['Tables']['invitations']['Row'] & {
  schools: { name: string } | null
}

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function JoinPage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) notFound()

  const supabase = await createClient()
  const { data: invitation } = await supabase
    .from('invitations')
    .select('*, schools(name)')
    .eq('token', token)
    .single() as { data: InvitationRow | null; error: unknown }

  if (!invitation) notFound()
  if (invitation.accepted_at) {
    return <InvalidInvite message="Este convite já foi utilizado." />
  }
  if (isExpired(invitation.expires_at)) {
    return <InvalidInvite message="Este convite expirou. Peça um novo link ao administrador." />
  }

  const schoolName = (invitation.schools as { name: string } | null)?.name ?? 'a escola'

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

        {/* Invite info */}
        <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-center">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
            Você foi convidado para
          </p>
          <p className="text-base font-extrabold text-green-900">{schoolName}</p>
          {invitation.label && (
            <p className="text-sm text-muted font-semibold mt-0.5">{invitation.label}</p>
          )}
        </div>

        <h1 className="text-xl font-extrabold text-green-900 text-center">Criar conta</h1>

        <form className="flex flex-col gap-4">
          <input type="hidden" name="token" value={token} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-green-900" htmlFor="full_name">
              Nome completo
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              required
              className="h-11 px-4 rounded-xl border border-border bg-white text-sm font-medium text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-green-700/30 focus:border-green-700"
              placeholder="Seu nome"
            />
          </div>

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
              autoComplete="new-password"
              required
              minLength={8}
              className="h-11 px-4 rounded-xl border border-border bg-white text-sm font-medium text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-green-700/30 focus:border-green-700"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <button
            type="submit"
            className="h-11 rounded-xl bg-green-700 text-white font-bold text-sm hover:bg-green-600 transition-colors mt-1"
          >
            Criar conta e entrar
          </button>
        </form>
      </div>
    </div>
  )
}

function InvalidInvite({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-card p-8 flex flex-col gap-4 items-center text-center">
        <div className="w-12 h-12 rounded-full bg-coral-soft flex items-center justify-center">
          <span className="text-coral font-black text-xl">!</span>
        </div>
        <p className="text-base font-bold text-green-900">{message}</p>
        <a
          href="/login"
          className="text-sm font-semibold text-green-700 hover:underline"
        >
          Ir para o login
        </a>
      </div>
    </div>
  )
}
