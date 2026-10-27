# Assets

Drop your perfume bottle model here as `perfume_bottle.glb`.

`index.html` loads `./assets/perfume_bottle.glb` (constant `BOTTLE_MODEL_URL`). It is
auto-scaled (`MODEL_TARGET_SIZE`), recentered and lit like the placeholder. If the file
is missing or fails to load, the glass bottle built in code is used instead.

Note: browsers block loading `.glb` files from `file://`, so serve the folder
(e.g. `npx serve .` or `python3 -m http.server`) to see a real model.
