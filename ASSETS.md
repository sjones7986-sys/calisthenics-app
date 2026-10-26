# Exercise visuals: adding files safely

The app contains 39 workout slots using 36 unique visuals: 12 warmups, 12 circuit/recovery visuals, and 12 cooldowns. Incline push-ups, glute bridges, and chair/box squats share assets across days. Saturday and Sunday have no timed workout or visual tile. All 36 already have an inline SVG illustration. No new video or PNG has been supplied in this change.

## Folder and file names

- `assets/manifest.js`: the editable asset map loaded before the app script.
- `assets/animations/<file-stem>.mp4`: optional looping video.
- `assets/images/<file-stem>.png`: optional static fallback image.
- `index.html.html`: existing app, retained under its current filename.

Use lowercase letters, digits, and hyphens. Names are case-sensitive on hosting. Keep paths relative (no leading slash) so they also work under a GitHub Pages repository URL. The empty `.gitkeep` files simply keep folders visible in GitHub; leave or remove them after uploading assets.

## Add your first animation

1. Open `assets/manifest.js` on GitHub and find `armCircles`. Its filenames are `assets/animations/arm-circles.mp4` and `assets/images/arm-circles.png`.
2. Open each folder in GitHub, choose **Add file → Upload files**, and upload the matching files. Use those exact filenames, with no spaces or duplicate extensions.
3. Edit the `armCircles` entry: change `animationReady` to `true` only after uploading and checking the MP4. Change `imageReady` to `true` only after uploading and checking the PNG. Keep each flag `false` for a file you do not have. Commit the edit.
4. Open the app and select Monday → Start Workout. Arm Circles should show the new animation. Pause and Resume should stop and start the visual as well as the timer.
5. Turn on your device's Reduce Motion setting and reload. The static PNG should appear. Without a PNG, the existing SVG is frozen in a single pose.
6. To disable a bad asset immediately, set its Ready flag back to `false`. Do not delete the workout or its inline illustration.

No package install, API key, account, or build process is needed. Upload one exercise at a time before adding the rest. The manifest is JavaScript rather than fetched JSON so the app also works when opened directly from a downloaded folder.

## Entry fields and fallback order

Each entry has `names` (workout display names), `usedBy` (day/phase inventory), `animation` and `image` (reserved filenames), independent Ready flags, `label` (a plain-language movement description), and `inlineSvg` (the existing SVG library key). The workout's existing `svg` value is the stable lookup key; do not rename it when changing a display name. When adding a new workout, add its manifest entry and either an inline SVG or a static PNG too. Update `usedBy` when moving exercises; it is documentation, not timer logic.

The tile shows the existing illustration immediately while media loads. An enabled, playable MP4 replaces it when ready. Missing, corrupt, unsupported, blocked, or slow video falls back to an enabled PNG; a missing or broken PNG leaves the inline SVG visible. If the manifest or entry is missing, the app uses the workout's own SVG. If no matching SVG exists, it shows an explicit text message and retains the exercise name and form cue. It never substitutes an unrelated exercise.

A video load gets eight seconds before falling back. Only the current exercise's media is loaded, never the whole library. Disabled files generate no requests. The same visual remains mounted across one-second timer updates. Playback pauses during workout Pause, rest, completion, and return home. Reduced Motion skips video entirely and freezes the inline fallback; changing the setting during a workout updates the tile. The tile has an accessible label using the current exercise name plus `label`, and references the visible form cue. Nested imagery is hidden from screen readers to avoid duplicate announcements.

## Artistic style and export contract

Keep the existing flat illustrated character: warm brown skin, short dark hair, navy shirt, olive shorts, light shoes, simple rounded shapes, and restrained shading. Use the existing inline SVG for each movement as the reference. Keep the dark navy tile (`#112236`) and the app's blue, green, and purple phase accents. Do not switch to photos or a different character. This change preserves the repository artwork; it does not claim a separate PDF comparison.

Export silent H.264 MP4 with a broadly compatible pixel format such as `yuv420p`, plus a real static PNG from the same artwork. MP4 is deliberate: it can be paused, unlike a GIF. GIF, animated WebP, external URLs, and Lottie JSON are not supported by this minimal loader. For this small square tile, use a square canvas (for example 512 × 512), contain the complete figure and equipment with padding, and preserve the artwork proportions. Video should have an opaque dark background; a PNG may be transparent. Aim for a smooth 2–6 second repeat and under 2 MB per video. A hold or breathing sequence can be longer. Avoid abrupt cuts and flashing. The visual loop illustrates form; it does not control reps, timer, or side-switch cues.

Before marking a file ready, review the full range of motion, stable support equipment, both sides where applicable, and alignment with the written cue. The current “Forearm Plank + Side Taps” cue does not specify which limb taps; resolve that detail before commissioning its replacement animation.

## Complete inventory

Every row reserves both `assets/animations/<file-stem>.mp4` and `assets/images/<file-stem>.png`. All Ready flags start `false`; all rows currently fall back to their existing inline illustrations.

| Stable key | Workout names | Day/phase | File stem |
| --- | --- | --- | --- |
| armCircles | Arm Circles | monday/warmup | arm-circles |
| crossChest | Cross-Chest Swings | monday/warmup | cross-chest |
| catCow | Cat-Cow Stretch | monday/warmup | cat-cow |
| inclinePushUp | Incline Push-Ups | monday/circuit, thursday/circuit | incline-push-up |
| deadBug | Dead Bugs | monday/circuit | dead-bug |
| gluteBridge | Glute Bridges | monday/circuit, friday/circuit | glute-bridge |
| doorwayStretch | Doorway Chest Stretch | monday/cooldown | doorway-stretch |
| childsPose | Child's Pose | monday/cooldown | childs-pose |
| cobraStretch | Cobra Stretch | monday/cooldown | cobra-stretch |
| legSwings | Leg Swings | tuesday/warmup | leg-swings |
| hipHinge | Bodyweight Hip Hinge | tuesday/warmup | hip-hinge |
| ankleRolls | Ankle Rolls | tuesday/warmup | ankle-rolls |
| chairSquat | Box / Chair Squats, Box Squats | tuesday/circuit, friday/circuit | chair-squat |
| forearmPlank | Forearm Plank | tuesday/circuit | forearm-plank |
| stepBackLunge | Step-Back Lunges | tuesday/circuit | step-back-lunge |
| quadStretch | Standing Quad Stretch | tuesday/cooldown | quad-stretch |
| seatedHamstring | Seated Hamstring Reach | tuesday/cooldown | seated-hamstring |
| hipFlexorStretch | Kneeling Hip Flexor Hold | tuesday/cooldown | hip-flexor-stretch |
| thoracicRotation | Thoracic Rotations | wednesday/circuit | thoracic-rotation |
| hipOpener | Gentle Hip Openers | wednesday/circuit | hip-opener |
| walking | Steady Walking | wednesday/circuit | walking |
| thoracicWindmill | Thoracic Windmills | thursday/warmup | thoracic-windmill |
| scapSqueezes | Scapular Squeezes | thursday/warmup | scap-squeezes |
| reachExtension | Reach & Extension | thursday/warmup | reach-extension |
| inclineRow | Incline Doorway Rows | thursday/circuit | incline-row |
| birdDog | Bird-Dog | thursday/circuit | bird-dog |
| latStretch | Lat & Side Stretch | thursday/cooldown | lat-stretch |
| trapStretch | Upper Trap Release | thursday/cooldown | trap-stretch |
| threadNeedle | Thread-the-Needle | thursday/cooldown | thread-needle |
| jumpingJacks | Gentle Jumping Jacks | friday/warmup | jumping-jacks |
| torsoRotation | Torso Rotations | friday/warmup | torso-rotation |
| squatReach | Bodyweight Squat Reach | friday/warmup | squat-reach |
| plankSideTap | Forearm Plank + Side Taps | friday/circuit | plank-side-tap |
| figure4Stretch | Figure-4 Glute Stretch | friday/cooldown | figure4-stretch |
| calfStretch | Standing Calf Stretch | friday/cooldown | calf-stretch |
| deepBreathing | Deep Diaphragmatic Breaths | friday/cooldown | deep-breathing |

## Security and local checks

Use media files you created or trust. The loader accepts only the documented local MP4/PNG paths, uses DOM properties for external media and labels, and adds no third-party scripts or remote media requests. The manifest itself is executable JavaScript: review changes to it like any other code and do not paste untrusted scripts. Never upload passwords, GitHub tokens, or private health details. Existing completion history stays in browser local storage; this change adds no data collection. These are scoped safeguards, not a full security audit of the existing app.

Download the repository ZIP and extract the entire folder, then open `index.html.html` in your browser. For a local HTTP preview, with Python installed, run `python -m http.server 8000` inside the project folder, then open `http://localhost:8000/index.html.html`; stop with Ctrl+C. Keep the `assets` directory beside the HTML. GitHub's source-code page is not the running app. A default GitHub Pages homepage normally expects `index.html`; renaming the existing file and configuring deployment are separate steps.

Check one warmup, circuit, and cooldown; the shared chair-squat mapping on Tuesday and Friday; a missing MP4; a missing PNG; reduced motion; Pause/Resume; and return home. None should leave a broken-image icon or reset an animation every second. If an MP4 fails, verify the exact name, Ready flag, codec, and browser console. Avoid changing timer code while troubleshooting media.
