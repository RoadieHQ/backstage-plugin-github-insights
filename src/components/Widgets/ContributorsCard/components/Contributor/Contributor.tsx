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
import { Avatar, Tooltip, withStyles } from '@material-ui/core';
import ContributorTooltipContent from '../ContributorTooltipContent';
import { ContributorData } from '../../types';
import { useUrl } from '../../../../useUrl';

type ContributorProps = {
  contributor: ContributorData;
};

const LightTooltip = withStyles({
  tooltip: {
    backgroundColor: 'white',
    border: '1px solid lightgrey',
    color: '#333',
    minWidth: '320px',
  },
})(Tooltip);

const Contributor: FC<ContributorProps> = ({ contributor }) => {
  const { hostname } = useUrl();
  return (
    <LightTooltip
      title={<ContributorTooltipContent contributorLogin={contributor.login} />}
      interactive
    >
      <Avatar
        key={contributor.login}
        alt={contributor.login}
        src={`//${hostname}/${contributor.login}.png`}
      />
    </LightTooltip>
  );
};

export default Contributor;
