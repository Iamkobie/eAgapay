interface PlaceholderScreenProps {
  title: string
  onBack: () => void
}

export function PlaceholderScreen({ title, onBack }: PlaceholderScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
        <p className="text-slate-500 mb-8">This view is currently abbreviated in the redesigned prototype.</p>
        <button onClick={onBack} className="bg-[#0342EE] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full">
          Go Back
        </button>
      </div>
    </div>
  )
}
