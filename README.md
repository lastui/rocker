# Rocket

Separate your UI into functional domains and requse precompiled code in different products and usecases.

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

A: nope code splitting (even React.lazy and React.suspense) are approaches to top-down separation of big SPA into smaller chunks, because its top-down you cannot reuse any chunks generated from this approach in other products.

---

Q: What does this have to do with docker

A: Docker (or for example Mesos) are bottom up approaches of functionality composition where you declare functional chunks (docker images) that are then orchestrated via some context (manifest) and then executed in some layer between native runtime and world. This is same thing just in UI. Layer between browser and user enabling code hot-swapping and declarative composition with dependencies, interactions and all that non static fun stuff.

---

Q: Do I need something like this?

A: Probably not if you have single SPA that compiles into one monolith. But if your "SPA" is starting to grow out of control so that changes are painfull, blocking, linear and volatile and you want to split that into give 100 or 1000 distinct features, get rid of hardcoded bussiness logic and enable parallelism in your development and deployment. Then yup, you should try this (check examples repo for some usual scenarios).

---

Q: I noticed that dependencies are part of platform code, can I supply mine

A: Yes, but you need to contain them into single chunk (module) that you will compile, and you are locked into versions of react, redux, ... that is provided by platform. Imagine it like Android OS or iOS, your modules have some features and essentials provided and both runtime and functionality musi reference these same essential instances. You can control your module compatibility by using appropriate version of `@lastui/rocker` platform. And you can bundle any necessary dependencies if you'll need into your modules. JavaScript does not have SPIs and DLLs are functionaly closes stable thing for that bottom-up compilation usecase.

---

Q: Whats with the name

A: Rocket like [D]ocker for [R]eact UIs
