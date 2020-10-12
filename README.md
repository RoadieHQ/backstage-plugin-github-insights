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
export { plugin as GitHubInsights } from '@roadiehq/backstage-plugin-github-insights';
```

3. Add plugin API to your Backstage instance:

```ts
// packages/app/src/components/catalog/EntityPage.tsx
import { Router as GitHubInsightsRouter } from '@roadiehq/backstage-plugin-github-insights';

...

const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    ...
    <EntityPageLayout.Content
      path="/code-insights"
      title="Code Insights"
      element={<GitHubInsightsRouter entity={entity} />}
    />
  </EntityPageLayout>
```

4. Run backstage app with `yarn start` and navigate to services tabs.

## Widgets setup

1. You must install plugin by following the steps above to add widgets to your Overview. You might add only selected widgets or all of them.

2. Add widgets to your Overview tab:

```ts
// packages/app/src/components/catalog/EntityPage.tsx
import {
  ContributorsCard,
  LanguagesCard,
  ReadMeCard,
  ReleasesCard,
  isPluginApplicableToEntity as isGitHubAvailable,
} from '@roadiehq/backstage-plugin-github-insights';

...

const OverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3}>
    ...
    {isGitHubAvailable(entity) && (
      <>
        <Grid item md={6}>
          <ContributorsCard entity={entity} />
          <LanguagesCard entity={entity} />
          <ReleasesCard entity={entity} />
        </Grid>
        <Grid item md={6}>
          <ReadMeCard entity={entity} />
        </Grid>
      </>
    )}
  </Grid>
);

```

## Features

- Add GitHub Insights plugin tab.
- Show widgets about repository contributors, languages, readme and release at overview page.

## Links

- [Backstage](https://backstage.io)
- Get hosted, managed Backstage for your company: https://roadie.io
