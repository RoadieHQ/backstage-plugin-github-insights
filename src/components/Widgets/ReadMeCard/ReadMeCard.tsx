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
import { InfoCard, Progress } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import gfm from 'remark-gfm';
import { useProjectEntity } from '../../useProjectEntity';
import { useRequest } from '../../useRequest';
import { useUrl } from '../../useUrl';

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
    '& table': {
      borderCollapse: 'collapse',
      border: '1px solid #dfe2e5',
      color: 'rgb(36, 41, 46)',
    },
    '& th, & td': {
      border: '1px solid #dfe2e5',
      padding: theme.spacing(1),
    },
    '& tr': {
      backgroundColor: '#fff',
    },
    '& tr:nth-child(2n)': {
      backgroundColor: '#f6f8fa',
    },
    '& pre': {
      padding: '16px',
      overflow: 'auto',
      fontSize: '85%',
      lineHeight: 1.45,
      backgroundColor: '#f6f8fa',
      borderRadius: '6px',
      color: 'rgba(0, 0, 0, 0.87)',
    },
    '& a': {
      color: '#2E77D0',
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

type ReadMeCardProps = {
  entity: Entity;
  maxHeight?: number;
};

const getRepositoryDefaultBranch = (url: string) => {
  const repositoryUrl = (new URL(url).searchParams).get('ref');
  return repositoryUrl;
}

const ReadMeCard: FC<ReadMeCardProps> = ({ entity, maxHeight }) => {
  const { owner, repo } = useProjectEntity(entity);
  const classes = useStyles();
  const { value, loading, error } = useRequest(entity, 'readme');
  const { hostname } = useUrl();

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
        link: `//${hostname}/${owner}/${repo}/blob/${getRepositoryDefaultBranch(value.url)}/README.md`,
        title: 'Read me',
        onClick: (e) => {
          e.preventDefault();
          window.open(`//${hostname}/${owner}/${repo}/blob/${getRepositoryDefaultBranch(value.url)}/README.md`);
        }
      }}
    >
      <div
        className={classes.readMe}
        style={
          {
            maxHeight: `${maxHeight}px`,
          }
        }>
        <ReactMarkdown plugins={[gfm]} children={atob(value.content).replace(/\(\./gi, `(//${hostname}/${owner}/${repo}/raw/${getRepositoryDefaultBranch(value.url)}`)} />
      </div>

    </InfoCard>
  ) : null;
};

export default ReadMeCard;
