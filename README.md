<p align="center">
  <img width="400" src="assets/todoist-stat.png">
  <h3 align="center">🚧 Todoist Tasks</h3>
  <p align="center">⚡️📌 Update your Todoist Tasks ✅ </p>
</p>

---

## Setup

### Prep work

1. You'll need a Todoist API Token. You can get that from [here](https://beta.todoist.com/prefs/integrations)
   - if you're new to Todoist, then you can refer [here](#new-to-todoist).
2. You need to save the Todoist API Token in the repository secrets. You can find that in the Settings of your Repository. Be sure to save those as the following.
   - `TODOIST_API_KEY = <your todoist API token>`
   - `TODOIST_LENGTH = <number of tasks you want to fetch>`
3. You need to update the README file(README.md) with 2 comments. You can refer [here](#update-your-readme) for updating it.

## Update your README

Add a comment to your `README.md` like this:

```markdown
# Todoist Tasks

<!-- TODO-IST:START -->
<!-- TODO-IST:END -->
```

These lines will be our entry-points for the Todoist tasks list.

## New to Todoist

Todoist gives you the confidence that everything’s organized and accounted for, so you can make progress on the things that are important to you.

- Create a Todoist account from [here](https://todoist.com/users/showregister)
- Get your Todoist API Key from your [here](https://beta.todoist.com/prefs/integrations)

### Repository Workflow For Non-Premium Users

Please follow the steps below:

1. Go to your `<username>/<username>/actions`, hit `New workflow`, `set up a workflow yourself`, delete all the default content github made for you.
2. Copy the following code and paste it to your new workflow you created at step 1:

```yml
name: Todoist Readme

on:
  workflow_dispatch:
  schedule:
    # Runs every minute
    - cron: "* * * * *"

jobs:
  update-readme:
    name: Update Todoist tasks list
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: rxcod9/todoist-readme@master
        with:
          TODOIST_API_KEY: ${{ secrets.TODOIST_API_KEY }}
          TODOIST_LENGTH: ${{ secrets.TODOIST_LENGTH }}
```

3. Go to your repo secrets by hitting `Settings => Secrets` tab in your profile repo. You can also enter the url https://github.com/USERNAME/USERNAME/settings/secrets . Please replace the `USERNAME` with your own username.
4. Create a new `Secret`. `Name`: `TODOIST_API_KEY`, `Value`: Paste the Todoist API Token here. If you don't know what is the token, please go to [here](https://beta.todoist.com/prefs/integrations) to find your API Key there.
5. Create a new `Secret`. `Name`: `TODOIST_LENGTH`, `Value`: Paste the number of tasks you want to fetch.
6. Add a comment to your `README.md` like this:

```markdown
# Todoist Tasks

<!-- TODO-IST:START -->
<!-- TODO-IST:END -->
```

6. Go to Workflows menu (mentioned in step 1), click `Todoist Readme`, and click `Run workflow`.
7. Go to your profile page. you will be able to see it.

### Repository Workflow For Premium Users

Please follow the steps below:

1. Go to your `<username>/<username>/actions`, hit `New workflow`, `set up a workflow yourself`, delete all the default content github made for you.
2. Copy the following code and paste it to your new workflow you created at step 1:

```yml
name: Todoist Readme

on:
  workflow_dispatch:
  schedule:
    # Runs every minute
    - cron: "* * * * *"

jobs:
  update-readme:
    name: Update Todoist tasks list
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: rxcod9/todoist-readme@master
        with:
          TODOIST_API_KEY: ${{ secrets.TODOIST_API_KEY }}
          TODOIST_LENGTH: ${{ secrets.TODOIST_LENGTH }}
```

3. Remaining Steps will be same as Non-Premium Users.

## License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

_Inspired by [abhisheknaidu/todoist-readme](https://abhisheknaidu.tech/)_

_Inspired by [yg/todoist-box](https://github.com/yg/todoist-box)_

_Inspired by [gautamkrishnar/blog-post-workflow](https://github.com/gautamkrishnar/blog-post-workflow)_
