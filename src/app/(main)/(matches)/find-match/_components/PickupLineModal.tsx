"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, RefreshCw, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PickupLineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PICKUP_LINES = [
  "Guess what I'm wearing? The smile you gave me. 🪄✨",
  "Are you WiFi? Because I'm feeling a strong connection. 📶💕",
  "If you were a vegetable, you'd be a cute-cumber. 🥒😘",
  "Do you have a map? I keep getting lost in your eyes. 🗺️👀",
  "Are you made of copper and tellurium? Because you're Cu-Te. ⚛️💖",
  "If looks could kill, you'd definitely be a weapon of mass seduction. 🔥😏",
  "Is your name Google? Because you have everything I've been searching for. 🔍💫",
  "Are you a magician? Because whenever I look at you, everyone else disappears. 🎩✨",
  "Do you believe in love at first sight, or should I walk by again? 👀💕",
  "If you were a triangle, you'd be acute one. 📐😍",
  "Are you a parking ticket? Because you've got FINE written all over you. 🚗💯",
  "Is your dad a boxer? Because you're a knockout! 🥊💥",
  "Do you have a Band-Aid? Because I just scraped my knee falling for you. 🩹💘",
  "Are you a campfire? Because you're hot and I want s'more. 🔥🍫",
  "If you were a fruit, you'd be a fineapple. 🍍👑",
];

const PickupLineModal: React.FC<PickupLineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isOpen) return null;

  const generateNewLine = () => {
    setIsAnimating(true);

    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * PICKUP_LINES.length);
      } while (newIndex === currentLineIndex && PICKUP_LINES.length > 1);

      setCurrentLineIndex(newIndex);
      setIsAnimating(false);
    }, 200);
  };

  const currentLine = PICKUP_LINES[currentLineIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-bold text-gray-900">Pickup Line</h2>
            <Sparkles className="w-4 h-4 text-rose-400" />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-48 h-48 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4">
              <Image
                src="/assets/hero/hero-01.png"
                alt="Cute couple illustration"
                width={200}
                height={200}
                className="w-full h-full object-contain rounded-xl"
                priority
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 rounded-xl p-6 border border-rose-100">
              <p
                className={`text-lg text-gray-800 font-medium leading-relaxed transition-all duration-300 ${
                  isAnimating
                    ? "opacity-0 transform scale-95"
                    : "opacity-100 transform scale-100"
                }`}
              >
                {currentLine}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-sm font-semibold text-rose-600">
                Line #{currentLineIndex + 1}
              </div>
              <div className="text-xs text-gray-500">
                of {PICKUP_LINES.length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-pink-600">🔥 Hot</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={generateNewLine}
              disabled={isAnimating}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isAnimating ? "animate-spin" : ""}`}
              />
              {isAnimating ? "Loading..." : "New Line"}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 italic">
              💡 Pro tip: Confidence is your best accessory!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupLineModal;
