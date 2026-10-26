# 15-Minute Daily Calisthenics

A browser-based workout app. Open `index.html.html` from a downloaded copy of the complete repository. No installation or build step is required.

## Exercise visuals

The app maps all 39 workout slots to 36 unique visuals, including warmups, cooldowns, and active recovery. Existing illustrated animations remain available while new files are added gradually.

- **Asset map:** [`assets/manifest.js`](assets/manifest.js)
- **Upload instructions, full inventory, filenames, style, and checks:** [`ASSETS.md`](ASSETS.md)
- **Optional videos:** `assets/animations/<file-stem>.mp4`
- **Optional static images:** `assets/images/<file-stem>.png`

No new MP4 or PNG files are included yet. Upload each file and enable its Ready flag in the manifest. Missing files fall back to the existing illustration. Pause/Resume controls motion; the device's Reduce Motion setting uses a static visual.

Keep the folder structure intact. GitHub displays HTML source; to run the app locally, download and extract the ZIP and open the HTML file. See ASSETS.md for an optional local server and the existing filename's implications for GitHub Pages.

## Developer check

With Node.js installed, run `node tests/asset-contract.cjs`. It checks inventory coverage and loader behavior with simulated DOM/media events, including errors, pause, reduced motion, and stale loads. It does not verify actual browser rendering or MP4 codecs. Use the manual browser checks in ASSETS.md before enabling production media.
