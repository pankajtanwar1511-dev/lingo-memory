"use client"

import { useEffect } from "react"

export function TestUseEffect() {
  console.log('🌟 TEST COMPONENT MOUNTED 🌟')

  useEffect(() => {
    console.log('✅ USE EFFECT RUNS IN TEST COMPONENT ✅')
  }, [])

  return <div>Test Component</div>
}
