/*
 * Copyright 2020 RoadieHQ
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { FC } from 'react';
import { Grid, Box } from '@material-ui/core';
import {
  Page,
  pageTheme,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import ContributorsCard from '../ContributorsCard';
import ReadMeCard from '../ReadMeCard';
import LanguagesCard from '../LanguagesCard';
import ReleasesCard from '../ReleasesCard';

type InsightsPageProps = {
  entity: Entity;
};

const InsightsPage: FC<InsightsPageProps> = ({ entity }) => {
  const projectSlug = entity.metadata?.annotations?.['github.com/project-slug'];

  return projectSlug ? (
    <Page theme={pageTheme.tool}>
      <Content>
        <ContentHeader title="GitHub Insights">
          <SupportButton>Plugin to show Insights from GitHub</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="row" alignItems="stretch">
          <Grid item sm={12} md={6} lg={4}>
            <ContributorsCard projectSlug={projectSlug} />
            <Box my={3}>
              <LanguagesCard projectSlug={projectSlug} />
            </Box>
            <ReleasesCard projectSlug={projectSlug} />
          </Grid>
          <Grid item sm={12} md={6} lg={8}>
            <ReadMeCard projectSlug={projectSlug} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  ) : null;
};
export default InsightsPage;
