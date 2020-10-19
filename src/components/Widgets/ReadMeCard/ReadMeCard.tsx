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
import { makeStyles } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import Alert from '@material-ui/lab/Alert';
import { InfoCard, Progress, useApi, githubAuthApiRef} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { Octokit } from '@octokit/rest';
import { useAsync } from 'react-use';
import { useProjectEntity } from '../../useProjectEntity';

const useStyles = makeStyles(theme => ({
  infoCard: {
    marginBottom: theme.spacing(3),
    '& + .MuiAlert-root': {
      marginTop: theme.spacing(3),
    },
    '& .MuiCardContent-root': {
      padding: theme.spacing(2, 1, 2, 2),
    },
  },
  readMe: {
    overflowY: 'auto',
    paddingRight: theme.spacing(1),
    '& pre': {
      padding: '16px',
      overflow: 'auto',
      fontSize: '85%',
      lineHeight: 1.45,
      backgroundColor: '#f6f8fa',
      borderRadius: '6px',
    },
    '& img': {
      maxWidth: '100%',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F5F5F5',
      borderRadius: '5px',
    },
    '&::-webkit-scrollbar': {
      width: '5px',
      backgroundColor: '#F5F5F5',
      borderRadius: '5px',
    },
    '&::-webkit-scrollbar-thumb': {
      border: '1px solid #555555',
      backgroundColor: '#555',
      borderRadius: '4px',
    }
  },
}));

type ReadMe = {
  content: string;
};

type ReadMeCardProps = {
  entity: Entity;
  maxHeight?: number;
};

const ReadMeCard: FC<ReadMeCardProps> = ({ entity, maxHeight }) => {
  const { owner, repo } = useProjectEntity(entity);
  const auth = useApi(githubAuthApiRef);
  const classes = useStyles();
  const { value, loading, error } = useAsync(async (): Promise<ReadMe> => {
    const token = await auth.getAccessToken(['repo']);
    const octokit = new Octokit({auth: token});
    const response = await octokit.request('GET /repos/{owner}/{repo}/readme', {
      owner,
      repo,
    });
    const data = await response.data;
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error" className={classes.infoCard}>{error.message}</Alert>;
  }

  return value?.content && owner && repo ? (
    <InfoCard
      title="Read me"
      className={classes.infoCard}
      deepLink={{
        link: `https://github.com/${owner}/${repo}/releases`,
        title: 'Read me',
        onClick: () => window.open(`https://github.com/${owner}/${repo}/releases`),
      }}
    >
      <div
        className={classes.readMe}
        style={
          {
            maxHeight: `${maxHeight}px`,
          }
        }>
        <ReactMarkdown source={value && atob(value.content)} />
      </div>

    </InfoCard>
  ) : null;
};

export default ReadMeCard;
