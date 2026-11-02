# For Aditi — a cinematic birthday story

A responsive, single-page birthday surprise built with React and Vite. It includes the midnight blackout story, a local photo gallery, interactive cake and confetti, a live age counter, a typewriter letter, and a replayable intro.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`; preview it with `npm run preview`.

## Aditi's photo archive

The four photos supplied in `aditi_birthday_photos.pdf` are included as the original extracted JPEGs in `public/photos/` and are displayed in the story gallery. They are not AI-generated or retouched; the editorial frames preserve their full portrait composition. Captions playfully nod to the story-screenshot investigation.

The gallery also accepts extra images: choose **Add another photo** or drag files onto it. Those additional selections are shown from temporary browser object URLs only; they are not uploaded or persisted. Only use images you have permission to share. No stock photos or external image URLs are included.

## Deploy

Deploy to Netlify or Vercel using the default Vite settings: build command `npm run build`, output directory `dist`.

The ambient soundtrack is synthesized locally with the Web Audio API; no audio file or third-party service is needed. The experience respects the visitor's reduced-motion preference.
