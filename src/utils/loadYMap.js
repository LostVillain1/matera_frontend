// src/utils/loadYMap.js
// Минималистичный загрузчик API Яндекс.Карт 2.1.
// Грузим скрипт один раз; повторные вызовы получают тот же промис.

let loading = null

export async function loadYMap() {
  // Уже грузится или загружен — просто ждём.
  if (loading) return await loading

  // Если API уже в окне (например, добавлен на другой странице)
  if (window.ymaps?.ready) {
    await new Promise(res => window.ymaps.ready(res))
    return window.ymaps
  }

  // Иначе создаём единственный процесс загрузки.
  loading = (async () => {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
      s.async = true
      s.defer = true
      s.onload = resolve
      s.onerror = () => reject(new Error('Не удалось загрузить Yandex Maps API'))
      document.head.appendChild(s)
    })
    if (!window.ymaps?.ready) throw new Error('Yandex Maps API не инициализировался')
    await new Promise(res => window.ymaps.ready(res))
    return window.ymaps
  })()

  return await loading
}
