# The Thoroughbred Club — Competition Website Demo

Three-page responsive React/Vite website for a new thoroughbred racing syndicate. Branding, copy and imagery are illustrative placeholders pending client approval.

## Run locally

1. Install Node.js 20+.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev` and open the URL printed by Vite.
5. Run `npm run build` for production files in `dist/`.

## Connect enquiry form

The form is **demo-only until configured**; it does not send email by default. Create a form endpoint with a service such as Formspree, configure the receiving email address in that service, and add a `.env` file:

```
VITE_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

Restart the development server and test delivery. The form includes required name, email, phone and consent fields. Configure provider-side anti-spam and privacy policies before launch. Never put email passwords in frontend code.

## Edit branding and copy

- Page text, navigation and contact fields: `src/main.jsx`.
- Colours, typography, layout and image URLs: `src/style.css`.
- Page metadata: `index.html`.
- Replace illustrative stock image URLs with licensed client imagery.
- Replace the temporary club name with the actual brand.

## Deploy

For Netlify or Vercel: connect the repository, set build command `npm run build`, publish directory `dist`, and add `VITE_FORM_ENDPOINT` as an environment variable. Hash-based navigation (`#/home`, `#/about`, `#/contact`) works without server-side route rewrites. For GitHub Pages under a repository subpath, set the Vite `base` configuration to `/<repository-name>/` before building.

## Launch checklist

- Confirm actual club name, location, horse details and ownership claims.
- Replace placeholder photos with rights-cleared racing photography.
- Connect and test form delivery, spam controls and privacy notice.
- Add favicon, Open Graph image, analytics (with appropriate consent) and domain.
- For advanced per-page SEO, use static multi-page output or prerendering; the current hash-routed demo shares a base HTML metadata document.
