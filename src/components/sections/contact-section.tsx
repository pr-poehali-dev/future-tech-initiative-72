import { useReveal } from "@/hooks/use-reveal"
import { MagneticButton } from "@/components/magnetic-button"
import Icon from "@/components/ui/icon"

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24">
          <div className="flex flex-col justify-center">
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-sans text-4xl font-light leading-[1.05] tracking-tight text-foreground md:mb-3 md:text-7xl lg:text-8xl">
                Нужна
                <br />
                помощь?
              </h2>
              <p className="font-mono text-xs text-foreground/60 md:text-base">/ Мы рядом</p>
            </div>

            <div className="space-y-4 md:space-y-8">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon name="Mail" size={12} className="text-foreground/60" />
                  <span className="font-mono text-xs text-foreground/60">Email для вопросов</span>
                </div>
                <p className="text-base text-foreground md:text-2xl">support@certifio.ru</p>
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon name="HelpCircle" size={12} className="text-foreground/60" />
                  <span className="font-mono text-xs text-foreground/60">Частые вопросы</span>
                </div>
                <div className="space-y-3">
                  {[
                    "Какой формат файла принимается?",
                    "Можно ли изменить цвет шрифта?",
                    "Поддерживается ли PDF?",
                  ].map((q) => (
                    <p key={q} className="border-b border-foreground/10 pb-2 text-sm text-foreground/70">
                      {q}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col justify-center gap-6 transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-6 md:p-8">
              <Icon name="Lightbulb" size={32} className="mb-4 text-foreground/40" />
              <h3 className="mb-2 font-sans text-xl font-light text-foreground md:text-2xl">
                Поддерживаемые форматы
              </h3>
              <ul className="space-y-2 font-mono text-sm text-foreground/60">
                <li>— PNG (рекомендуется)</li>
                <li>— JPG / JPEG</li>
                <li>— WEBP</li>
                <li>— GIF (первый кадр)</li>
              </ul>
            </div>

            <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-6 md:p-8">
              <Icon name="ShieldCheck" size={32} className="mb-4 text-foreground/40" />
              <h3 className="mb-2 font-sans text-xl font-light text-foreground md:text-2xl">
                Приватность
              </h3>
              <p className="font-mono text-sm leading-relaxed text-foreground/60">
                Файлы не загружаются на серверы. Всё обрабатывается локально в вашем браузере.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
