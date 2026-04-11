# admin — Understanding Questions

1. What is React and why is it a good choice for a dashboard?
2. What is the difference between a component and a page in React?
3. What does "state" mean in React, and why does the UI need it?
4. How will the admin app get data from the API — what kind of request will it make?
5. What is the difference between `GET` and `POST`, and which one will the admin use to fetch events?
6. What does it mean for a React app to "re-render", and when does it happen?
7. Why do we keep the admin app in a separate folder from the API and keyspy?
8. What is a REST API, and how does the admin app communicate with it?
9. If you wanted to show events in real-time (without refreshing the page), what technology would you need?
10. What is the difference between frontend and backend in this project?

## Deployment to Azure — Understanding Questions

11. The React app is deployed to Azure Static Web Apps. What is the difference between a static web app and a server-rendered app?
12. `VITE_API_URL` is baked into the React bundle at build time. What does "baked in" mean, and why can't the app just read it at runtime like a server can?
13. When we first deployed the admin, it showed a browser popup saying "localhost is trying to connect". Why was this happening even though the admin was deployed to Azure?
14. What is GitHub Actions and how does it know to rebuild and redeploy the admin every time you push to `main`?
15. Direct navigation to `/login` returned a 404. Why does this happen with a React SPA on Azure, and what does `staticwebapp.config.json` do to fix it?
