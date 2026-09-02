export default function QRCode({ token }) {
  const bits = Array.from({ length: 121 }, (_, index) => {
    const code = token.charCodeAt(index % token.length)
    return (code + index * 7) % 3 !== 0
  })

  return (
    <div className="inline-grid gap-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-11 gap-1">
        {bits.map((on, index) => <span className={`h-3 w-3 rounded-[2px] ${on ? 'bg-slate-950' : 'bg-white'}`} key={index} />)}
      </div>
      <code className="mt-3 block max-w-64 truncate rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{token}</code>
    </div>
  )
}
