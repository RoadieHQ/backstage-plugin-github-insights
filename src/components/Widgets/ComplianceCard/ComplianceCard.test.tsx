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

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ApiRegistry,
  ApiProvider,
  configApiRef,
  githubAuthApiRef,
} from '@backstage/core';
import { rest } from 'msw';
import { msw } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';
import { wrapInTestApp } from '@backstage/test-utils';
import {
  branchesResponseMock,
  contributorsResponseMock,
  entityMock,
  languagesResponseMock,
  licenseResponseMock,
  readmeResponseMock,
  releasesResponseMock,
  runsResponseMock,
} from '../../../mocks/mocks';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import InsightsPage from '.';
import ComplianceCard from '.';

const mockGithubAuth = {
  getAccessToken: async (_: string[]) => 'test-token',
};

const config = {
  getOptionalConfigArray: (_: string) => [
    { getOptionalString: (_: string) => undefined },
  ],
};

const apis = ApiRegistry.from([
  [githubAuthApiRef, mockGithubAuth],
  [configApiRef, config],
]);

describe('ComplianceCard', () => {
  const worker = setupServer();
  msw.setupDefaultHandlers(worker);

  beforeEach(() => {
    worker.use(
      rest.get(
        'https://api.github.com/repos/mcalus3/backstage/actions/runs?per_page=4&page=1',
        (_, res, ctx) => res(ctx.json(runsResponseMock))
      ),
      rest.get(
        'https://api.github.com/repos/mcalus3/backstage/languages',
        (_, res, ctx) => res(ctx.json(languagesResponseMock))
      ),
      rest.get(
        'https://api.github.com/repos/mcalus3/backstage/contents/LICENSE',
        (_, res, ctx) => res(ctx.json(licenseResponseMock))
      ),
      rest.get(
        'https://api.github.com/repos/mcalus3/backstage/releases',
        (_, res, ctx) => res(ctx.json(releasesResponseMock))
      ),
      rest.get(
        'https://api.github.com/repos/mcalus3/backstage/readme',
        (_, res, ctx) => res(ctx.json(readmeResponseMock))
      ),
      rest.get(
        'https://api.github.com/repos/mcalus3/backstage/branches?protected=true',
        (_, res, ctx) => res(ctx.json(branchesResponseMock))
      ),
      rest.get(
        'https://api.github.com/repos/mcalus3/backstage/contributors?per_page=10',
        (_, res, ctx) => res(ctx.json(contributorsResponseMock))
      )
    );
  });

  it('should display a card with the data from the requests', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <ComplianceCard entity={entityMock} />
          </ThemeProvider>
        </ApiProvider>
      )
    );
    expect(await rendered.findByText('master')).toBeInTheDocument();
    expect(await rendered.findByText('Apache License')).toBeInTheDocument();
  });
});
