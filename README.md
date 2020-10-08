# Code Inights Plugin for Backstage

![a preview of the code insights plugin](https://raw.githubusercontent.com/RoadieHQ/backstage-plugin-code-insights/main/docs/code-insights-plugin.png)

## Plugin Setup

1. If you have standalone app (you didn't clone this repo), then do

```bash
yarn add @roadiehq/backstage-plugin-code-insights
```

2. Add plugin to the list of plugins:

```ts
// packages/app/src/plugins.ts
export { plugin as CodeInsights } from '@roadiehq/backstage-plugin-code-insights';
```

3. Add plugin API to your Backstage instance:

```ts
// packages/app/src/components/catalog/EntityPage.tsx
import { Router as CodeInsightsRouter } from '@roadiehq/backstage-plugin-code-insights';

...

const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    ...
    <EntityPageLayout.Content
      path="/code-insights"
      title="Code Insights"
      element={<CodeInsightsRouter entity={entity} />}
    />
  </EntityPageLayout>
```

4. Run backstage app with `yarn start` and navigate to services tabs.

## Widgets setup

1. You must install plugin by following the steps above to add widgets to your Overview. You might add only selected widgets or all of them.

2. Add widgets to your Overview tab:

```ts
// packages/app/src/components/catalog/EntityPage.tsx
import { ContributorsCard, LanguagesCard, ReadMeCard, ReleasesCard } from '@roadiehq/backstage-plugin-code-insights';

...

const OverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3}>
    ...
    <Grid item md={6}>
      <ContributorsCard entity={entity} />
      <LanguagesCard entity={entity} />
      <ReleasesCard entity={entity} />
    </Grid>
    <Grid item md={6}>
      <ReadMeCard entity={entity} />
    </Grid>
  </Grid>
);

```

## Features

- Add Code Insights plugin tab.
- Show widgets about repository contributors, languages, readme and release at overview page.

## Links

- [Backstage](https://backstage.io)
- Get hosted, managed Backstage for your company: https://roadie.io
