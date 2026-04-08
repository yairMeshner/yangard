# ── CONFIG ───────────────────────────────────────────────────────────────────
$RG          = "yangard-rg"
$LOCATION    = "westeurope"
$DB_SERVER   = "yangard-db"
$DB_NAME     = "yangarddb"
$DB_USER     = "yangardadmin"
$APP_PLAN    = "yangard-plan"
$APP_NAME    = "yangard-api"
$STATIC_APP  = "yangard-admin"
$GITHUB_REPO = "https://github.com/yairMeshner/yangard"
$BRANCH      = "main"

# ── SECRETS ──────────────────────────────────────────────────────────────────
$DB_PASSWORD = Read-Host "Choose a DB password"
$OPENAI_KEY  = Read-Host "Paste your OpenAI API key"

# ── LOGIN ────────────────────────────────────────────────────────────────────
Write-Host "`n[1/8] Logging into Azure..."
az login

# ── RESOURCE GROUP ───────────────────────────────────────────────────────────
Write-Host "`n[2/8] Creating resource group..."
az group create --name $RG --location $LOCATION

# ── POSTGRESQL ───────────────────────────────────────────────────────────────
Write-Host "`n[3/8] Creating PostgreSQL server (takes ~3 min)..."
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

Write-Host "Creating database..."
az postgres flexible-server db create `
  --resource-group $RG `
  --server-name $DB_SERVER `
  --database-name $DB_NAME

Write-Host "Running schema.sql..."
az postgres flexible-server execute `
  --name $DB_SERVER `
  --resource-group $RG `
  --admin-user $DB_USER `
  --admin-password $DB_PASSWORD `
  --database-name $DB_NAME `
  --file-path "api/src/schema.sql"

# ── APP SERVICE ───────────────────────────────────────────────────────────────
Write-Host "`n[4/8] Creating App Service..."
az appservice plan create `
  --name $APP_PLAN `
  --resource-group $RG `
  --sku B1 `
  --is-linux

az webapp create `
  --name $APP_NAME `
  --resource-group $RG `
  --plan $APP_PLAN `
  --runtime "PYTHON:3.12"

# Enforce HTTPS only
az webapp update `
  --name $APP_NAME `
  --resource-group $RG `
  --https-only true

# Startup command
az webapp config set `
  --name $APP_NAME `
  --resource-group $RG `
  --startup-file "python -m uvicorn api.src.server:app --host 0.0.0.0 --port 8000"

# ── ENV VARS ─────────────────────────────────────────────────────────────────
Write-Host "`n[5/8] Setting environment variables..."
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
    ALLOWED_ORIGINS=PLACEHOLDER `
    SCM_DO_BUILD_DURING_DEPLOYMENT=true

# ── DEPLOY API ────────────────────────────────────────────────────────────────
Write-Host "`n[6/8] Deploying API..."
Compress-Archive -Path "api" -DestinationPath "api_deploy.zip" -Force
az webapp deploy `
  --name $APP_NAME `
  --resource-group $RG `
  --src-path "api_deploy.zip" `
  --type zip
Remove-Item "api_deploy.zip"

$API_URL = "https://$APP_NAME.azurewebsites.net"
Write-Host "API live at: $API_URL"

# ── STATIC WEB APP ────────────────────────────────────────────────────────────
Write-Host "`n[7/8] Creating Static Web App (will open browser for GitHub auth)..."
az staticwebapp create `
  --name $STATIC_APP `
  --resource-group $RG `
  --source $GITHUB_REPO `
  --location $LOCATION `
  --branch $BRANCH `
  --app-location "admin/src" `
  --output-location "dist" `
  --login-with-github

$STATIC_HOSTNAME = az staticwebapp show `
  --name $STATIC_APP `
  --resource-group $RG `
  --query "defaultHostname" -o tsv
$STATIC_URL = "https://$STATIC_HOSTNAME"
Write-Host "Dashboard live at: $STATIC_URL"

# ── FINALIZE ──────────────────────────────────────────────────────────────────
Write-Host "`n[8/8] Updating ALLOWED_ORIGINS and restarting API..."
az webapp config appsettings set `
  --name $APP_NAME `
  --resource-group $RG `
  --settings `
    ALLOWED_ORIGINS=$STATIC_URL `
    KEYSPY_SERVER_URL=$API_URL

az webapp restart --name $APP_NAME --resource-group $RG

# ── DONE ──────────────────────────────────────────────────────────────────────
Write-Host "`n✅ Deployment complete!"
Write-Host "   API:       $API_URL"
Write-Host "   Dashboard: $STATIC_URL"
Write-Host "`n⚠  One manual step remaining:"
Write-Host "   Go to https://github.com/yairMeshner/yangard/settings/secrets/actions"
Write-Host "   Add secret:  VITE_API_URL = $API_URL"
Write-Host "   Then re-run the GitHub Actions workflow to rebuild the frontend."
