import { defineStore } from 'pinia'

export const useFavouriteStore = defineStore('favorite', {
  state: () => ({
    favorites: []
  }),

  getters: {
    allFavorites: (state) => state.favorites
  },

  actions: {
    addToFavourites(product) {
      // const exists = this.favorites.find((item) => item.id === product.id)
      // if (!exists) {
      //   this.favorites.push(product)
      // }
      if (!this.favorites.some(item => item.id === product.id)) {
        this.favorites.push({
          ...product,
          selectedColor: product.colors?.[0] || null,
          selectedSize: product.sizes?.[0] || null,
          quantity: 1
        })
      }
    },

    removeFromFavourites(productId) {
      this.favorites = this.favorites.filter(item => item.id !== productId)
    },

    updateFavourite(id, field, value) {
      const item = this.favorites.find(p => p.id === id)
      if (item) item[field] = value
    },
    isFavourite(id) {
      return this.favorites.some(p => p.id === id)
    }
  },
  persist: true
})  