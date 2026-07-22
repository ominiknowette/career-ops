import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/autojobserve/brand";

type LegalPageProps = {
  title: string;
  description: string;
};

export function AutoJobServeLegalPage({ title, description }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FCFBFF_0%,#F8F4FF_100%)] px-5 py-8 text-[#0D1530]">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="AutoJobServe home">
            <BrandLogo />
          </Link>
          <Link href="/auth?mode=login" className="inline-flex items-center gap-2 rounded-xl border border-[#E3E5EE] bg-white px-4 py-2 text-sm font-semibold text-[#59627A] transition hover:text-[#6D3BF5]">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </Link>
        </header>
        <section className="mt-16 rounded-[22px] border border-[#E3E5EE] bg-white/90 p-8 shadow-[0_20px_55px_rgba(35,23,79,0.09)] sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6D3BF5]">AutoJobServe</p>
          <h1 className="mt-4 text-4xl font-[780] tracking-[-0.05em] text-[#0D1530] sm:text-5xl">{title}</h1>
          <p className="mt-5 text-base leading-7 text-[#59627A]">{description}</p>
          <p className="mt-8 rounded-2xl bg-[#F7F3FF] p-5 text-sm leading-6 text-[#59627A]">
            This Phase 1 page is a placeholder for the production policy content. Final legal copy can be added without changing the landing or authentication UI.
          </p>
        </section>
      </div>
    </main>
  );
}
