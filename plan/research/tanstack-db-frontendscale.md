source : https://frontendatscale.com/blog/tanstack-db/

# An Interactive Guide to TanStack DB | Frontend at Scale

A bit over a month ago, the TanStack team welcomed the newest member to its family: [TanStack DB](https://tanstack.com/db).

And as I often do whenever I learn about a new TanStack library, I dropped everything I was doing and went straight to the docs to learn more about it:

> TanStack DB is a reactive client store for building super fast apps on sync. Built on a [Typescript implementation of differential dataflow](https://github.com/electric-sql/d2ts), TanStack DB gives you real-time sync, live queries and local writes. With no stale data, super fast re-rendering and sub-millisecond cross-collection queries — even for large complex apps.

All this looked really exciting. I mean, who doesn’t want super fast re-rendering and sub-millisecond cross-collection queries?

But… I still had a lot of questions.

_“So is TanStack DB a sync engine? A state management tool? A database like MySQL? An ORM like Prisma? Or something else entirely? Also, what on earth is a differential dataflow?”_

To better understand how TanStack DB works, I spent the last week playing around with it and I put all of my learnings together in this article—along with some nice visualizations that will hopefully help clear things up and distract you from how terrible some of the jokes are.

So I hope you’ll _join me_ in this journey (that was a database pun. I did warn you about the jokes, didn’t I?) to understand what TanStack DB is, how it works, and how we can unlock all of its power.

Let’s dive right in.

## Where TanStack Query Falls Short

[Where TanStack Query Falls Short](#where-tanstack-query-falls-short)

TanStack DB was designed to fill some of the gaps in TanStack Query, so one of the best ways to see what it brings to the table is to compare it with a Query implementation.

Let’s take this simple Todo app as an example:

You can click around the app to see how it works, but it’s pretty straightforward: we have a list of projects, some of which can be “favorited”, and each project has a list of todos, which can be completed or not.

To keep things simple, our app doesn’t allow users to add or remove todos, so I guess they’re doomed to completing the same tasks over and over. Hey, I never said it was a _good_ todo app.

Okay, I can see there are some raised eyebrows in the room. You, sir, in the back, what’s on your mind?

“A todo app? Booooring! Wasn’t there a more interesting example?

Boo this man! **Booooo!**”

I know, I know! _I’m sorry, OK?_

I promise a todo app is a good example, though. Just bear with me for the next few paragraphs and you’ll see what I mean.

We have a couple of API endpoints at our disposal to get the data we need to render our app:

`GET /projects`, which gives us the list of projects, including whether they’re a “favorite” project or not.

GET /projects

```
[
  { id: 1, name: "Family", isFavorite: true },
  { id: 2, name: "Work", isFavorite: true },
  { id: 3, name: "Home", isFavorite: false },
  { id: 4, name: "Blog", isFavorite: false },
  ...
]
```

And `GET /todos` which gives us the list of todos, including which projects they belong to, and whether or not they’re completed.

GET /todos

```
[
  { id: 1, name: "Call mom", completed: false, projectId: 1 },
  { id: 2, name: "Plan summer trip", completed: true, projectId: 1 },
  { id: 3, name: "Buy birthday present", completed: true, projectId: 1 },
  { id: 4, name: "Review PRs", completed: false, projectId: 2 },
  { id: 5, name: "Draft spec doc", completed: false, projectId: 2 },
  ...
]
```

“Hmm. I see you’re getting all todos for all projects in a single request, but that’s not too _web-scale_, is it? What if I have literally a million things to do?”

That’s a good point, suspicious developer. As my friend C likes to say, “You’re absolutely right!”

In this example, we’re indeed getting all the todos for all projects in a single request. We can get away with that because we’re dealing with only a handful of items, but in a real application where we might be dealing with dozens of projects and hundreds of items per project, we’d probably want to fetch them on a per-project basis. We’ll come back to this point in a minute.

We also have a `PATCH /todos/{id}` endpoint that we’ll use to toggle the completed status of a todo.

Alright, let’s see how we can implement this app with TanStack Query. To do that, we’ll need a few pieces.

We’re using React in this example, so you’ll see some React-specific code like `useQuery` and `useMutation`. If React is not your cup of tea, don’t worry. TanStack Query and TanStack DB support Vue, Solid, and Svelte as well.

First, we’ll need to define one `query` per model to get the data from the API:

App.tsx

```
import { useQuery } from "@tanstack/react-query";

// ...

const { data: projects } = useQuery({
  queryKey: ["projects"],
  queryFn: async () => {
    const res = await fetch("/api/projects");
    return res.json();
  },
});

const { data: todos } = useQuery({
  queryKey: ["todos"],
  queryFn: async () => {
    const res = await fetch("/api/todos");
    return res.json();
  },
});

// ...
```

And we’ll also need to define one `mutation` per action the user can take. For instance, here’s the mutation to mark a todo item as completed:

App.tsx

```
import { useMutation } from "@tanstack/react-query";

// ...

const { mutate: updateTodo } = useMutation({
  mutationFn: async (todo: Todo) => {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      body: JSON.stringify(todo),
    });
    return res.json();
  },
  onSuccess: () => {
    // Invalidate the todos query to refetch the updated list
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});

// ...
```

This is a pretty clean implementation, if you ask me. And more importantly, by using TanStack Query we’re getting a ton of sweet features essentially for free: smart cache management, automatic retries, background refetching, super cool devtools, and much more.

So what’s wrong with it? You might ask. Well, nothing is wrong. This is more than enough for the little todo app we’re building. But depending on how the app scales and evolves over time, we might run into some of Query’s limitations.

One of those limitations is that **there is no relationship between our models**. The data for our projects and todos live in isolated caches, so if we wanted to mix and match them somehow, we don’t have an easy way to do it.

Imagine we wanted to add a feature to our app that shows **uncompleted todos for all of our favorite projects**. To do that, we’d need to do some manual joining and filtering like the following:

App.tsx

```
const uncompletedFavoriteTodos = todos
  .filter((todo) => !todo.completed)
  .filter((todo) =>
    projects.some(
      (project) => project.id === todo.projectId && project.isFavorite
    )
  );
```

This isn’t terrible on a small scale, but with hundreds or thousands of items, it could become a performance bottleneck. Not to mention that **this approach would only work with our strategy of fetching _all todos for all projects_ every time.** If we ever switch to fetching todos on a per-project basis, this would no longer be an option.

A more sensible approach in this case would be to do the filtering on the backend—expose a new `GET /favorite-todos` endpoint and use it to power the new feature. This is a good option, but:

- a) it’s more work on the backend
- b) it increases complexity on the frontend as well, since it require us to maintain a new `query` with its own cache which will likely contain duplicated data from other queries, and
- c) we’re still not off the hook when it comes to re-renders: as todos get completed, we still need to do some filtering client-side so that we only show the uncompleted ones, which can trigger re-renders in unexpected parts of our app.

We’re only talking about a single teeny-tiny feature here. Let’s say our todo app is a big success (unlikely, I know, but one can dream) and we wanted to add some new features to it:

- A **counter** next to a project’s name in the sidebar to show how many uncompleted todos each project has.
- **Tags** for todos, and the ability to filter by one or many of them.
- **Due dates** for todos, and the ability to see what todos are due today/this week.
- The ability to **add new todos** (finally!)

Every new feature we add to the app comes with the same challenges. We have to decide whether the business logic should live on server or the client (that is, if we have the data available), and deal with the consequences of managing changing client-state (i.e. deriving state in the right places, keeping re-renders in check, memoization, and so on.)

The other big limitation of TanStack Query has to do with **optimistic updates**.

As you might have noticed, the todo app demo you played with above is not a _real_ app. The data is all stored in memory, so it doesn’t make any requests anywhere.

_This_ is how our app would look if it were saving the data in a remote database. Try clicking a todo item in the demo below:

That doesn’t feel great, does it? It’s not too big of a delay (it’s less than a second), but the fact that the items don’t update immediately after checking them off is very unsatisfying.

The reason for the delay is that our current implementation is not optimistic—after the user checks a todo item, the UI has to wait for not one, but _two_ requests to complete before updating itself: the `PATCH` request that updates the todo, and the `GET` request that brings us the updated list.

Here’s a step by step breakdown of what’s happening:

This is an interactive diagram ✨

Click one of the todo items to get started.

Clicking an item on the todo list kicks off a TanStack Query mutation.

The mutation kicks off a PATCH request to the server.

The backend then updates the todo item in the database.

The mutation also invalidates the query cache for the todo list.

Which triggers a refetch of the todo list via a GET request, finally updating the UI.

Luckily for us, TanStack Query gives us a way to [make our update optimistic](https://tanstack.com/query/v4/docs/framework/react/guides/optimistic-updates) by hooking into various mutation callbacks. Here’s how our “update todo” mutation might look like if we wanted to make it optimistic (borrowed from the TanStack Query docs):

```
useMutation({
  mutationFn: () => { ... }, // Same as our original mutationFn
  onMutate: async (newTodo) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: ["todos", newTodo.id] });

    // Snapshot the previous value
    const previousTodo = queryClient.getQueryData(["todos", newTodo.id]);

    // ⭐ Optimistically update to the new value
    queryClient.setQueryData(["todos", newTodo.id], newTodo);

    // Return a context with the previous and new todo
    return { previousTodo, newTodo };
  },
  // If the mutation fails, use the context we returned above
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(
      ["todos", context.newTodo.id],
      context.previousTodo
    );
  },
  // Always refetch after error or success:
  onSettled: (newTodo) => {
    queryClient.invalidateQueries({ queryKey: ["todos", newTodo.id] });
  },
});
```

This isn’t a _ton_ of work, to be honest, but it _is_ a lot of boilerplate. The only line in this entire block that is unique to this specific mutation is the one marked with a ⭐ (this is the part of the mutation that is recreating the server-side logic on the client.)

The rest of the code in this example—cancelling queries, keeping the snapshot of the previous value, rolling back in case of an error, refetching after error or success—are things you’d want to do for _any_ optimistic mutation. If you have several of these across your codebase, chances are you’re going to be doing a lot of copy-pasting.

And we’re only talking about a simple example here. If we wanted to handle more advanced edge cases, like [concurrent optimistic updates](https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query), things could get a lot hairier pretty quickly.

But that’s enough talking about drawbacks and limitations (that’s not too _optimistic_ of us, isn’t it?) Let’s now finally talk about TanStack DB and see how it can help us tackle some of these challenges.

Join Frontend at Scale and get them deployed _straight into your brain_! I mean… your inbox. No spam ever, unsubscribe anytime.

## Enter TanStack DB

[Enter TanStack DB](#enter-tanstack-db)

Let’s go back to the TanStack DB definition we saw at the beginning, but let’s break it down a little bit to make it easier to digest.

TanStack DB is a **reactive client store** that _extends_ TanStack Query with three core primitives:

1.  **Collections**
2.  **Live Queries**
3.  **Transactional Mutations**

The fact that it’s _reactive_ means that our app can benefit from fine-grained state updates that minimize component re-rendering.

And the fact that it’s built on top of Query means that we get all of the benefits we talked about earlier, plus a bunch of new features thanks to these new primitives. Let’s talk about each one in a bit more detail.

### 1\. Collections

[1\. Collections](#1-collections)

Collections are **typed sets of objects** that can be populated with data. A collection can represent a table in your database, a model in your domain, or the response of an API call.

We can populate collections with data by:

- **Fetching data**, for example from a REST or GraphQL API.
- **Storing local data**, like Local Storage data or in-memory UI state.
- **Syncing data**, using a sync engine. More on this in the next section.

Click the grumpy developer to populate the collection.  
(Click again to reset.)

![Tooltip Hey](https://frontendatscale.com/tooltip-hey.svg)

The first step for adopting TanStack DB in our todo app is to define collections for our app’s models: one for projects, and one for todos. Here’s how the `todoCollection` definition looks like:

App.tsx

```
import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";

const queryClient = new QueryClient();

const todoCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await fetch("/api/todos");
      return response.json();
    },
    queryClient,
    getKey: (item) => item.id,
  })
);

// ...
```

Here, we’re using the `queryCollectionOptions` function from the `@tanstack/query-db-collection` package to set up the collection. This creates a [Query Collection](https://tanstack.com/db/latest/docs/collections/query-collection), which seamlessly integrates with TanStack Query. We’d typically use this option when _fetching_ data from a remote source, like our app’s REST API.

### 2\. Live Queries

[2\. Live Queries](#2-live-queries)

Live Queries are used to read data from collections. They’re powered by a powerful query system that we can use to filter, transform and aggregate data from collections (or from the result of other live queries, since they can be chained.)

They’re _live_ queries because they automatically update when the underlying data changes, and thanks to the differential dataflow they’re implemented with, they’re designed to be _extremely fast_—they can filter collections of hundred of thousands of elements in less than a millisecond.

This is an interactive diagram ✨

Here's an example of a live query that filters only completed todos from a collection.

Live queries have a SQL-like API, so if you’re familiar with query builders like Drizzle or Prisma, you’ll feel right at home. Here’s how a live query to get our list of todos for a particular project would look like:

App.tsx

```
import { useLiveQuery } from "@tanstack/react-db";

// ...

const projectId = getSelectedProjectId();
const { data: todos } = useLiveQuery((q) =>
  q
    .from({ todo: todoCollection })
    .where(({ todo }) => eq(todo.projectId, projectId))
);
```

Live queries have a ton of features, including the ability to _join_ multiple collections. This makes use cases that involve mixing and matching data from multiple collections a breeze to implement.

For instance, if we wanted to implement the feature to show **uncompleted todos for all of our favorite projects** using a live query, it would look something like this:

App.tsx

```
const { data: uncompletedFavoriteTodos } = useLiveQuery((q) =>
  q
    .from({ todo: todoCollection })
    .join({ project: projectCollection }, ({ todo, project }) =>
      eq(todo.projectId, project.id)
    )
    .where(({ todo }) => eq(todo.completed, false))
    .where(({ project }) => eq(project.isFavorite, true))
);
```

That’s it! No backend changes, no new endpoints, and thanks to the fine-grained reactivity of TanStack DB, no client-side performance bottlenecks. This still assumes that we’re fetching all todos for all projects in a single request, of course. We’ll see how we can handle scaling this when we talk about sync engines in the next section.

### 3\. Transactional Mutations

[3\. Transactional Mutations](#3-transactional-mutations)

To update the data in a TanStack DB Collection, we’ll have to use a mutation. These are similar to TanStack Query mutations, but with two main differences: they’re **optimistic by default** (i.e. they update the local data in the collection _first_), and they’re **transactional**, which means they can be rolled back automatically.

Collections support `insert`, `update`, and `delete` mutations, which will call the collection’s `onInsert`, `onUpdate`, and `onDelete` handlers, respectively, to update the data on the backend.

Here’s how our todo collection would look like with an added `onUpdate` handler to persist the data in the backend:

```
const todoCollection = createCollection({
  // ... other config
  onUpdate: async ({ transaction }) => {
    const { original, changes } = transaction.mutations[0];
    await fetch(`/api/todos/${original.id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    });
  },
});
```

And here’s how we would use it:

```
// Immediately applies optimistic state
todoCollection.update(todo.id, (draft) => {
  draft.completed = true;
});
```

This is a lot simpler than our TanStack Query optimistic mutation example from the previous section, but it has all of the same features: it updates the UI right away, and it rolls back the updates automatically in case of an error in the request.

Here’s a step-by-step breakdown of how it works:

This is an interactive diagram ✨

Click one of the todo items to get started.

Clicking an item on the todo list kicks off an optimistic mutation, which updates the UI (and the collection) immediately.

The mutation also kicks off a PATCH request to the server.

On a successful request, the backend updates the todo item in the database.

If there's an error, the mutation rolls back the optimistic update automatically.

When we put it all together, we can see how each of TanStack DB’s new primitives is designed to fill a specific gap in TanStack Query:

1.  **Collections** give us a way to load large amounts of typed, relational data on the client,
2.  **Live Queries** give us a way to filter and process that data incredibly fast and with less re-renders, and
3.  **Transactional Mutations** allow us to do optimistic updates with a lot less boilerplate.

And one of the nicest things about it is that we can do all of this without changing _anything_ about how our backend layer and APIs are designed.

But we can take things further. So far, we’ve seen how TanStack DB works with a traditional REST API, as a drop-in replacement for Query. But if we want to turn things up to eleven, we have to option of _going full-sync_.

## Going Further with Real-Time Sync

[Going Further with Real-Time Sync](#going-further-with-real-time-sync)

TanStack DB was designed to work seamlessly with sync engines. If you’re not familiar with sync engines, you can think of them as components that sit between your database and your different clients, making sure your data is always in sync.

If you’ve used web apps like Linear or Figma and noticed the snappy, native, multi-player, real-time feel they have, you’ve experienced the magic of a sync engine in action.

By pairing TanStack DB with a sync engine on the backend, we get some additional benefits, such as:

1.  **Out-of-the-box real-time:** sync engines keep our data in sync _at all times_. Any time the data changes, those changes are streamed to all other clients automatically. No need to fire and handle real-time events manually.
2.  **Automatic side-effects:** backend mutations are pushed automatically to the client. With a sync engine, our database is the source of truth, so anytime it changes (no matter how it changed), clients will be notified about it.
3.  **Efficiently loading tons of data:** with a sync engine, we can ask for only the subset of data that changed. This means we can load tons of data client-side and then keep it updated without having to download the entire thing on every page-load.

This last point deserves a few more sentences. We’ve mentioned a couple of times throughout this article how the `GET /todos` endpoint our app uses, which returns _all todos for all projects_, allows us to implement a lot of the features that require filtering and processing the data entirely on the client. But as we’ve also mentioned, this would obviously not scale in a real application where the list could potentially be thousands and thousands of elements long.

This isn’t a problem when using a sync engine, though, where loading megabytes of data upfront is not only acceptable, but a best practice. Sure, the first time a user opens our app they might need to look at a splash screen for a few seconds while the data is downloaded, but on any subsequent requests and visits, they’d only need to download **the data that changed**.

The specifics of how we could hook up TanStack DB to a sync engine will depend entirely on which sync engine we’re using. As of this writing, TanStack DB natively supports the [ElectricSQL](https://electric-sql.com/) and [TrailBaze](https://trailbase.io/) sync engines, but we can expect support for additional engines in the future (Firebase support is being worked on [at the moment](https://github.com/TanStack/db/pull/323).)

Let’s say we wanted to bring some of this real-time sync sweetness to our little todo app using the ElectricSQL engine. We’ll need to make a few changes to our app to support this.

A quick note here: ElectricSQL currently only works with [Postgres](https://www.postgresql.org/) databases, so going forward we will pretend that our todo app was using Postgres all along. (cue the astronaut pointing a gun at the other astronaut meme)

First, on the client, we have to update our Collection definitions to use the `electricCollectionOptions` function instead of `queryCollectionOptions`:

App.tsx

```
import { createCollection } from "@tanstack/react-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";

export const todoCollection = createCollection(
  electricCollectionOptions({
    id: "todos",
    shapeOptions: {
      url: "/api/electric/shape",
      params: {
        table: "todos",
      },
    },
    getKey: (item) => item.id,
    schema: todoSchema,
  })
);
```

The new option here is the `shapeOptions` object, which contains the details of the ElectricSQL [Shape](https://electric-sql.com/docs/guides/shapes) we’re interested in. The `url` attribute could be the location of an Electric server, but in our case, we’re using a proxy endpoint on our app’s backend.

The next step then is to implement this proxy endpoint on our backend. This endpoint will replace our existing `GET /todos` endpoint, and will fetch the data from the ElectricSQL engine instead of calling our database directly. It will also handle authentication and authorization.

You can find all the details about this in the [ElectricSQL docs](https://electric-sql.com/docs/guides/auth), but here’s a high-level, simplified version of what our proxy endpoint looks like:

GET /api/electric/shape

```
export async function GET(request: Request) {
  const electricUrl = new URL(`http://localhost:3000/v1/shape`);

  // Set the table server-side, not from client params
  electricUrl.searchParams.set(`table`, `todos`);

  // Authentication: verify the user is logged in
  const user = await loadUser();
  if (!user) {
    return new Response(`user not found`, { status: 401 });
  }

  // Authorization: only fetch the user's data
  electricUrl.searchParams.set(`where`, `"user_id" = ${user.id}`);

  // Fetch the data from the ElectricSQL engine
  return await fetch(electricUrl);
}
```

Finally, we have to hook up our Postgres database to Electric. Showing how to do this is beyond the scope of this article, but it’s not really that complicated. The easiest way to do this is by using the [Electric Cloud](https://electric-sql.com/product/cloud) platform (all you’ll need is your database’s connection string), but you also have the option of self-hosting Electric, and there’s a handy [Docker Compose file](https://electric-sql.com/docs/quickstart) that can get you started in just a few minutes.

At a high level, here’s how our app now works with the ElectricSQL sync engine in the mix:

This is an interactive diagram ✨

Click one of the todo items to get started.

Just as before, the mutation is optimistic and immediately updates the UI.

To update the item in the database, we use the same PATCH endpoint we've been using all along.

And the data is updated in our Postgres database.

Once the data is updated, the sync engine automatically sends the change to all other clients.

You might have noticed that there’s one thing we didn’t have to change when we adopted the sync engine—our mutations. That might not always be the case, but it’s a nice feature of engines like Electric. They treat the database as the source of truth, so they don’t care about _how_ the data was changed. We can continue using our existing `POST`, `PATCH`, and `DELETE` endpoints to mutate our data. All we have to do is change the way we read it.

## Final Thoughts

[Final Thoughts](#final-thoughts)

As I mentioned in a [recent issue of the Frontend at Scale newsletter](https://frontendatscale.com/issues/50/), the web is about to enter its sync era, and TanStack DB is one of the libraries leading the way.

My favorite thing about TanStack DB is that it doesn’t try to take over our entire frontend and backend layer as many of the alternatives do. It meets us where we are—it can be adopted incrementally, one query + mutation combo at a time, without changing anything on our backend.

And _if_ and _when_ our app is ready for some of that real-time sync magic, adopting a sync engine is only a few steps away.

### Further Reading

[Further Reading](#further-reading)

- [Stop Re-Rendering — TanStack DB, the Embedded Client Database for TanStack Query](https://tanstack.com/blog/tanstack-db-0.1-the-embedded-client-database-for-tanstack-query)
- [TanStack DB with Sync — the future of real-time UI](https://neon.com/blog/tanstack-db-and-electricsql)
- [Local-first sync with TanStack DB and Electric](https://electric-sql.com/blog/2025/07/29/local-first-sync-with-tanstack-db)
- [Sync Engines are the Future](https://www.instantdb.com/essays/sync_future)

_Thanks to [Kyle Mathews](https://x.com/kylemathews) for reviewing this article._
