@echo off
cd /d "%~dp0"
echo =========================================================
echo  AVVIO SERVER E APERTURA WEB APP: TRENDS
echo =========================================================
echo.
echo [*] Sincronizzo i dati piu' recenti da GitHub (git pull)...
git pull --ff-only
if errorlevel 1 (
    echo [!] Pull non riuscito ^(niente rete o modifiche locali^).
    echo     L'app parte comunque con i dati locali.
)
echo.
echo [*] Avvio del server http-server in background sulla porta 8080...
start "" cmd.exe /c "npx http-server -p 8080"
echo.
echo [*] Attesa per l'inizializzazione del server (2 secondi)...
timeout /t 2 >nul
echo.
echo [*] Apertura dell'app TRENDS nel browser predefinito...
start http://127.0.0.1:8080
echo.
echo [OK] Fatto! Lascia aperta la finestra nera denominata "npx http-server"
echo      per mantenere attivo il server. Puoi chiudere questa finestra.
echo.
exit
