import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { Book } from "@prisma/client"

export interface CartItem {
  book: Book
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (book: Book) => void
  removeItem: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (book: Book) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.book.id === book.id)
        
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.book.id === book.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({
            items: [...currentItems, { book, quantity: 1 }],
          })
        }
      },
      
      removeItem: (bookId: string) => {
        set({
          items: get().items.filter((item) => item.book.id !== bookId),
        })
      },
      
      updateQuantity: (bookId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(bookId)
          return
        }
        
        set({
          items: get().items.map((item) =>
            item.book.id === bookId ? { ...item, quantity } : item
          ),
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.book.price * item.quantity,
          0
        )
      },
    }),
    {
      name: "author-space-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
