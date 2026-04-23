import { useReveal } from "@/hooks/use-reveal"
import { MagneticButton } from "@/components/magnetic-button"
import { useState, useRef, useCallback } from "react"
import Icon from "@/components/ui/icon"

export function CertificateSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [fullName, setFullName] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [namePosition, setNamePosition] = useState({ x: 50, y: 62 })
  const [fontSize, setFontSize] = useState(48)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  const drawPreview = useCallback(
    (imgSrc: string, name: string, pos: { x: number; y: number }, size: number) => {
      const canvas = previewCanvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new window.Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        if (name) {
          ctx.font = `bold ${size}px serif`
          ctx.fillStyle = "#1a1a2e"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          const x = (img.width * pos.x) / 100
          const y = (img.height * pos.y) / 100
          ctx.fillText(name, x, y)
        }
      }
      img.src = imgSrc
    },
    []
  )

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      setImagePreview(src)
      drawPreview(src, fullName, namePosition, fontSize)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleNameChange = (val: string) => {
    setFullName(val)
    if (imagePreview) drawPreview(imagePreview, val, namePosition, fontSize)
  }

  const handlePositionChange = (axis: "x" | "y", val: number) => {
    const newPos = { ...namePosition, [axis]: val }
    setNamePosition(newPos)
    if (imagePreview) drawPreview(imagePreview, fullName, newPos, fontSize)
  }

  const handleFontSizeChange = (val: number) => {
    setFontSize(val)
    if (imagePreview) drawPreview(imagePreview, fullName, namePosition, val)
  }

  const handleDownload = async () => {
    if (!imagePreview || !fullName.trim()) return
    setIsGenerating(true)

    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const img = new window.Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      ctx.font = `bold ${fontSize}px serif`
      ctx.fillStyle = "#1a1a2e"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const x = (img.width * namePosition.x) / 100
      const y = (img.height * namePosition.y) / 100
      ctx.fillText(fullName, x, y)

      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `сертификат_${fullName.replace(/\s+/g, "_")}.png`
        a.click()
        URL.revokeObjectURL(url)
        setIsGenerating(false)
      }, "image/png")
    }
    img.src = imagePreview
  }

  const canDownload = imagePreview && fullName.trim().length > 0

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <canvas ref={canvasRef} className="hidden" />
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-8 transition-all duration-700 md:mb-12 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Подпись
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Добавьте ваше ФИО на сертификат</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* Left — upload + settings */}
          <div
            className={`space-y-5 transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-8 transition-all duration-300 ${
                isDragging
                  ? "border-foreground/60 bg-foreground/10"
                  : "border-foreground/20 bg-foreground/5 hover:border-foreground/40 hover:bg-foreground/10"
              }`}
            >
              <Icon name="Upload" size={28} className="text-foreground/50" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground/80">
                  {imageFile ? imageFile.name : "Загрузить шаблон сертификата"}
                </p>
                <p className="mt-1 font-mono text-xs text-foreground/40">PNG, JPG — перетащите или кликните</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>

            {/* ФИО */}
            <div>
              <label className="mb-1.5 block font-mono text-xs text-foreground/60">ФИО</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Иванов Иван Иванович"
                className="w-full border-b border-foreground/30 bg-transparent py-2 text-base text-foreground placeholder:text-foreground/30 focus:border-foreground/60 focus:outline-none"
              />
            </div>

            {/* Position controls */}
            <div className="space-y-3">
              <p className="font-mono text-xs text-foreground/60">Положение текста</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-mono text-xs text-foreground/40">По горизонтали: {namePosition.x}%</label>
                  <input
                    type="range" min={10} max={90} value={namePosition.x}
                    onChange={(e) => handlePositionChange("x", Number(e.target.value))}
                    className="w-full accent-foreground/70"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs text-foreground/40">По вертикали: {namePosition.y}%</label>
                  <input
                    type="range" min={10} max={90} value={namePosition.y}
                    onChange={(e) => handlePositionChange("y", Number(e.target.value))}
                    className="w-full accent-foreground/70"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-foreground/40">Размер шрифта: {fontSize}px</label>
                <input
                  type="range" min={16} max={120} value={fontSize}
                  onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                  className="w-full accent-foreground/70"
                />
              </div>
            </div>

            <MagneticButton
              variant="primary"
              size="lg"
              className={`w-full transition-opacity ${!canDownload ? "pointer-events-none opacity-40" : ""}`}
              onClick={handleDownload}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Создаём...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Download" size={16} />
                  Скачать сертификат
                </span>
              )}
            </MagneticButton>
          </div>

          {/* Right — preview */}
          <div
            className={`flex flex-col gap-3 transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="font-mono text-xs text-foreground/60">/ Предпросмотр</p>
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5">
              {imagePreview ? (
                <canvas
                  ref={previewCanvasRef}
                  className="max-h-[42vh] w-full object-contain"
                  style={{ imageRendering: "auto" }}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 py-16 text-foreground/30">
                  <Icon name="FileImage" size={48} />
                  <p className="font-mono text-xs">Здесь появится предпросмотр</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
