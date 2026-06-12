'use client'

import { useState } from 'react'
import { fetchRandomActivity } from './lib/activities'
import type { Activity } from './types/activity'

type BoxState = 'idle' | 'shaking' | 'opened'

type DisplayResult =
  | { kind: 'activity'; activity: Activity }
  | { kind: 'message'; message: string }

const SHAKE_DURATION_MS = 1200

export default function Home() {
  const [needsTools, setNeedsTools] = useState<boolean | null>(null)
  const [maxChildAge, setMaxChildAge] = useState<number | null>(null)
  const [result, setResult] = useState<DisplayResult | null>(null)
  const [boxState, setBoxState] = useState<BoxState>('idle')

  const openGiftBox = async () => {
    setBoxState('shaking')
    setResult(null)

    const fetchPromise = fetchRandomActivity({
      needsTools,
      maxChildAge,
    })

    const [activityResult] = await Promise.all([
      fetchPromise,
      new Promise((resolve) => setTimeout(resolve, SHAKE_DURATION_MS)),
    ])

    if (activityResult.status === 'found') {
      setResult({ kind: 'activity', activity: activityResult.activity })
    } else {
      setResult({
        kind: 'message',
        message: activityResult.message,
      })
    }

    setBoxState('opened')
  }

  const resetBox = () => {
    setBoxState('idle')
    setResult(null)
  }

  const handleMaxAgeChange = (value: string) => {
    if (value === '') {
      setMaxChildAge(null)
      return
    }

    const parsed = Number.parseInt(value, 10)
    setMaxChildAge(Number.isNaN(parsed) ? null : parsed)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-4 border-orange-200">
        <h1 className="text-3xl font-black text-orange-600 mb-2">🎈 PlayBox Kids</h1>
        <p className="text-sm text-gray-500 mb-6">
          Temukan ide bermain seru bersama anak dalam sekejap!
        </p>

        <div className="space-y-4 mb-8 text-left bg-orange-50 p-4 rounded-xl text-sm">
          <div>
            <label className="block font-bold text-gray-700 mb-1">🛠 Alat / Mainan:</label>
            <select
              className="w-full border-2 border-orange-200 rounded-lg p-2 focus:outline-orange-400 bg-white"
              onChange={(e) =>
                setNeedsTools(
                  e.target.value === 'all' ? null : e.target.value === 'true'
                )
              }
            >
              <option value="all">Apa saja boleh</option>
              <option value="false">Tanpa Alat (Tangan Kosong)</option>
              <option value="true">Perlu Alat/Bahan</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">👶 Usia Maksimal Anak:</label>
            <input
              type="number"
              min={1}
              placeholder="Misal: 5 (tahun)"
              className="w-full border-2 border-orange-200 rounded-lg p-2 focus:outline-orange-400 text-base"
              value={maxChildAge ?? ''}
              onChange={(e) => handleMaxAgeChange(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6 flex flex-col items-center justify-center min-h-[160px]">
          {boxState === 'idle' && (
            <button
              onClick={openGiftBox}
              className="text-8xl hover:scale-110 active:scale-95 transition-transform cursor-pointer select-none"
              title="Klik untuk membuka!"
            >
              🎁
            </button>
          )}

          {boxState === 'shaking' && (
            <div className="text-8xl animate-bounce select-none">📦</div>
          )}

          {boxState === 'opened' && (
            <div className="text-8xl animate-pulse select-none">✨🔓✨</div>
          )}
        </div>

        {boxState === 'idle' && (
          <p className="text-sm font-medium text-gray-400 animate-pulse">
            👇 Klik kotak di atas untuk membuka kejutan!
          </p>
        )}

        {boxState === 'shaking' && (
          <p className="text-sm font-bold text-orange-500">
            Sedang mengocok ide bermain... 🤔
          </p>
        )}

        {boxState === 'opened' && result && (
          <div className="mt-4 p-5 bg-yellow-50 rounded-2xl border-2 border-yellow-400 text-left shadow-inner">
            {result.kind === 'activity' ? (
              <>
                <span className="text-xs font-bold bg-yellow-300 text-yellow-800 px-2 py-1 rounded-full uppercase tracking-wider">
                  {result.activity.needs_tools ? '🛠 Perlu Alat' : '🙌 Tanpa Alat'}
                </span>
                <h2 className="text-xl font-black text-gray-800 mt-2 mb-1">
                  {result.activity.title}
                </h2>
                {result.activity.duration_mins != null && (
                  <p className="text-xs text-gray-500 font-medium">
                    ⏱ Estimasi waktu: {result.activity.duration_mins} menit
                  </p>
                )}
              </>
            ) : (
              <h2 className="text-lg font-bold text-gray-700">{result.message}</h2>
            )}

            <button
              onClick={resetBox}
              className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-sm transition-colors"
            >
              Coba Lagi 🔄
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
