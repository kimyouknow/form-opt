import { useEffect, useRef, useState } from 'react'

interface ComposedMouseEvent extends MouseEvent {
  composedPath: () => EventTarget[]
}

const useDropDown = (initMode = false) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(initMode)

  const isParentExistInComposedPath = (target: Node) => containerRef.current && !containerRef.current.contains(target)

  const shouldCloseDropdown = (event: ComposedMouseEvent) => {
    if (isParentExistInComposedPath(event.target as Node)) {
      closeDropdown()
    }
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  const openDropdown = () => {
    setIsDropdownOpen(true)
  }

  const handleClickDropdownTrigger = (event: React.MouseEvent) => {
    event.stopPropagation()
    isDropdownOpen ? closeDropdown() : openDropdown()
  }

  useEffect(() => {
    window.addEventListener('click', shouldCloseDropdown)

    return () => {
      window.removeEventListener('click', shouldCloseDropdown)
    }
  }, [containerRef])

  return {
    containerRef,
    isDropdownOpen,
    shouldCloseDropdown,
    openDropdown,
    closeDropdown,
    handleClickDropdownTrigger,
  }
}

export default useDropDown
