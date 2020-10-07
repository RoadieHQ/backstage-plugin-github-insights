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
import { useAsync } from 'react-use';

const useStyles = makeStyles(() => ({
  readMe: {
    '& pre': {
      padding: '16px',
      overflow: 'auto',
      fontSize: '85%',
      lineHeight: 1.45,
      backgroundColor: '#f6f8fa',
      borderRadius: '6px',
    },
  },
}));

type ReadMe = {
  content: string;
};

type ReadMeCardProps = {
  projectSlug: string;
};

const ReadMeCard: FC<ReadMeCardProps> = ({ projectSlug }) => {
  const classes = useStyles();
  const { value, loading, error } = useAsync(async (): Promise<ReadMe> => {
    const response = await fetch(
      `https://api.github.com/repos/${projectSlug}/readme`,
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
    <InfoCard title="Read me">
      <ReactMarkdown
        className={classes.readMe}
        source={value && atob(value.content)}
      />
    </InfoCard>
  );
};

export default ReadMeCard;
