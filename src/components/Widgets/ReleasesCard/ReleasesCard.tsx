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
import { Link, List, ListItem, makeStyles } from '@material-ui/core';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import Alert from '@material-ui/lab/Alert';
import { InfoCard, Progress } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { useProjectEntity } from '../../useProjectEntity';
import { useRequest } from '../../useRequest';
import { useUrl } from '../../useUrl';

const useStyles = makeStyles(theme => ({
  infoCard: {
    marginBottom: theme.spacing(3),
    '& + .MuiAlert-root': {
      marginTop: theme.spacing(3),
    }
  }
}));

type Release = {
  id: number;
  html_url: string;
  tag_name: string;
  prerelease: boolean;
};

type ReleaseCardProps = {
  entity: Entity;
};

const ReleasesCard: FC<ReleaseCardProps> = ({ entity }) => {
  const { owner, repo } = useProjectEntity(entity);
  const classes = useStyles();
  const { value, loading, error } = useRequest(entity, 'releases', 0, 5);
  const { hostname } = useUrl();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error" className={classes.infoCard}>{error.message}</Alert>;
  }

  return value?.length && owner && repo ? (
    <InfoCard
      title="Releases"
      deepLink={{
        link: `//${hostname}/${owner}/${repo}/releases`,
        title: 'Releases',
        onClick: (e) => {
          e.preventDefault();
          window.open(`//${hostname}/${owner}/${repo}/releases`);
        }
      }}
      className={classes.infoCard}
    >
      <List>
        {value.map((release: Release) => (
          <ListItem key={release.id}>
            <Link href={release.html_url} color="inherit" target="_blank" rel="noopener noreferrer">
              <LocalOfferOutlinedIcon fontSize="inherit" /> {release.tag_name}
              {/* by {release.author.login} */}
              {/* {release.prerelease ? <Chip color="primary" size="small" label="Pre-release" /> : <Chip color="secondary" size="small" />} */}
            </Link>
          </ListItem>
        ))}
      </List>
    </InfoCard>
  ) : null;
};

export default ReleasesCard;