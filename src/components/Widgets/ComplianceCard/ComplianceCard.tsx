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
import { Box, Link, List, ListItem } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { InfoCard, Progress, StructuredMetadataTable } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import {
  useProtectedBranches,
  useRepoLicence,
} from '../../../hooks/useComplianceHooks';
import { useProjectEntity } from '../../../hooks/useProjectEntity';
import WarningIcon from '@material-ui/icons/ErrorOutline';

type ReleaseCardProps = {
  entity: Entity;
};

const ComplianceCard: FC<ReleaseCardProps> = ({ entity }) => {
  const { owner, repo } = useProjectEntity(entity);
  const { branches, loading, error } = useProtectedBranches(entity);
  const {
    license,
    loading: licenseLoading,
    error: licenseError,
  } = useRepoLicence(entity);

  if (loading || licenseLoading) {
    return <Progress />;
  } else if (error || licenseError) {
    return (
      <Alert severity="error">
        Error occured while fetching data for the compliance card:{' '}
        {error?.message}
      </Alert>
    );
  }

  return (
    <InfoCard title="Compliance report">
      <StructuredMetadataTable
        metadata={{
          'Protected branches':
            branches?.length && owner && repo ? (
              <List>
                {branches.map((branch: any) => (
                  <ListItem key={branch.name}>{branch.name}</ListItem>
                ))}
              </List>
            ) : (
              <Box display="flex" alignItems="center">
                <WarningIcon
                  style={{
                    color: 'orange',
                    marginRight: '5px',
                    flexShrink: 0,
                  }}
                />
                <span>
                  You don't have any protected branches in the{' '}
                  {
                    <Link href={`https:github.com/${owner}/${repo}`}>
                      {owner}/{repo}
                    </Link>
                  }{' '}
                  repository
                </span>
              </Box>
            ),
          License:
            license === 'No license file found' ? (
              <Box display="flex" alignItems="center">
                <WarningIcon
                  style={{
                    color: 'orange',
                    marginRight: '5px',
                    flexShrink: 0,
                  }}
                />
                <span>
                  No license file found in the{' '}
                  {
                    <Link href={`https:github.com/${owner}/${repo}`}>
                      {owner}/{repo}
                    </Link>
                  }{' '}
                  repository
                </span>
              </Box>
            ) : (
              license
            ),
        }}
      />
    </InfoCard>
  );
};

export default ComplianceCard;
