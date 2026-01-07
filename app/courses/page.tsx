import type { Metadata } from "next";
import { MainNav } from "@/components/MainNav";

const sections = [
  {
    title: "Produits frais",
    color: "border-brand-soft",
    items: [
      { label: "Saumon", quantity: "2 pavés" },
      { label: "Pak choï", quantity: "2" },
      { label: "Citron vert", quantity: "1" },
    ],
  },
  {
    title: "Épicerie",
    color: "border-brand-muted",
    items: [
      { label: "Quinoa", quantity: "300 g" },
      { label: "Pois chiches", quantity: "1 boîte" },
      { label: "Pâte miso", quantity: "1 bocal" },
    ],
  },
  {
    title: "À prévoir",
    color: "border-slate-200",
    items: [
      { label: "Graines de sésame", quantity: "50 g" },
      { label: "Tahini", quantity: "1 pot" },
      { label: "Lait végétal", quantity: "1 L" },
    ],
  },
];

const planning = [
  "Bol énergie quinoa & légumes",
  "Saumon miso & patate douce",
  "Granola chocolat noisette",
];

export const metadata: Metadata = {
  title: "Liste de courses | NutriSmart",
};

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f2] text-slate-900">
      <MainNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 lg:px-8">
        <section className="rounded-[32px] border border-brand-soft bg-white p-6 shadow-[0_30px_120px_rgba(96,153,62,0.15)] sm:p-10">
          <header className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand">
              Liste de courses
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Préparez la semaine sereinement</h1>
            <p className="text-sm text-slate-500">
              Sélectionnez vos recettes générées, nous consolidons les ingrédients par rayon pour gagner du temps.
            </p>
          </header>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Recettes sélectionnées</h2>
              <ul className="space-y-3 text-sm text-slate-600">
                {planning.map((recipe) => (
                  <li key={recipe} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                    {recipe}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-500">
                Ajustez le nombre de portions directement depuis la page recette pour recalculer la liste.
              </p>
            </article>

            <article className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-slate-900">Ingrédients consolidés</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {sections.map((section) => (
                  <div key={section.title} className={`rounded-3xl border ${section.color} bg-slate-50/60 p-4`}>
                    <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {section.items.map((item) => (
                        <li key={item.label} className="flex items-center gap-3">
                          <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                          <span>
                            {item.label}
                            <span className="text-slate-400"> · {item.quantity}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl border border-brand-soft bg-brand-soft p-5 text-sm text-brand-strong">
                <p className="font-semibold text-slate-900">Astuce NutriSmart</p>
                <p>
                  Ajoutez vos placards disponibles : nous retirons automatiquement les doublons et ajustons les
                  quantités restantes à acheter.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
