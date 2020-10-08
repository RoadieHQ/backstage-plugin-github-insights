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
import { Chip, makeStyles, Tooltip } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { InfoCard, Progress } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { useAsync } from 'react-use';
import { colors } from './colors';

const useStyles = makeStyles(theme => ({
  infoCard: {
    '& + .MuiCard-root': {
      marginTop: theme.spacing(3),
    },
  },
  barContainer: {
    height: theme.spacing(2),
    marginBottom: theme.spacing(3),
    borderRadius: '4px',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    position: 'relative',
  },
  languageDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: theme.spacing(1),
    display: 'inline-block',
  }
}));

type Language = {
  data: {
    [key: string]: number;
  };
  total: number;
};

type LanguageCardProps = {
  entity: Entity;
};

const LanguagesCard: FC<LanguageCardProps> = ({ entity }) => {
  let barWidth = 0;
  const projectSlug = entity.metadata?.annotations?.['github.com/project-slug'];
  const classes = useStyles();
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
  return value && projectSlug ? (
    <InfoCard title="Languages" className={classes.infoCard}>
      <div className={classes.barContainer}>
        {
          Object.entries(value.data).map((language, index: number) => {
            barWidth = barWidth + ((language[1] / value.total) * 100);
            return (
              <Tooltip title={ language[0] } placement="bottom-end" key={language[0]}>
                <div
                  className={classes.bar}
                  key={ language[0] }
                  style={
                    {
                      marginTop: index === 0 ? '0' : `-16px`,
                      zIndex: Object.keys(value.data).length - index,
                      backgroundColor: colors[(language[0])].color,
                      width: `${barWidth}%`,
                    }
                  }
                />
              </Tooltip>
            );
          })
        }
      </div>
      {Object.entries(value.data).map(language => (
        <Chip
          label={
            <>
              <span
                className={classes.languageDot}
                style={ {
                  backgroundColor: colors[(language[0])].color,
                }} /> 
                {language[0]} - {((language[1] / value.total) * 100).toFixed(2)}%
            </>
          }
          variant="outlined"
          key={language[0]}
        />
      ))}
    </InfoCard>
  ) : null;
};

export default LanguagesCard;
