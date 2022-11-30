# Sett opp utviklermiljø

### MYSQL

1. Last ned mysql server + mysql workbench her: https://dev.mysql.com/downloads/installer/
2. Konfigurer serveren til å kjøre på port `3036` med brukernavn `root` og passord `root`
3. Koble til databasen i workbench og lag en ny schema `techtube`
4. Kopier `/DB.sql` og kjør sql skriptet i workbench
5. Nå har du en kopi av techtube databasen

### API

1. Lag .env `/techtube-api/.env`

```bash
SECRET_KEY=-KaNdRgUkXp2s5v8y/B?E(H+MbQeShVm
DB_HOST=localhost
DB_NAME=techtube
DB_USER=root
DB_PASSWORD=root
```

2. Kjør kommandoen i powershell

```powershell
cd techtube-api
npm i
node .
```

### FRONTEND

1. Kjør kommandoen i powershell

```powershell
cd techtube-frontend
npm i
npm run dev
```

### NGINX

1. Lag en tom mappe temp `/nginx-1.22.1/temp`

# I produksjon

1. Lag .env `/techtube-api/.env`

```bash
SECRET_KEY=-KaNdRgUkXp2s5v8y/B?E(H+MbQeShVm
DB_HOST=192.168.1.143
DB_NAME=techtube
DB_USER=lars
DB_PASSWORD=qwerty
```
