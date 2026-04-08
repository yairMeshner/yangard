# ── CONFIG ───────────────────────────────────────────────────────────────────
$RG         = "yangard-rg"
$LOCATION   = "eastus2"
$DB_SERVER  = "yangard-db"
$DB_NAME    = "yangarddb"
$DB_USER    = "yangardadmin"
$APP_NAME   = "yangard-api"
$STATIC_URL = "https://zealous-pond-0eaf7b203.1.azurestaticapps.net"
$API_URL    = "https://yangard-api.azurewebsites.net"

# ── SECRETS ──────────────────────────────────────────────────────────────────
$DB_PASSWORD = Read-Host "Choose a DB password (min 8 chars, upper+lower+number)"
$OPENAI_KEY  = Read-Host "OpenAI API key"

# ── CREATE POSTGRESQL ─────────────────────────────────────────────────────────
Write-Host "`n[1/3] Creating PostgreSQL server..."
az provider register --namespace Microsoft.DBforPostgreSQL --wait

az postgres flexible-server create `
  --resource-group $RG `
  --name $DB_SERVER `
  --location $LOCATION `
  --admin-user $DB_USER `
  --admin-password $DB_PASSWORD `
  --sku-name Standard_B1ms `
  --tier Burstable `
  --public-access all `
  --yes

az postgres flexible-server db create `
  --resource-group $RG `
  --server-name $DB_SERVER `
  --database-name $DB_NAME

# ── SET ENV VARS ──────────────────────────────────────────────────────────────
Write-Host "`n[2/3] Setting environment variables..."
$DB_HOST = "$DB_SERVER.postgres.database.azure.com"
az webapp config appsettings set `
  --name $APP_NAME `
  --resource-group $RG `
  --settings `
    DB_HOST=$DB_HOST `
    DB_NAME=$DB_NAME `
    DB_USER=$DB_USER `
    DB_PASSWORD=$DB_PASSWORD `
    OPENAI_API_KEY=$OPENAI_KEY `
    DB_SSLMODE=require `
    ALLOWED_ORIGINS=$STATIC_URL `
    KEYSPY_SERVER_URL=$API_URL `
    SCM_DO_BUILD_DURING_DEPLOYMENT=true

az webapp config set `
  --name $APP_NAME `
  --resource-group $RG `
  --startup-file "python -m uvicorn api.src.server:app --host 0.0.0.0 --port 8000"

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
