// src/utils/loadYMap.js
// Минималистичный загрузчик API Яндекс.Карт 2.1
// Грузим скрипт один раз; повторные вызовы получают тот же промис.

let loading = null

export async function loadYMap() {
  // Если уже загружали скрипт — возвращаем тот же промис
  if (loading) return loading

  loading = new Promise((resolve, reject) => {
    // Проверяем, что window.ymaps уже доступен (например, после повторного вызова)
    if (window.ymaps) {
      resolve(window.ymaps)
      return
    }

    // Создаём тег <script> и грузим API
    const script = document.createElement("script")
    script.src =
      "https://api-maps.yandex.ru/2.1/?apikey=2da860d5-4778-4e4e-8824-8d8ac52881dd&lang=ru_RU"
    script.async = true
    script.onload = () => {
      window.ymaps.ready(() => resolve(window.ymaps))
    }
    script.onerror = () => reject(new Error("Не удалось загрузить API Яндекс.Карт"))
    document.head.appendChild(script)
  })

  return loading
}