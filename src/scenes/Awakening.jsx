import Reveal from './Reveal'

const to = new URLSearchParams(location.search).get('to')?.trim().slice(0, 40)

export default function Awakening() {
  return (
    <section className="s1 pointer-events-none absolute inset-0 grid place-items-center px-4 text-center">
      <div className="s1-veil absolute inset-0" />
      <div className="s1-text relative flex flex-col items-center">
        <h1 className="s1-date font-display text-[clamp(5rem,17vw,15rem)] leading-[0.85] font-light">
          <span className="s1-date-in gold-text inline-block pb-[0.06em]">
            20 <em className="font-light">/</em> 10
          </span>
        </h1>
        <Reveal as="p" className="s1-sub mt-3 font-display text-[clamp(1.25rem,2.6vw,2rem)] italic tracking-wide text-blush" text="Vietnamese Women's Day" />
        <Reveal
          as="p"
          className="s1-quote mt-6 max-w-[22ch] font-display text-[clamp(1.6rem,3.6vw,3rem)] leading-tight text-cream"
          text={to ? `Dành cho ${to} — đóa hoa đẹp nhất.` : '“Dành cho những đóa hoa đẹp nhất.”'}
        />
      </div>
    </section>
  )
}
