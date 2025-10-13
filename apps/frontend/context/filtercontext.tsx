'use client'
import React from 'react'
import { createContext, useContext } from 'react'
import { FilterState } from '@/lib/types/types'

const filterContext = createContext<FilterState | null>(null);
export const useFilter = () => useContext(filterContext)
export function FilterProvider({children}: {children: React.ReactNode}) {
  
  return (
    <filterContext.Provider value={null}>{children}</filterContext.Provider>
  )
}
