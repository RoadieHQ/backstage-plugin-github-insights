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
import { Link, List, ListItem } from '@material-ui/core';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import Alert from '@material-ui/lab/Alert';
import { InfoCard, Progress } from '@backstage/core';
import { useAsync } from 'react-use';

type Release = {
  id: number;
  tag_name: string;
};

type LanguageCardProps = {
  projectSlug: string;
};

const ReleasesCard: FC<LanguageCardProps> = ({ projectSlug }) => {
  const { value, loading, error } = useAsync(async (): Promise<Release[]> => {
    const response = await fetch(
      `https://api.github.com/repos/${'spotify/backstage' || projectSlug}/releases`,
    );
    const data = await response.json();
    return data.slice(0, 5);
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return value?.length ? (
    <InfoCard
      title="Releases"
      deepLink={{
        link: `https://github.com/${projectSlug}/releases`,
        title: 'Releases',
      }}
    >
      <List>
        {value.map(release => (
          <ListItem key={release.id}>
            <Link href="#" color="inherit" onClick={ () => {} }>
              <LocalOfferOutlinedIcon fontSize="inherit" /> {release.tag_name}
            </Link>
          </ListItem>
        ))}
      </List>
    </InfoCard>
  ) : null;
};

export default ReleasesCard;