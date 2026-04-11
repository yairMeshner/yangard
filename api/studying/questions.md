# api — Understanding Questions

1. What is FastAPI and why did we choose it over other frameworks?
2. What does `BaseModel` from pydantic do, and why is it useful?
3. What happens if the client sends a request with a missing field, like no `app` in a key event?
4. Why does `receive_events` return `{"status": "ok", "received": len(batch.events)}` instead of just `{"status": "ok"}`?
5. What is the difference between `GET` and `POST` — why do we use `POST` here?
6. What does the `/docs` endpoint give you, and how does FastAPI generate it automatically?
7. Why does `keepalive` not need a request body?
8. If two clients send events at the same time, what happens on the server?
9. What would you need to change in the server to support multiple clients (e.g. different users)?
10. What is the purpose of `received_at` in the database table?

## Deployment to Azure — Understanding Questions

11. What is Azure App Service and what problem does it solve compared to running a server on your own computer?
12. We had to use `pg8000` instead of `psycopg2-binary` on Azure Linux. Why did `psycopg2-binary` fail, and what is the fundamental difference between the two libraries?
13. The startup command was `python -m uvicorn src.server:app` but it kept failing. What does that module path mean, and why did the zip file structure break it?
14. What is a zip deployment? Why does Azure's Oryx builder require `requirements.txt` to be at the root of the zip, not inside a subfolder?
15. We added a `/api/health` endpoint that always returns HTTP 200 even when the DB is down. Why is this useful during deployment, and what would happen if the health check itself crashed?
16. Why does Azure's CLI report "Site failed to start" after 10 minutes, even when the site eventually comes up successfully? What is the difference between the CLI timeout and the actual deployment result?
17. `init_db()` uses `CREATE TABLE IF NOT EXISTS`. Why is this safe to run on every startup? What would happen if it used `CREATE TABLE` without `IF NOT EXISTS`?
18. Why do we wrap `init_db()` in a `try/except` instead of letting it crash the server if it fails?
19. What is the `SCM_DO_BUILD_DURING_DEPLOYMENT` setting in Azure App Service and why do we need it?
20. We store DB credentials (`DB_HOST`, `DB_PASSWORD`, etc.) as Azure App Service environment variables instead of committing them to the repo. Why is this important, and what is the risk of committing secrets to git?
