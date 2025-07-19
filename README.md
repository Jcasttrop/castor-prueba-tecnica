# 🎵 MusicHub - Spotify Music Discovery App

<img width="1889" height="1038" alt="image" src="https://github.com/user-attachments/assets/64ee2770-0b5f-4baa-b4fd-9e0a7f95ef9e" />


Una aplicación moderna de descubrimiento de música que combina búsqueda tradicional con recomendaciones de IA, integrada con Spotify API.


## ✨ Características Principales

### 🎯 Funcionalidades Core
- **Búsqueda de Música**: Búsqueda en tiempo real de canciones, artistas y álbumes
- **Recomendaciones IA**: Sugerencias inteligentes usando OpenAI GPT-4
- **Sistema de Favoritos**: Guarda tus canciones favoritas en la base de datos
- **Integración Spotify**: Botones directos para like en Spotify
- **Historial de Búsquedas**: Seguimiento de tus búsquedas recientes

### 🎨 Diseño Moderno
- **UI/UX Profesional**: Diseño limpio y moderno con Tailwind CSS
- **Responsive Design**: Optimizado para móviles, tablets y desktop
- **Animaciones Suaves**: Micro-interacciones y transiciones fluidas
- **Gradientes y Sombras**: Efectos visuales atractivos
- **Iconografía Consistente**: Lucide React icons

### 🔧 Tecnologías Avanzadas
- **Autenticación Segura**: Supabase Auth con Google OAuth
- **Base de Datos**: PostgreSQL con Prisma ORM
- **API RESTful**: Endpoints bien estructurados
- **TypeScript**: Tipado estático para mayor robustez

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos utility-first
- **Lucide React** - Iconografía moderna
- **React Hooks** - Gestión de estado y efectos

### Backend
- **Next.js API Routes** - API endpoints
- **Prisma ORM** - Cliente de base de datos
- **PostgreSQL** - Base de datos relacional
- **Supabase** - Autenticación y base de datos

### APIs Externas
- **Spotify Web API** - Búsqueda y datos de música
- **OpenAI GPT-4** - Recomendaciones inteligentes

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Git** - Control de versiones


### 1. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Database
DATABASE_URL="tu-db

# Supabase
NEXT_PUBLIC_SUPABASE_URL="tu-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="tu-supabase-service-role-key"

# Spotify
NEXT_PUBLIC_SPOTIFY_CLIENTID="tu-spotify-client-id"
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET="tu-spotify-client-secret"

# OpenAI
OPENAI_API_KEY="tu-openai-api-key"
```

### 4. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Ver datos en Prisma Studio
npx prisma studio
```

### 5. Ejecutar el proyecto

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
musichub/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── actions/           # Server Actions
│   │   ├── api/               # API Routes
│   │   │   ├── favorites/     # Endpoints de favoritos
│   │   │   └── spotify/       # Endpoints de Spotify
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── globals.css        # Estilos globales
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página principal
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes de UI base
│   │   ├── FavoriteButton.tsx
│   │   ├── FavoritesDropdown.tsx
│   │   ├── LogoutButton.tsx
│   │   └── SpotifyLikeButton.tsx
│   ├── lib/                  # Utilidades y configuraciones
│   │   ├── prisma.ts         # Cliente de Prisma
│   │   └── utils.ts          # Funciones utilitarias
│   └── utils/                # Utilidades adicionales
│       └── supabase/         # Configuración de Supabase
├── prisma/                   # Configuración de Prisma
│   ├── schema.prisma         # Esquema de base de datos
│   └── migrations/           # Migraciones de BD
├── public/                   # Archivos estáticos
└── package.json
```

## 🎯 Funcionalidades Detalladas

### 🔍 Búsqueda de Música
- **Búsqueda en tiempo real** de canciones, artistas y álbumes
- **Resultados paginados** con información detallada
- **Enlaces directos** a Spotify

### 🤖 Recomendaciones de IA
- **Análisis de intención** usando OpenAI GPT-4
- **Generación de queries** optimizadas para Spotify
- **Recomendaciones personalizadas** basadas en descripción
- **Historial de recomendaciones** guardado en BD

### ❤️ Sistema de Favoritos
- **Guardado en base de datos** con información completa
- **Interfaz intuitiva** con botones de corazón animados
- **Dropdown en navbar** con lista de favoritos
- **Eliminación fácil** con confirmación visual

<img width="1886" height="1040" alt="image" src="https://github.com/user-attachments/assets/4bf1ec33-2158-4859-9ca3-37361da37a46" />



## 🔐 Autenticación y Seguridad

### Supabase Auth
- **Google OAuth** integrado
- **Sesiones seguras** con JWT
- **Middleware de protección** de rutas
- **Logout seguro** con limpieza de sesión

### Seguridad de API
- **Validación de entrada** en todos los endpoints
- **Autenticación requerida** para operaciones sensibles
- **Rate limiting** implícito con Next.js

## 🗄️ Base de Datos

### Esquema Principal

```sql
-- Historial de búsquedas
model SearchHistory {
  id        String   @id @default(uuid())
  userId    String
  query     String
  type      String?
  createdAt DateTime @default(now())
}

-- Canciones favoritas
model FavoriteSong {
  id         String   @id @default(uuid())
  userId     String
  spotifyId  String
  name       String
  artists    String
  album      String
  albumArt   String?
  previewUrl String?
  externalUrl String
  createdAt  DateTime @default(now())
  
  @@unique([userId, spotifyId])
}

-- Recomendaciones de IA
model Recommendation {
  id        String   @id @default(uuid())
  intent    String
  songs     Json
  createdAt DateTime @default(now())
}
```
