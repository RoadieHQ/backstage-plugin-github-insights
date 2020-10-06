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
import InsightsPage from './InsightsPage';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';

describe('Insights Page', () => {
  it('should render', () => {
    const rendered = render(
      <ThemeProvider theme={lightTheme}>
        <InsightsPage
          entity={{
            apiVersion: '1',
            kind: 'a',
            metadata: {
              name: 'Example Service',
              annotations: {
                'github.com/project-slug': 'octocat/Hello-World',
              },
            },
          }}
        />
      </ThemeProvider>,
    );
    expect(rendered.getByText('GitHub Insights')).toBeInTheDocument();
  });
});
