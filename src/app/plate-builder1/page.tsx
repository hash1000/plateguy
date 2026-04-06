"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ShoppingCart } from "lucide-react";

const plateTypes = [
  { id: "4d-3mm", label: "4D 3mm", price: "£34.99", popular: true },
  { id: "4d-5mm", label: "4D 5mm", price: "£39.99" },
  { id: "4d-gel-3mm", label: "4D Gel 3mm", price: "£44.99" },
  { id: "4d-gel-5mm", label: "4D Gel 5mm", price: "£49.99" },
  { id: "neon-4d", label: "Neon 4D", price: "£54.99", isNew: true },
  { id: "neon-gel", label: "Neon Gel", price: "£54.99", isNew: true },
  { id: "3d-gel", label: "3D Gel", price: "£24.99" },
  { id: "bubble", label: "Bubble", price: "£34.99" },
  { id: "printed", label: "Printed", price: "£14.99" },
];

const plateSizes = [
  {
    id: "std-front",
    label: "Standard Front",
    dimensions: "520 x 111mm",
    vehicleType: "Car",
  },
  {
    id: "std-rear",
    label: "Standard Rear (Oblong)",
    dimensions: "520 x 111mm",
    vehicleType: "Car",
  },
  {
    id: "square",
    label: "Square",
    dimensions: "279 x 203mm",
    vehicleType: "Car",
  },
  {
    id: "motorbike",
    label: "Motorbike",
    dimensions: "228 x 178mm",
    vehicleType: "Bike",
  },
  {
    id: "4x4",
    label: "4x4 / SUV",
    dimensions: "533 x 152mm",
    vehicleType: "4x4",
  },
];

const tabs = [
  { id: "start", label: "Start" },
  { id: "style", label: "Order" },
  { id: "sizing", label: "Sizing" },
  { id: "border", label: "Border" },
  { id: "finish", label: "Finish" },
];

const borders = ["None", "Standard", "Honeycomb", "Diamond", "dsad"];

const verticals = [["None", "Standard", "Honeycomb", "Diamond"], ["None1", "Standard1", "Honeycomb1", "Diamond1"], ["None2", "Standard2", "Honeycomb2", "Diamond2"]];

const content = [
  ["White", "Yellow", "Black", "Blue", "Red"],
  ["None", "UK Flag", "EU", "Welsh Dragon", "Scottish Flag"],
  ["Standard", "Carbon", "Italic"],
];

const neonColors = [
  { id: "purple", label: "Purple", color: "#a855f7" },
  { id: "pink", label: "Pink", color: "#ec4899" },
  { id: "blue", label: "Blue", color: "#3b82f6" },
  { id: "green", label: "Green", color: "#22c55e" },
  { id: "red", label: "Red", color: "#ef4444" },
  { id: "orange", label: "Orange", color: "#f97316" },
];

export default function PlateBuilderPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSideTab, setActiveSideTab] = useState(0);
  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <div className="bg-brand-dark border-b border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-1">
            Customise
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl text-white">
            PLATE BUILDER
          </h1>
        </div>
      </div>

      <div className="max-w-[80%] mx-auto px-4 sm:px-6 py-8 backdrop-blur-md">
        <ul className="flex space-x-6 mb-8">
          {borders.map((border, index) => (
            <li
              onClick={() => { setActiveTab(index); setActiveSideTab(0); }}
              className="text-sm font-medium text-white/70 hover:text-white"
            >
              {border}
            </li>
          ))}
        </ul>

      
        <div className="grid lg:grid-cols-[256px_1fr_380px] gap-8">
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
           <ul>
{
  verticals[activeTab].map((item, index) => (
    <li
      onClick={() => setActiveSideTab(index)}
      className={`text-sm font-medium text-white/70 hover:text-white ${
        activeSideTab === index ? "text-white" : ""
      }`}
    >
      {item}
    </li>
  ))}
           </ul>
          </div>
          {/* Left: Preview + Options */}
          <div className="space-y-6">{content[activeTab][activeSideTab]}</div>
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-brand-dark rounded-2xl border border-white/5 p-6">
              <h2 className="font-heading text-2xl text-white mb-5">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Plate Style</span>
                  <span className="text-white font-medium">hgj</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Registration</span>
                  <span className="text-white font-mono font-bold">
                    plateText
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Size</span>
                  {/* <span className="text-white font-medium">
                    {plateSizes.find((s) => s.id === plateSize)?.label}
                  </span> */}
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Quantity</span>
                  <span className="text-white font-medium capitalize">
                    {/* {plateCount === "both" ? "Front & Rear" : plateCount} */}
                    plateCount
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Border</span>
                  <span className="text-white font-medium">border</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Badge</span>
                  <span className="text-white font-medium">Badge</span>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                  <div className="flex justify-between text-xs text-green-400">
                    <span>Free Delivery</span>
                    <span>£0.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-green-400">
                    <span>Free Fixing Kit</span>
                    <span>£0.00</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-white/10">
                    <span>Total</span>
                    {/* <span className="text-brand-yellow">
                      {selectedType?.price} {plateCount === "both" ? "(×2)" : ""}
                    </span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
