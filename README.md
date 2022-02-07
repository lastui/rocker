# Rocker 🤘

Separate your UI into functional domains and reuse precompiled code in different products and use cases.

What it can do?

- lazy declarative runtime
- bottom-up composition (not top-down code splitting)
- inject / eject features and views based on context
- enable parallel streams working on black-boxed feature sets
- hot swap in production
- perform A/B tests based on telemetries
- ditch static linking and dependency hell
- test your golden assets and ship them without the need to rebundle
- navigate and pivot without loss of state
- perform routines in the background without the need for user interaction
- inductive (JIT / declarative) runtime routing 

### Q&A

Q: Wait. So this is code splitting?

A: No, code splitting (and JS module federation in general) are approaches to top-down separation of big SPA into smaller chunks because it's top-down you cannot reuse any chunks generated from this approach in other places without those places knowing about those chunks upfront. In code splitting, the main motivator is rendering speed (or asset size), not a building block of code that you can compose your workflow from.

---

Q: What does this have to do with Docker?

A: Docker (or for example Mesos) are bottom-up approaches of functionality composition where you declare functional chunks (Docker images) that are then orchestrated via some context (manifest) and then executed in some layer between native runtime and world. This is the same thing just in UI. Layer between browser and user enabling code hot-swapping and declarative composition with dependencies, interactions, and all that non-static fun stuff.

---

Q: Do I need something like this?

A: Probably not if you have a single SPA that compiles into one monolith. But if your "SPA" is starting to grow out of control so that changes are painful, blocking, linear and volatile, and you want to split that into, let's say, 100 or 1000 distinct features, get rid of hardcoded business logic, and enable parallelism in your development and deployment. Then yup, you should try this (check examples repo for some usual scenarios).

---

Q: What about "DLL hell" when introducing modularity?

A: Yes that's a valid concern, if you compile your module at one time, make incompatible changes to your runtime or dependencies and try to run the code it will gracefully crash at the level of a module. You need to keep this in mind. These updates (of dependencies or runtime) are usually planned and downstream recompilation could be automated. It's a similar use case as you compiling `.apk` with android v1 and then trying to run it on android `vx`. If it's incompatible, you need to recompile your module to match the runtime. Recompilation of runtime by itself does not break the contract between runtime and modules. But for example, changing ES5 exports and behavior change does.


---

Q: I noticed that some dependencies are part of the platform. Can I supply mine?

A: Yes, but you need to contain them into a single chunk (module) that you will compile, and you are locked into versions of react, redux, ... that is provided by the platform. Imagine it like Android OS or iOS. Your modules have some [features and essentials provided](https://github.com/lastui/dependencies) and both runtime and functionality must reference these same essential instances. You can control your module compatibility by using the appropriate version of `@lastui/rocker` platform. And you can bundle any necessary dependencies you'll need into your modules. JavaScript does not have SPIs and DLLs are the functionally closest stable thing for that bottom-up compilation use case.

---

Q: What does the name mean?

A: Rocker like [D]ocker for [R]eact UIs
