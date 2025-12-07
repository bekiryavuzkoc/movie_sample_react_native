# 🎬 React Native Movie Demo App  
React Native + Expo ile oluşturulmuş hafif bir demo uygulaması.

Bu proje; **Zustand state management**, **Zod validation**,  
**custom API client**, **token refresh pipeline**,  
**AsyncStorage persist** ve **Jest test altyapısı** gibi konularda profesyonel bir örnek olması için hazırlanmıştır.

---

# 🎯 Projenin Amacı

### ✅ Jest test altyapısını Expo içinde sorunsuz çalıştırmak  
### ✅ Zustand store mimarisini test edilebilir şekilde kurmak  
### ✅ AsyncStorage persist + hydration mimarisini doğru şekilde uygulamak  
### ✅ Type-safe API client oluşturmak (Zod validation)  
### ✅ Token refresh + retry + timeout gibi gelişmiş network mekanizmalarını öğretmek  
### ✅ normalizeError + Toast ile konsolide hata yönetimi yapmak  

---

## 🚀 Özellikler

### 🎞️ Movie List
- `/comedy` endpoint'inden film listesi çeker  
- Poster URL fallback mekanizması  
- Loading & Error state yönetimi  

### 🎬 Movie Detail
- `/comedy/:id` endpoint  
- Zod schema validasyonu  
- Domain model dönüşümü  

### ⭐ Favourites Store
- AsyncStorage persist  
- `hydrate()` → initial load  
- `toggleFavourite()` → add/remove  
- Invalid JSON fallback  

### 🔐 Token Store
- Access + Refresh token saklama  
- `hydrate()`, `setTokens()`, `clearTokens()`  
- API tarafında refresh mekanizması ile entegre  

---

## 🧱 Teknoloji Stack

| Teknoloji | Açıklama |
|----------|----------|
| **React Native + Expo** | Mobil uygulama iskeleti |
| **Zustand** | Global state yönetimi |
| **Zod** | API response validation |
| **Jest** | Unit test runner |
| **@testing-library/react-native** | Render & hooks testleri |
| **babel-jest** | RN + TypeScript transform |
| **AsyncStorage mock** | Persist testleri için |
| **Custom API Client** | Retry + timeout + refresh token |

---

## ⚙️ Kurulum

### 📦 Bağımlılıkları yükle
```sh
npm install
```
### ▶️ Expo başlat
```sh
npx expo start
```
# 🧪 Test Altyapısı

Bu projede Jest, React Native + Expo ortamına uygun şekilde manuel olarak yapılandırılmıştır.

### ▶️ Testleri çalıştırma
```sh
npx jest
```
### 📊 Coverage raporu alma

```sh
npx jest --coverage
```
### Örnek Coverage Çıktısı

 PASS  tests/tokenStore.test.js
-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------|---------|----------|---------|---------|-------------------
All files                |   95.32 |    84.61 |     100 |   94.84 |                   
 api                     |   91.93 |    84.37 |     100 |   91.22 |                   
  apiClient.ts           |     100 |      100 |     100 |     100 |                   
  request.ts             |   90.56 |    84.37 |     100 |   89.58 | 46,66,140-142     
 constants               |     100 |      100 |     100 |     100 |                   
  images.ts              |     100 |      100 |     100 |     100 |                   
 models                  |     100 |      100 |     100 |     100 |                   
  Movie.ts               |     100 |      100 |     100 |     100 |                   
 src/config              |     100 |      100 |     100 |     100 |                   
  config.ts              |     100 |      100 |     100 |     100 |                   
  tokenStore.ts          |     100 |      100 |     100 |     100 |                   
 src/features            |     100 |       75 |     100 |     100 |                   
  favouriteStore.ts      |     100 |       75 |     100 |     100 | 20                
 src/store               |     100 |     87.5 |     100 |     100 |                   
  useMovieDetailStore.ts |     100 |     87.5 |     100 |     100 | 42                
  useMoviesStore.ts      |     100 |     87.5 |     100 |     100 | 36                
-------------------------|---------|----------|---------|---------|-------------------

# Testing Mimarisinin Özeti

## 1️⃣ API Client (Zod + Error Pipeline)

- Response verileri `schema.parse()` ile validate edilir.
- Hatalı JSON veya beklenmeyen response → otomatik olarak throw edilir.
- Network hattı şu mekanizmaları içerir:
  - ⏳ Timeout (AbortController kullanarak)
  - 🔁 Retry (network hatalarında yeniden deneme)
  - 🔐 401 durumunda refresh token akışı → token yenilenir → istek tekrarlanır
  - 🧂 normalizeError() ile tek tip hata formatı
  - 🔔 Toast.show ile kullanıcıya hata bildirimi


---

## 2️⃣ Retry Mekanizması Testi (httpRequest)

```ts
global.fetch = jest
  .fn()
  .mockRejectedValueOnce({ message: "Network error" }) // İlk deneme: hata
  .mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ ok: true })
  }); // İkinci deneme: başarı

const res = await httpRequest("/x", { retry: 1 });

expect(res.ok).toBe(true);
expect(global.fetch).toHaveBeenCalledTimes(2);
```

## 3️⃣ AsyncStorage Hydration Testi

```ts
jest.spyOn(AsyncStorage, "getItem").mockResolvedValue("[\"a\"]");

await useFavouriteStore.getState().hydrate();

expect(useFavouriteStore.getState().favourites).toEqual(["a"]);
```

## 4️⃣ Zustand Store Toggle Testi

```ts
useFavouriteStore.setState({ favourites: [] });

await useFavouriteStore.getState().toggleFavourite("movie1");

expect(useFavouriteStore.getState().favourites).toEqual(["movie1"]);
```

## 5️⃣ Error Handling Senaryoları

Uygulamanın network hattı aşağıdaki hata senaryolarını ele alacak şekilde tasarlanmıştır:

- **Invalid JSON** → Zod parse hatası → throw
- **Network error** → retry devreye girer (config'e bağlı)
- **Timeout** → AbortController → "Request timeout" hatası
- **401 Unauthorized** → refresh token çalışır → istek yeniden yapılır
- **Refresh token da başarısız olursa** → kullanıcıya normalized error döner
- **Her hata** → normalizeError() → Toast.show ile kullanıcıya bildirim gösterilir

