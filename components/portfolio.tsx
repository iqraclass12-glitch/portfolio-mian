"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import portfolioConfig from "@/config/portfolio.json"
import skillsDatabase from "@/config/skills-database.json"

interface SkillTag {
  id: string
  name: string
  icon: string
  color: string
  textColor: string
}

interface LinkButton {
  id: string
  label: string
  url: string
  style: string
  icon: string
}

interface PortfolioItem {
  id: string
  title: string
  timestamp: string
  type: "single" | "gallery"
  action: "popup" | "link"
  url?: string
  images: string[]
}

interface PortfolioConfig {
  personal: {
    name: string
    profileImage: string
    about: string
    email: string
  }
  skills: string[] // Now just an array of skill IDs
  links: LinkButton[]
  buttonStyles: Record<string, { className: string }>
  portfolio: PortfolioItem[]
}

const config = portfolioConfig as PortfolioConfig

export default function Portfolio() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const getSkillData = (skillId: string): SkillTag | null => {
    const skillData = skillsDatabase[skillId as keyof typeof skillsDatabase]
    if (!skillData) return null

    let backgroundColor = skillData.color
    let textColor = "#000000"

    if (skillData.color === "default") {
      backgroundColor = isDarkMode ? "#ffffff" : "#000000"
      textColor = isDarkMode ? "#000000" : "#ffffff"
    } else {
      // For custom colors, determine best contrast text color
      textColor = getContrastColor(skillData.color)
    }

    return {
      id: skillId,
      name: skillData.name,
      icon: skillData.icon,
      color: backgroundColor,
      textColor: textColor,
    }
  }

  const getContrastColor = (hexColor: string): string => {
    // Convert hex to RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16)
    const g = Number.parseInt(hexColor.slice(3, 5), 16)
    const b = Number.parseInt(hexColor.slice(5, 7), 16)

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return black for light backgrounds, white for dark backgrounds
    return luminance > 0.5 ? "#000000" : "#ffffff"
  }

  const handleLinkClick = (url: string) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer")
    } else {
      window.open(url, "_blank")
    }
  }

  const handlePortfolioClick = (item: PortfolioItem) => {
    if (item.action === "link" && item.url) {
      handleLinkClick(item.url)
    } else if (item.action === "popup") {
      setSelectedPortfolio(item)
      setCurrentImageIndex(0)
    }
  }

  const closePopup = () => {
    setSelectedPortfolio(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedPortfolio) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedPortfolio.images.length)
    }
  }

  const prevImage = () => {
    if (selectedPortfolio) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedPortfolio.images.length) % selectedPortfolio.images.length)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
      <Button
        onClick={() => setIsDarkMode(!isDarkMode)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90 transition-all duration-300"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </Button>

      <div className="py-12 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance drop-shadow-2xl dark:text-shadow-white light:text-shadow-black">
              {config.personal.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty drop-shadow-lg dark:text-shadow-white light:text-shadow-black">
              {/* Removed title from personal config */}
            </p>

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/30 to-accent/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 dark:opacity-50 dark:group-hover:opacity-100" />
                <Image
                  src={config.personal.profileImage || "/placeholder.svg"}
                  alt={`${config.personal.name} profile picture`}
                  width={200}
                  height={200}
                  className="relative rounded-2xl transition-all duration-300 group-hover:scale-105 border-2 border-primary/20 dark:shadow-white-glow light:shadow-black-deep"
                  priority
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Skill Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {config.skills.map((skillId) => {
                const skill = getSkillData(skillId)
                if (!skill) return null

                return (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="px-3 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm dark:shadow-white-glow light:shadow-black-deep"
                    style={{
                      backgroundColor: skill.color,
                      color: skill.textColor,
                    }}
                  >
                    <Image
                      src={skill.icon || "/placeholder.svg"}
                      alt={skill.name}
                      width={16}
                      height={16}
                      className="mr-1.5"
                    />
                    {skill.name}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* About Section */}
          <Card className="mb-12 backdrop-blur-sm bg-card/80 border-primary/20 dark:shadow-white-glow-lg light:shadow-black-deep-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center dark:text-shadow-white light:text-shadow-black">
                About Me
              </h2>
              <p className="text-lg text-muted-foreground text-center leading-relaxed text-pretty mb-8 dark:text-shadow-white light:text-shadow-black">
                {config.personal.about}
              </p>
              <div className="flex justify-center items-center gap-4 mb-8 text-muted-foreground">
                {/* Removed location from personal config */}
                <span>✉️ {config.personal.email}</span>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {config.links.map((link) => {
                  const buttonStyle = config.buttonStyles[link.style] || config.buttonStyles.default
                  return (
                    <Button
                      key={link.id}
                      onClick={() => handleLinkClick(link.url)}
                      size="sm"
                      className={cn(
                        "h-auto py-2 px-4 flex items-center gap-2 transition-all duration-300 hover:scale-105 dark:shadow-white-glow dark:hover:shadow-white-glow-hover light:shadow-black-deep light:hover:shadow-black-deep-hover",
                        buttonStyle.className,
                      )}
                    >
                      <span className="text-sm">{link.icon}</span>
                      <span className="text-sm font-medium">{link.label}</span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <Card className="mb-12 backdrop-blur-sm bg-card/80 border-primary/20 dark:shadow-white-glow-lg light:shadow-black-deep-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center dark:text-shadow-white light:text-shadow-black">
                Portfolio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {config.portfolio.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handlePortfolioClick(item)}
                    className="group cursor-pointer relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 dark:shadow-white-glow dark:hover:shadow-white-glow-hover light:shadow-black-deep light:hover:shadow-black-deep-hover"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-xl">
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {item.type === "gallery" && (
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs">
                          {item.images.length} images
                        </div>
                      )}
                      {item.action === "link" && (
                        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-full p-1 text-white text-xs">
                          🔗
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                      <p className="text-xs opacity-80">{new Date(item.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedPortfolio && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Button
              onClick={closePopup}
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70"
            >
              ✕
            </Button>

            <div className="relative">
              <Image
                src={selectedPortfolio.images[currentImageIndex] || "/placeholder.svg"}
                alt={selectedPortfolio.title}
                width={800}
                height={600}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />

              {selectedPortfolio.images.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  >
                    ←
                  </Button>
                  <Button
                    onClick={nextImage}
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  >
                    →
                  </Button>
                </>
              )}
            </div>

            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-bold mb-2">{selectedPortfolio.title}</h3>
              <p className="text-sm opacity-80">{new Date(selectedPortfolio.timestamp).toLocaleDateString()}</p>
              {selectedPortfolio.images.length > 1 && (
                <p className="text-xs mt-2 opacity-60">
                  {currentImageIndex + 1} of {selectedPortfolio.images.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-primary/20 py-4 dark:shadow-white-glow light:shadow-black-deep">
        <div className="text-center">
          <p className="text-muted-foreground text-sm dark:text-shadow-white light:text-shadow-black">
            Made with ❤️ and ☕ by Iceyy
          </p>
        </div>
      </footer>
    </div>
  )
}
