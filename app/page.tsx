"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Tarot card data
// Dynamically create card objects from public/cards (only those without "_text" in the filename)
const cardFilenames = [
  "amies.jpg",
  "amour.jpg", 
  "apprentissage.jpg",
  "art.jpg",
  "bonheur.jpg",
  "celebration.jpg",
  "chance.jpg",
  "courage.jpg",
  "dualite.jpg",
  "enfant.jpg",
  "evolution.jpg",
  "famille.jpg",
  "feu.jpg",
  "guides.jpg",
  "magie.jpg",
  "maison.jpg",
  "mere.jpg",
  "miroir.jpg",
  "monde_a_toi.jpg",
  "mort.jpg",
  "nuit.jpg",
  "superstar.jpg",
  "voyages.jpg",
]

const tarotCards = cardFilenames.map((filename, idx) => {
  const name = filename.replace(".jpg", "")
  return {
    id: idx + 1,
    name,
    frontImageUrl: `/cards/${filename}`,
    backImageUrl: `/cards/${name}_text.jpg`,
  }
})

interface TarotCard {
  id: number
  name: string
  frontImageUrl: string
  backImageUrl: string
}

export default function TarotApp() {
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([])
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false])
  const [isDrawing, setIsDrawing] = useState(false)
  const [enlargedCard, setEnlargedCard] = useState<TarotCard | null>(null)
  const [cardFlipped, setCardFlipped] = useState(false)
  const [zoomingCardIndex, setZoomingCardIndex] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  // Load saved reading from localStorage on component mount
  useEffect(() => {
    const savedReading = localStorage.getItem('tarotReading')
    if (savedReading) {
      const { selectedCards: savedCards, revealedCards: savedRevealed } = JSON.parse(savedReading)
      setSelectedCards(savedCards)
      setRevealedCards(savedRevealed)
      setHasDrawn(true)
    }
  }, [])

  // Save reading to localStorage whenever selectedCards or revealedCards change
  useEffect(() => {
    if (selectedCards.length > 0) {
      const readingData = {
        selectedCards,
        revealedCards
      }
      localStorage.setItem('tarotReading', JSON.stringify(readingData))
    }
  }, [selectedCards, revealedCards])

  const drawCards = () => {
    // Prevent drawing if user has already drawn cards
    if (hasDrawn) return
    
    setIsDrawing(true)
    setRevealedCards([false, false, false])

    // Shuffle and select 3 random cards
    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5)
    const drawn = shuffled.slice(0, 3)
    setSelectedCards(drawn)
    setHasDrawn(true)

    setTimeout(() => {
      setIsDrawing(false)
    }, 1000)
  }

  const resetReading = () => {
    localStorage.removeItem('tarotReading')
    setSelectedCards([])
    setRevealedCards([false, false, false])
    setHasDrawn(false)
    setEnlargedCard(null)
    setShowModal(false)
  }

  const revealCard = (index: number) => {
    if (selectedCards.length === 0) return

    // If card is already revealed, enlarge it with zoom animation
    if (revealedCards[index]) {
      setZoomingCardIndex(index)
      
      setTimeout(() => {
        setEnlargedCard(selectedCards[index])
        setCardFlipped(false)
        setShowModal(true)
        setZoomingCardIndex(null)
      }, 300) // Match animation duration
      return
    }

    // Otherwise, reveal the card with flip animation
    const newRevealed = [...revealedCards]
    newRevealed[index] = true
    setRevealedCards(newRevealed)
  }

  const closeEnlargedView = () => {
    setShowModal(false)
    setEnlargedCard(null)
    setCardFlipped(false)
  }

  const flipCard3D = () => {
    setCardFlipped(!cardFlipped)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-2 sm:mb-4 text-balance leading-tight">
          ✨ Mystical Lens' Tarot ✨
        </h1>
        <h4 className="text-sm sm:text-base text-muted-foreground">For FAUX FESTIVAL ©</h4>
      </div>

      {/* Cards Section */}
      <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
        {selectedCards.length === 0 ? (
          <div className="text-center">
            <Button
              onClick={drawCards}
              disabled={isDrawing || hasDrawn}
              className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground glow-animation disabled:opacity-50"
            >
              {isDrawing ? "Drawing Cards..." : hasDrawn ? "Cards Already Drawn" : "Draw Your Cards"}
            </Button>
          </div>
        ) : (
          <>
            {/* Cards with Labels - Mobile First Layout */}
            <div className="flex flex-col gap-6 w-full max-w-sm sm:max-w-2xl md:max-w-4xl md:grid md:grid-cols-3 md:gap-8">
              {selectedCards.map((card, index) => {
                const labels = ["Passé", "Présent", "Futur"];
                return (
                  <div key={card.id} className="flex flex-col items-center">
                    {/* Label for each card */}
                    <div className="text-accent font-bold text-center mb-3 text-base sm:text-lg md:text-base tracking-wide">
                      {labels[index]}
                    </div>
                    <Card
                    className={`w-64 h-96 sm:w-72 sm:h-[430px] md:w-64 md:h-96 cursor-pointer transition-all duration-300 rounded-2xl levitate ${
                      revealedCards[index] ? "glow-animation hover:scale-105 hover:shadow-2xl" : "hover:border-accent hover:shadow-xl"
                    } ${isDrawing ? "flip-animation" : ""} ${zoomingCardIndex === index ? "card-to-modal" : ""}`}
                    onClick={() => revealCard(index)}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-2xl">
                      {!revealedCards[index] ? (
                        <div className="relative h-full w-full">
                          <img 
                            src={card.frontImageUrl} 
                            alt="Card back" 
                            className="w-full h-full object-cover rounded-2xl blur-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col items-center justify-center rounded-2xl">
                            <div className="text-lg sm:text-2xl md:text-4xl mb-1 sm:mb-2 animate-pulse">🔮</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col h-full relative group">
                          <img 
                            src={card.frontImageUrl} 
                            alt={card.name} 
                            className="w-full h-full object-cover rounded"
                          />
                          {/* Click indicator overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-black animate-pulse">
                              👆 Cliquez pour voir le texte
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    </Card>
                  </div>
                );
              })}
            </div>
            
            {/* Helpful instruction text */}
            <div className="text-center mt-6 text-muted-foreground text-sm max-w-md">
              💡 Appuyez sur une carte pour ouvrir et lire l'interprétation complète.
            </div>
          </>
        )}
      </div>

      {/* Enlarged Card Modal with 3D Animation */}
      {enlargedCard && showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeEnlargedView}
        >
          <div className="relative card-3d-container modal-from-card" onClick={(e) => e.stopPropagation()}>
            {/* 3D Card Container */}
            <div 
              className={`card-3d w-80 h-96 sm:w-96 sm:h-[480px] ${cardFlipped ? 'flipped' : ''}`}
              onClick={flipCard3D}
            >
              {/* Front Side (back image with text) */}
              <div className="card-3d-side">
                <img
                  src={enlargedCard.backImageUrl}
                  alt={enlargedCard.name}
                  className="w-full h-full object-contain rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Back Side (front image) */}
              <div className="card-3d-side card-3d-back">
                <img
                  src={enlargedCard.frontImageUrl}
                  alt={`${enlargedCard.name} back`}
                  className="w-full h-full object-contain rounded-2xl shadow-2xl"
                />
              </div>
            </div>
            
            {/* Instructions */}
            <div className="text-center text-white mt-4">
              <div className="text-sm opacity-70">
                Appuyez sur l'image pour la retourner et à l'extérieur pour fermer
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
