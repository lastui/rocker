# Rocker 🤘

Separate your UI into functional domains and reuse precompiled code in different products and usecases.

What it can do?

- lazy declarative runtime
- bottom-up composition (not top-down code splitting)
- inject / eject features and views based on context
- enable parallel streams working on blackboxed feature sets
- hot swap in production
- perform A/B tests based on telemetries
- ditch static linking and dependency hell
- test your golden assets and ship them without need to rebundle
- navigate and pivot without loss of state
- perform routines on background without need for user interaction

### Q&A

Q: Wait so this is code splitting?

A: No, code splitting (and js module federation in general) are approaches to top-down separation of big SPA into smaller chunks, because its top-down you cannot reuse any chunks generated from this approach in other places without those places knowing about those chunks upfront. In code splitting the main motivator is rendering speed (or asset size) not building block of code that you can compose your workflow from.

---

Q: What does this have to do with docker

A: Docker (or for example Mesos) are bottom up approaches of functionality composition where you declare functional chunks (docker images) that are then orchestrated via some context (manifest) and then executed in some layer between native runtime and world. This is same thing just in UI. Layer between browser and user enabling code hot-swapping and declarative composition with dependencies, interactions and all that non static fun stuff.

---

Q: Do I need something like this?

A: Probably not if you have single SPA that compiles into one monolith. But if your "SPA" is starting to grow out of control so that changes are painfull, blocking, linear and volatile and you want to split that into give 100 or 1000 distinct features, get rid of hardcoded bussiness logic and enable parallelism in your development and deployment. Then yup, you should try this (check examples repo for some usual scenarios).

---

Q: What about "DLL hell" when introducing modularity 

A: Yes thats a valid concern, if you compile your module at one time, make incompatible changes to your runtime or dependencies and try to run the code it will gracefully crash at the level of module. You need to keep this in mind. These updates (of dependencies or runtime) are usually planned and downstream recompilation could be automated. Its similar usecase as you compiling .apk with androind v1 and then trying to run it on android vx. If its incompatible, you need to recompile your module to match the runtime. Recompilation of runtime by itself does not break contract between runtime and modules, es5 exports and behaviour change does.

---

Q: I noticed that some dependencies are part of platform, can I supply mine

A: Yes, but you need to contain them into single chunk (module) that you will compile, and you are locked into versions of react, redux, ... that is provided by platform. Imagine it like Android OS or iOS, your modules have some [features and essentials provided](https://github.com/lastui/dependencies) and both runtime and functionality musi reference these same essential instances. You can control your module compatibility by using appropriate version of `@lastui/rocker` platform. And you can bundle any necessary dependencies if you'll need into your modules. JavaScript does not have SPIs and DLLs are functionaly closes stable thing for that bottom-up compilation usecase.

---

Q: Whats with the name

A: Rocker like [D]ocker for [R]eact UIs
