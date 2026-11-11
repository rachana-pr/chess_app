# PROJECT: CHESSVERSE — PREMIUM CROSS-PLATFORM 3D CHESS PLATFORM

## ROLE

Act as a principal software architect, senior full-stack developer, Three.js engineer, 3D game developer, chess engine specialist, mobile application engineer, and premium UI/UX designer.

Your task is to design and develop a production-quality, cross-platform 3D chess application called CHESSVERSE.

This is not a basic chess website. It is an immersive chess gaming platform that combines realistic physical chess experiences with fantasy and futuristic gaming environments.

The application must work on desktop, laptop, tablet, and mobile devices.

Build an actual functioning product, not just a visual prototype.

# 1. PRODUCT VISION

Create one chess application with two primary visual experiences.

MODE A: REALISTIC CHESS

Create a realistic physical chess experience featuring:
- Detailed wooden chessboards.
- Marble chessboards.
- Glass chessboards.
- Metallic chess pieces.
- Realistic Staunton chess pieces.
- Natural lighting and shadows.
- Reflections and physically based materials.
- Premium indoor environments.
- Cinematic camera perspectives.

The experience should feel like playing on a real luxury chessboard.

MODE B: FANTASY CHESS

Create a fantasy gaming experience featuring:
- Futuristic chessboards.
- Neon glowing chess pieces.
- Magical chess arenas.
- Fantasy-inspired chess environments.
- Animated visual effects.
- Atmospheric lighting.
- Glowing movement trails.
- Cinematic game transitions.
- Custom fantasy piece designs.

The experience should feel like playing chess inside a premium 3D video game.

Both modes must use the same chess rules, gameplay engine, player system, and multiplayer architecture.

# 2. TECHNOLOGY ARCHITECTURE

Use the following preferred stack:

FRONTEND:
- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- Framer Motion.

3D ENGINE:
- Three.js.
- React Three Fiber.
- Drei.
- GLTF/GLB 3D assets.
- Physically Based Rendering materials.

CHESS ENGINE:
- Chess.js for complete chess rules.
- Stockfish WebAssembly for AI.
- Web Workers for non-blocking AI calculations.

BACKEND:
- Supabase Authentication.
- PostgreSQL database.
- Supabase Realtime.
- Supabase Storage.

MOBILE:
- Responsive web application.
- Progressive Web App support.
- Capacitor packaging for Android and iOS.

Use clean architecture, reusable components, modular services, and strict TypeScript types.

Do not tightly couple the chess engine with the rendering engine.

# 3. APPLICATION STRUCTURE

Create these main application sections:

1. Landing Page.
2. Main Dashboard.
3. Play Chess.
4. Play Against AI.
5. Online Multiplayer.
6. Local Multiplayer.
7. Chess Theme Studio.
8. Player Profile.
9. Game History.
10. Settings.

The home screen should look premium, modern, and immersive.

Use an animated 3D chessboard preview as the main visual centerpiece.

# 4. 3D CHESS ENGINE

Create a genuine 3D chessboard.

BOARD:
- 8x8 grid.
- Individual 3D square geometry.
- Accurate chessboard proportions.
- Realistic bevels and edges.
- High-quality materials.
- Proper board coordinates.
- Correct orientation for both players.

PIECES:
- King.
- Queen.
- Rook.
- Bishop.
- Knight.
- Pawn.

Use properly modeled 3D chess pieces.

Support GLTF/GLB models and allow different piece models for different themes.

The pieces must:
- Be selectable.
- Be draggable.
- Move smoothly.
- Have proper positioning.
- Animate captures.
- Support promotions.
- Cast realistic shadows.

Implement legal move indicators, selected-piece highlights, previous-move highlights, and check indicators.

# 5. 360-DEGREE CAMERA SYSTEM

This is a signature feature.

Implement a professional interactive camera system.

Requirements:
- Full 360-degree horizontal rotation.
- Vertical camera angle adjustment.
- Smooth zoom.
- Mouse drag controls.
- Touch drag controls.
- Pinch-to-zoom on mobile.
- Smooth camera interpolation.
- Camera reset.
- Predefined camera perspectives.

Provide the following camera presets:
- Default.
- Front.
- Side.
- Top.
- Cinematic.
- Player perspective.

Use OrbitControls or an equivalent custom camera controller.

The camera should maintain focus on the chessboard and respect safe rotation limits.

Do not allow camera controls to interfere with selecting and moving chess pieces.

Add a dedicated camera control interface that can be hidden when not needed.

# 6. ADVANCED THEME STUDIO

Build a fully functional theme customization system.

BOARD THEMES:
- Classic Oak.
- Dark Walnut.
- White Marble.
- Black Marble.
- Glass.
- Gold Luxury.
- Carbon Fiber.
- Futuristic Neon.
- Crystal.

PIECE THEMES:
- Classic Staunton.
- Modern Minimal.
- Gold and Silver.
- Metallic.
- Fantasy.
- Futuristic.
- Crystal.

ENVIRONMENTS:
- Luxury Chess Room.
- Medieval Castle.
- Futuristic Arena.
- Space Station.
- Minimal Studio.
- Outdoor Garden.
- Fantasy Temple.

LIGHTING PRESETS:
- Daylight.
- Warm Sunset.
- Dramatic Night.
- Cinematic.
- Neon.
- Fantasy Glow.

Allow users to combine board, pieces, environment, and lighting independently.

Include:
- Theme preview.
- Apply theme.
- Reset theme.
- Save favorite combinations.
- Persistent user preferences.

Theme switching should update actual 3D assets, materials, and lighting, not just the CSS background.

Load theme assets efficiently and avoid unnecessary reloading.

# 7. COMPLETE CHESS GAMEPLAY

Implement complete standard chess rules through Chess.js.

Features:
- Legal move validation.
- Check.
- Checkmate.
- Stalemate.
- Castling.
- En passant.
- Pawn promotion.
- Threefold repetition.
- Fifty-move draw rule.
- Insufficient material.
- Undo.
- Restart.
- Move history.
- Algebraic notation.
- Captured pieces.
- Chess clocks.
- Resignation.
- Draw offers.

Never allow illegal moves.

Ensure the 3D board is always synchronized with the actual chess game state.

# 8. AI CHESS OPPONENT

Integrate Stockfish using WebAssembly.

Create five difficulty levels:
- Beginner.
- Easy.
- Medium.
- Hard.
- Expert.

Allow the user to:
- Choose white or black.
- Select AI difficulty.
- Start a new game.
- Pause where appropriate.
- Restart.
- Review moves.

Run AI calculations in Web Workers.

Do not block the main UI or 3D rendering while the AI is thinking.

# 9. MULTIPLAYER

Create two multiplayer experiences.

LOCAL MULTIPLAYER:
- Two players on the same device.
- Player color selection.
- Chess clock.
- Restart and undo controls with appropriate local-game rules.

ONLINE MULTIPLAYER:
- User authentication.
- Create private room.
- Join room using room code.
- Invite another player.
- Online matchmaking.
- Player presence.
- Live move synchronization.
- Chess clocks.
- Reconnection support.
- Resignation.
- Draw requests.
- Game results.

Implement server-authoritative move validation.

Use a persistent game record and prevent duplicate or out-of-order moves.

Do not simulate online multiplayer using local state or fake opponent moves.

# 10. USER ACCOUNTS AND PROFILES

Build user registration and login.

Support:
- Email authentication.
- Google authentication where configured.
- Usernames.
- Profile avatars.
- Player statistics.
- Win/loss/draw records.
- Game history.
- Preferred themes.
- Settings.

Use Supabase securely.

Implement Row Level Security for user data.

Never expose service-role credentials in frontend code.

# 11. PREMIUM UI/UX

Create a modern gaming interface.

DESIGN LANGUAGE:
- Premium.
- Sophisticated.
- Cinematic.
- Immersive.
- Minimal.
- Responsive.

Use:
- Dark and light interface options.
- Elegant typography.
- Glassmorphism where appropriate.
- Subtle gradients.
- Smooth transitions.
- High-quality icons.
- Clean spacing.
- Responsive navigation.

Do not overload the interface with buttons.

The 3D chessboard must remain the primary focus during gameplay.

# 12. MOBILE EXPERIENCE

Optimize specifically for mobile.

Requirements:
- Responsive layouts.
- Touch-friendly controls.
- Mobile camera rotation.
- Pinch-to-zoom.
- Drag-and-drop pieces.
- Compact move history.
- Mobile theme selector.
- Performance optimization.
- Portrait and landscape support.

Ensure the chessboard is usable on smaller screens.

Use touch interaction handling that distinguishes piece movement from camera rotation.

# 13. SOUND AND IMMERSIVE EFFECTS

Implement optional sound effects:
- Piece selection.
- Piece movement.
- Capture.
- Check.
- Checkmate.
- Game start.
- Game end.

Create different sound profiles for realistic and fantasy themes.

Allow users to mute sounds and adjust volume.

Avoid excessive visual effects that distract from gameplay.

# 14. PERFORMANCE AND OPTIMIZATION

Optimize for desktop and mobile.

Implement:
- Lazy loading of 3D assets.
- Texture compression.
- Efficient geometry reuse.
- Instancing where suitable.
- Adaptive rendering quality.
- Shadow quality settings.
- Device-aware performance profiles.
- Proper disposal of Three.js resources.
- Web Workers for expensive calculations.
- Loading indicators and error handling.

Do not sacrifice chess functionality for graphical effects.

# 15. PROJECT ARCHITECTURE

Organize code into separate modules:

- components/
- pages/
- features/
- chess/
- three/
- themes/
- multiplayer/
- auth/
- services/
- hooks/
- stores/
- assets/
- types/
- utils/
- tests/

Separate:
- Chess rules.
- Game state.
- 3D rendering.
- Camera controls.
- Theme management.
- Authentication.
- Multiplayer communication.
- UI components.

Use clean interfaces between these modules.

# 16. DEVELOPMENT PROCESS

Before implementing the project:

1. Inspect the development environment.
2. Analyze the requirements.
3. Create a complete architecture plan.
4. Create a component breakdown.
5. Identify dependencies.
6. Create a phased implementation roadmap.
7. Identify technical risks.

Then implement the project incrementally.

PHASE 1:
Build the core responsive application and a working 3D chessboard.

PHASE 2:
Implement chess rules, movement, animations, and camera controls.

PHASE 3:
Implement realistic and fantasy visual modes.

PHASE 4:
Build the theme customization studio.

PHASE 5:
Integrate Stockfish AI.

PHASE 6:
Implement local and online multiplayer.

PHASE 7:
Implement user accounts and profiles.

PHASE 8:
Optimize desktop and mobile performance.

PHASE 9:
Perform complete testing and quality assurance.

At the end of each phase:
- Run the application.
- Test implemented features.
- Fix errors.
- Update documentation.
- Preserve previously working features.

# 17. ACCEPTANCE CRITERIA

The finished product must satisfy these conditions:

1. The application launches successfully.
2. The chessboard is genuinely 3D.
3. All six types of chess pieces are modeled.
4. The camera supports full 360-degree rotation.
5. Camera zoom works.
6. Piece movement is animated.
7. Both realistic and fantasy modes work.
8. Themes update actual 3D assets and materials.
9. Chess rules are correct.
10. AI gameplay works.
11. Local multiplayer works.
12. Online multiplayer works when backend services are configured.
13. Authentication works when credentials are configured.
14. Mobile interactions work.
15. The application does not have broken buttons or major console errors.

Do not claim features are completed until they have been implemented and tested.

# FINAL INSTRUCTION

Prioritize a beautiful, functional, immersive chess experience.

Do not build a static mockup.

Do not use 2D images as substitutes for 3D chess pieces.

Do not fake multiplayer, AI, or chess movement.

Use real chess logic, real 3D geometry, real camera controls, and real backend integration.

Begin by creating the architecture plan and then build the first working milestone.

Make sensible engineering decisions independently, document them, and avoid asking for approval for every minor implementation detail.