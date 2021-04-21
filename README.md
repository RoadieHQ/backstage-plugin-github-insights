# GitHub Insights Plugin for Backstage

![a preview of the GitHub insights plugin](https://raw.githubusercontent.com/RoadieHQ/backstage-plugin-code-insights/main/docs/code-insights-plugin.png)

## Plugin Setup

1. If you have standalone app (you didn't clone this repo), then do

```bash
yarn add @roadiehq/backstage-plugin-github-insights
```

2. Add plugin to the list of plugins:

```ts
// packages/app/src/plugins.ts
export { githubInsightsPlugin } from '@roadiehq/backstage-plugin-github-insights';
```

3. Add plugin API to your Backstage instance:

```ts
// packages/app/src/components/catalog/EntityPage.tsx
import { EntityGithubInsightsContent } from '@roadiehq/backstage-plugin-github-insights';

...

const serviceEntityPage = (
  <EntityLayoutWrapper>
    ...
    <EntityLayout.Route 
      path="/code-insights"
      title="Code Insights">
      <EntityGithubInsightsContent />
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);
```

4. Run backstage app with `yarn start` and navigate to services tabs.

## Widgets setup

1. You must install plugin by following the steps above to add widgets to your Overview. You might add only selected widgets or all of them.

2. Add widgets to your Overview tab:

```ts
// packages/app/src/components/catalog/EntityPage.tsx
import {
  EntityGithubInsightsContent,
  EntityGithubInsightsLanguagesCard,
  EntityGithubInsightsReadmeCard,
  EntityGithubInsightsReleasesCard,
  isGithubInsightsAvailable,
} from '@roadiehq/backstage-plugin-github-insights';

...

const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
   <EntitySwitch>
      <EntitySwitch.Case if={e => Boolean(isGithubInsightsAvailable(e))}>
        <Grid item md={6}>
          <EntityGithubInsightsLanguagesCard />
          <EntityGithubInsightsReleasesCard />
        </Grid>
        <Grid item md={6}>
          <EntityGithubInsightsReadmeCard maxHeight={350} />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </Grid>
);

```

## Readme path

By default the plugin will use the annotation `github.com/project-slug` and get the root `README.md` from the repository. You can use a specific path by using the annotation `'github.com/project-readme-path': 'packages/sub-module/README.md'`. It can be useful if you have a component inside a monorepos.

## Features

- Add GitHub Insights plugin tab.
- Show widgets about repository contributors, languages, readme and release at overview page.

## Links

- [Backstage](https://backstage.io)
- Get hosted, managed Backstage for your company: https://roadie.io
