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
import { render } from '@testing-library/react';
import ContributorsCard from './ContributorsCard';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

describe('Contributors Component', () => {
  const server = setupServer();
  // Enable API mocking before tests.
  beforeAll(() => server.listen());

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers());

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get(
        'https://api.github.com/repos/octocat/Hello-World/contributors?per_page=10',
        (_, res, ctx) => res(ctx.status(200), ctx.delay(2000), ctx.json({})),
      ),
    );
  });
  it('should render', async () => {
    const rendered = render(
      <ContributorsCard projectSlug="octocat/Hello-World" />,
    );
    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });
});
