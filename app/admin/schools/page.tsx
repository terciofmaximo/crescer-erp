import { createClient } from '@/lib/supabase/server'

export default async function AdminSchoolsPage() {
  const supabase = await createClient()
  const { data: schools } = await supabase
    .from('schools')
    .select('id, name, slug, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-green-900">Escolas</h1>
          <p className="text-muted text-sm font-medium mt-1">
            {schools?.length ?? 0} escola{schools?.length !== 1 ? 's' : ''} cadastrada{schools?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="h-10 px-5 rounded-xl bg-green-700 text-white font-bold text-sm hover:bg-green-600 transition-colors">
          + Nova escola
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {schools?.map((school) => (
          <div
            key={school.id}
            className="bg-card rounded-xl border border-border px-5 py-4 flex items-center justify-between shadow-card"
          >
            <div>
              <p className="font-bold text-green-900">{school.name}</p>
              <p className="text-xs text-muted font-mono mt-0.5">{school.slug}</p>
            </div>
            <a
              href={`/admin/schools/${school.id}`}
              className="text-sm font-semibold text-green-700 hover:underline"
            >
              Gerenciar →
            </a>
          </div>
        ))}

        {!schools?.length && (
          <div className="bg-card rounded-xl border border-border px-5 py-10 text-center">
            <p className="text-muted font-semibold text-sm">Nenhuma escola cadastrada ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
