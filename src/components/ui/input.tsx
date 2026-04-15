"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Field = ({
    label,
    id,
    value,
    onChange,
    type = "text",
    placeholder,
    required,
    errors, 
    setErrors
  }: any) => {
    return(
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-yellow-400">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => {
          console.log(">>",e.target.value);
          onChange(e.target.value);
          if (errors[id]) setErrors((prev: any) => ({ ...prev, [id]: "" }));
        }}
        placeholder={placeholder}
        className={cn(`border rounded-md px-3 py-2.5 text-black text-sm outline-none transition focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
          errors[id] ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        }`)}
      />
      {errors[id] && (
        <p className="text-xs text-red-500 mt-0.5">{errors[id]}</p>
      )}
    </div>
    )
  }

export { Field }