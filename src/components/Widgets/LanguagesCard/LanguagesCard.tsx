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
import { Chip } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { InfoCard, Progress } from '@backstage/core';
import { useAsync } from 'react-use';

type Language = {
  data: {
    [key: string]: number;
  };
  total: number;
};

type LanguageCardProps = {
  projectSlug: string;
};

const LanguagesCard: FC<LanguageCardProps> = ({ projectSlug }) => {
  const { value, loading, error } = useAsync(async (): Promise<Language> => {
    const response = await fetch(
      `https://api.github.com/repos/${projectSlug}/languages`,
    );
    const data = await response.json();
    return {
      data,
      total: Object.values(data as number).reduce((a, b) => a + b),
    };
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return value ? (
    <InfoCard title="Languages">
      {Object.entries(value.data).map(language => (
        <Chip
          label={
            <span>
              {language[0]} - {((language[1] / value.total) * 100).toFixed(2)}%
            </span>
          }
          key={language[0]}
        />
      ))}
    </InfoCard>
  ) : null;
};

export default LanguagesCard;
