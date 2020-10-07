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
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { InfoCard, Progress } from '@backstage/core';
import { useAsync } from 'react-use';
import { ContributorData } from './types';
import ContributorsList from './components/ContributorsList';

const useStyles = makeStyles(theme => ({
  infoCard: {
    '& + .MuiCard-root': {
      marginTop: theme.spacing(3),
    }
  }
}));

type ContributorsCardProps = {
  projectSlug: string;
};

const ContributorsCard: FC<ContributorsCardProps> = ({ projectSlug }) => {
  const classes = useStyles();
  const { value, loading, error } = useAsync(async (): Promise<
    ContributorData[]
  > => {
    const response = await fetch(
      `https://api.github.com/repos/${projectSlug}/contributors?per_page=10`,
    );
    const data = await response.json();
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <InfoCard
      title="Contributors"
      deepLink={{
        link: `https://github.com/${projectSlug}/graphs/contributors`,
        title: 'People',
        onClick: () => window.open(`https://github.com/${projectSlug}/graphs/contributors`),
      }}
      className={classes.infoCard}
    >
      <ContributorsList contributors={value || []} />
    </InfoCard>
  );
};

export default ContributorsCard;
