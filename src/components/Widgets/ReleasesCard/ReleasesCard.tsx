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
import { InfoCard, Progress, useApi, githubAuthApiRef } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { useAsync } from 'react-use';
import { Octokit } from '@octokit/rest';
import { useProjectEntity } from '../../useProjectEntity';

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

type LanguageCardProps = {
  entity: Entity;
};

const ReleasesCard: FC<LanguageCardProps> = ({ entity }) => {
  const { owner, repo } = useProjectEntity(entity);
  const auth = useApi(githubAuthApiRef);
  const classes = useStyles();
  const { value, loading, error } = useAsync(async (): Promise<Release[]|null> => {
    const token = await auth.getAccessToken(['repo']);
    const octokit = new Octokit({auth: token});
    const response = await octokit.request('GET /repos/{owner}/{repo}/releases', {
      owner,
      repo,
    });
    const data = await response.data;
    return data.slice(0, 5);
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error" className={classes.infoCard}>{error.message}</Alert>;
  }

  return value?.length && owner && repo ? (
    <InfoCard
      title="Releases"
      deepLink={{
        link: `https://github.com/${owner}/${repo}/releases`,
        title: 'Releases',
        onClick: (e) => {
          e.preventDefault();
          window.open(`https://github.com/${owner}/${repo}/releases`);
        }
      }}
      className={classes.infoCard}
    >
      <List>
        {value.map(release => (
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