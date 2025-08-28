"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Add custom styles for animations
const customStyles = `
  @keyframes levitate {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  
  @keyframes cardFlip3D {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(180deg); }
    100% { transform: rotateY(360deg); }
  }
  
  @keyframes zoomIn {
    0% { transform: scale(1) rotateY(0deg); opacity: 1; }
    50% { transform: scale(1.1) rotateY(180deg); opacity: 0.8; }
    100% { transform: scale(1) rotateY(360deg); opacity: 1; }
  }
  
  .levitate {
    animation: levitate 2s ease-in-out infinite;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  .card-flip-3d {
    animation: cardFlip3D 1s ease-in-out;
    transform-style: preserve-3d;
  }
  
  .card-3d-container {
    perspective: 1000px;
    transform-style: preserve-3d;
  }
  
  .card-3d {
    transform-style: preserve-3d;
    transition: transform 0.6s ease-in-out;
    cursor: pointer;
  }
  
  .card-3d.flipped {
    transform: rotateY(180deg);
  }
  
  .card-3d-side {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 8px;
  }
  
  .card-3d-back {
    transform: rotateY(180deg);
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.innerHTML = customStyles
  document.head.appendChild(styleElement)
}

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
  const [zoomingCard, setZoomingCard] = useState<number | null>(null)

  const drawCards = () => {
    setIsDrawing(true)
    setRevealedCards([false, false, false])

    // Shuffle and select 3 random cards
    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5)
    const drawn = shuffled.slice(0, 3)
    setSelectedCards(drawn)

    setTimeout(() => {
      setIsDrawing(false)
    }, 1000)
  }

  const revealCard = (index: number) => {
    if (selectedCards.length === 0) return

    // If card is already revealed, enlarge it with zoom animation
    if (revealedCards[index]) {
      setZoomingCard(index)
      setTimeout(() => {
        setEnlargedCard(selectedCards[index])
        setCardFlipped(false)
        setZoomingCard(null)
      }, 300)
      return
    }

    // Otherwise, reveal the card with flip animation
    const newRevealed = [...revealedCards]
    newRevealed[index] = true
    setRevealedCards(newRevealed)
  }

  const closeEnlargedView = () => {
    setEnlargedCard(null)
    setCardFlipped(false)
  }

  const flipCard3D = () => {
    setCardFlipped(!cardFlipped)
  }

  const resetReading = () => {
    setSelectedCards([])
    setRevealedCards([false, false, false])
    setIsDrawing(false)
    setEnlargedCard(null)
    setCardFlipped(false)
    setZoomingCard(null)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">
          ✨ Mystical Lens' Tarot ✨
        </h1>
        <h4>For FAUX FESTIVAL ©</h4>
      </div>

      {/* Cards Section */}
      <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
        {selectedCards.length === 0 ? (
          <div className="text-center">
            <Button
              onClick={drawCards}
              disabled={isDrawing}
              className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground glow-animation"
            >
              {isDrawing ? "Drawing Cards..." : "Draw Your Cards"}
            </Button>
          </div>
        ) : (
          <>
            {/* Cards with Labels */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 w-full max-w-4xl">
              {selectedCards.map((card, index) => {
                const labels = ["Passé", "Présent", "Futur"];
                return (
                  <div key={card.id} className="flex flex-col items-center">
                    {/* Label for each card */}
                    <div className="text-accent font-semibold text-center mb-2 sm:mb-4 text-xs sm:text-base">
                      {labels[index]}
                    </div>
                    <Card
                    className={`w-20 h-32 sm:w-32 sm:h-48 md:w-64 md:h-96 cursor-pointer transition-all duration-300 rounded-2xl levitate ${
                      revealedCards[index] ? "glow-animation" : "hover:border-accent hover:shadow-xl"
                    } ${isDrawing ? "flip-animation" : ""}`}
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
                        <div className="flex flex-col h-full">
                          <img 
                            src={card.frontImageUrl} 
                            alt={card.name} 
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Reset Button */}
            <div className="mt-8">
              <Button onClick={resetReading} variant="secondary" className="px-6 py-2">
                New Reading
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Enlarged Card Modal with 3D Animation */}
      {enlargedCard && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeEnlargedView}
        >
          <div className="relative card-3d-container" onClick={(e) => e.stopPropagation()}>
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
            <div className="text-center text-white text-sm mt-4 opacity-70">
              Click the card to flip it • Click outside to close
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
