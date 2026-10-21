// Tách chữ thành từ/ký tự, mỗi phần nằm trong một mask overflow-hidden để reveal.
export default function Reveal({ text, as: Tag = 'span', className = '', split = 'word' }) {
  const parts = split === 'char' ? Array.from(text) : text.split(' ')
  return (
    <Tag className={`reveal ${className}`}>
      <span className="sr-only">{text}</span>
      {parts.map((p, i) => (
        <span key={i} aria-hidden="true">
          <span className="w">
            <span className="wi">{p === ' ' ? ' ' : p}</span>
          </span>
          {split === 'word' && i < parts.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}
