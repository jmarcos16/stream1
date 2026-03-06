# Video Creator

Aplicação Laravel + React para criação automatizada de vídeos com legendas animadas estilo TikTok/Reels.

## Funcionalidades

- Geração de áudio a partir de texto usando OpenAI TTS ou ElevenLabs
- Transcrição automática de áudio com timestamps (OpenAI Whisper)
- Renderização de vídeos com legendas animadas usando Remotion
- Dois estilos de legenda: `bottom` (inferior) e `center` (centralizado)
- Interface web para gerenciar vídeos
- Processamento em background com filas Redis

## Tecnologias

- **Backend**: Laravel 12, PHP 8.4
- **Frontend**: React 19, Inertia.js v2, Tailwind CSS v4
- **Vídeo**: Remotion, FFmpeg
- **IA**: OpenAI (TTS + Whisper), ElevenLabs
- **Infraestrutura**: Redis, SQLite, Laravel Reverb

## Requisitos

- PHP 8.4+
- Node.js 18+
- Composer
- Docker & Docker Compose
- FFmpeg

## Instalação

### 1. Clone e instale dependências

```bash
git clone <repository-url>
cd stream1

composer install
npm install
```

### 2. Configure o ambiente

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Configure as variáveis de ambiente

Edite o arquivo `.env`:

```env
# Banco de dados (SQLite por padrão)
DB_CONNECTION=sqlite

# Fila (Redis obrigatório)
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Escolha o gerador de áudio: 'openai' ou 'elevenlabs'
AUDIO_GENERATOR=openai

# OpenAI (recomendado)
OPENAI_API_KEY=sua-chave-aqui
OPENAI_TTS_MODEL=tts-1
OPENAI_TTS_VOICE=alloy

# OU ElevenLabs
ELEVENLABS_API_KEY=sua-chave-aqui
ELEVENLABS_VOICE_ID=bIHbv24MWmeRgasZH58o
```

### 4. Prepare o banco de dados

```bash
touch database/database.sqlite
php artisan migrate
```

### 5. Inicie o Redis via Docker

```bash
docker-compose up -d
```

### 6. Inicie os serviços

Em terminais separados:

```bash
# Terminal 1: Servidor Laravel
php artisan serve

# Terminal 2: Vite (frontend)
npm run dev

# Terminal 3: Fila de processamento
php artisan queue:work

# Terminal 4 (opcional): WebSocket Reverb
php artisan reverb:start
```

## Uso

1. Acesse `http://localhost:8000`
2. Crie um novo vídeo informando o texto
3. Escolha o estilo de legenda (`bottom` ou `center`)
4. Aguarde o processamento (acompanhe via fila)
5. Baixe o vídeo gerado

## Estrutura do Projeto

```
app/
├── Http/Controllers/
│   ├── VideoCreatorController.php    # Interface principal
│   └── VideoGenerationController.php # API de geração
├── Jobs/
│   ├── GenerateAudioJob.php          # Gera áudio do texto
│   ├── TranscribeAudioJob.php        # Transcreve com timestamps
│   └── RenderVideoJob.php            # Renderiza vídeo final
└── Models/
    └── Video.php                      # Modelo de vídeo

remotion/
├── render-subtitles.mts              # Script de renderização
└── src/
    └── Subtitles/                    # Componentes de legenda

resources/js/
└── pages/
    └── video-creator.tsx             # Interface React
```

## Desenvolvimento

### Testes

```bash
php artisan test
```

### Linting

```bash
# PHP
vendor/bin/pint

# JavaScript
npm run lint
npm run format
```

### Preview Remotion

```bash
npm run remotion:preview
```

## Troubleshooting

**Fila não processa**: Verifique se o container Redis está rodando
```bash
docker-compose ps
docker-compose logs redis
```

**Erro de renderização Remotion**: O Docker já inclui Chromium. Se necessário, reinicie o container
```bash
docker-compose restart
```

**Erro de FFmpeg**: Instale FFmpeg
```bash
# Ubuntu/Debian
apt-get install ffmpeg
```

## Licença

MIT
