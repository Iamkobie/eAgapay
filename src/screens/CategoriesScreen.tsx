import { useState } from 'react'
import { Search, Send, Info, Plus } from 'lucide-react'
import { CATEGORIES } from '../data'
import { ProgramSubmitModal } from '../components/ProgramSubmitModal'

interface CategoriesScreenProps {
  onSelect: (cat: string, query?: string) => void
}

export function CategoriesScreen({ onSelect }: CategoriesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  function handleSearch() {
    if (searchQuery.trim()) {
      // Natural language query — pass as 'general' category with the query text
      onSelect('general', searchQuery.trim())
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Search Header Area */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">What are you looking for?</h1>
          <p className="text-slate-500 text-base mb-8 max-w-xl mx-auto">
            Search for specific assistance or browse by category to discover programs matched to your verified profile.
          </p>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#0342EE] transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-16 py-4 border-2 border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-[#0342EE] transition-all shadow-sm text-base"
              placeholder="Ask what you're looking for... (e.g. 'housing loan' or 'scholarship')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button onClick={handleSearch} className="p-2 bg-[#0342EE] text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                <Send size={18} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 bg-slate-50/50 px-2">Or browse by category</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const isDisaster = cat.id === 'disaster'
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`bg-white border rounded-2xl p-5 text-left transition-all duration-200 group flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 ${
                  isDisaster 
                    ? 'border-red-100 hover:border-red-300' 
                    : 'border-slate-200 hover:border-[#0342EE]/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isDisaster 
                    ? 'bg-red-50 text-[#B80101] group-hover:bg-red-100' 
                    : 'bg-slate-50 text-[#0342EE] group-hover:bg-blue-50'
                }`}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <div className={`font-semibold text-sm mb-1.5 transition-colors ${
                    isDisaster ? 'text-red-900' : 'text-slate-900 group-hover:text-[#0342EE]'
                  }`}>
                    {cat.label}
                  </div>
                  <div className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {cat.desc}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Quiet Info Bar */}
        <div className="mt-12 bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-sm max-w-3xl mx-auto">
          <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">Smart Matching:</span> Your verified PhilSys profile is applied automatically. You may be asked a few brief contextual questions to complete your eligibility check.
          </p>
        </div>

        {/* Submit Program Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#0342EE] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Submit a Government Program
          </button>
          <p className="text-sm text-slate-500 mt-3">
            Know of a local government program? Help us build a centralized database.
          </p>
        </div>
      </div>

      {/* Program Submit Modal */}
      <ProgramSubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
