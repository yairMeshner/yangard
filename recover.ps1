# ── CONFIG ───────────────────────────────────────────────────────────────────
$RG          = "yangard-rg"
$LOCATION    = "westeurope"
$SQL_SERVER  = "yangard-sql"
$DB_NAME     = "yangarddb"
$DB_USER     = "yangardadmin"
$APP_NAME    = "yangard-api"
$STATIC_URL  = "https://zealous-pond-0eaf7b203.1.azurestaticapps.net"
$API_URL     = "https://yangard-api.azurewebsites.net"

# ── SECRETS ──────────────────────────────────────────────────────────────────
$DB_PASSWORD = Read-Host "Choose a DB password (min 8 chars, upper+lower+number)"
$OPENAI_KEY  = Read-Host "OpenAI API key"

# ── CREATE AZURE SQL ──────────────────────────────────────────────────────────
Write-Host "`n[1/3] Creating Azure SQL Server..."
az provider register --namespace Microsoft.Sql --wait

az sql server create `
  --name $SQL_SERVER `
  --resource-group $RG `
  --location $LOCATION `
  --admin-user $DB_USER `
  --admin-password $DB_PASSWORD

# Allow Azure services to connect
az sql server firewall-rule create `
  --resource-group $RG `
  --server $SQL_SERVER `
  --name AllowAzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0

# Create database (free serverless tier)
az sql db create `
  --resource-group $RG `
  --server $SQL_SERVER `
  --name $DB_NAME `
  --edition GeneralPurpose `
  --compute-model Serverless `
  --family Gen5 `
  --capacity 1 `
  --auto-pause-delay 60 `
  --use-free-limit `
  --free-limit-exhaustion-behavior AutoPause

# ── SET ENV VARS ──────────────────────────────────────────────────────────────
Write-Host "`n[2/3] Setting environment variables..."
$DB_HOST = "$SQL_SERVER.database.windows.net"
az webapp config appsettings set `
  --name $APP_NAME `
  --resource-group $RG `
  --settings `
    DB_HOST=$DB_HOST `
    DB_NAME=$DB_NAME `
    DB_USER=$DB_USER `
    DB_PASSWORD=$DB_PASSWORD `
    OPENAI_API_KEY=$OPENAI_KEY `
    DB_TYPE=mssql `
    ALLOWED_ORIGINS=$STATIC_URL `
    KEYSPY_SERVER_URL=$API_URL `
    SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Update startup command to use startup.sh (installs ODBC driver)
az webapp config set `
  --name $APP_NAME `
  --resource-group $RG `
  --startup-file "bash api/startup.sh"

# ── REDEPLOY API ──────────────────────────────────────────────────────────────
Write-Host "`n[3/3] Redeploying API..."
Compress-Archive -Path "api" -DestinationPath "api_deploy.zip" -Force
az webapp deploy `
  --name $APP_NAME `
  --resource-group $RG `
  --src-path "api_deploy.zip" `
  --type zip
Remove-Item "api_deploy.zip" -ErrorAction SilentlyContinue

az webapp restart --name $APP_NAME --resource-group $RG

Write-Host "`n✅ Done!"
Write-Host "   API: $API_URL"
Write-Host "`n⚠  Add GitHub secret VITE_API_URL = $API_URL"
Write-Host "   https://github.com/yairMeshner/yangard/settings/secrets/actions"
