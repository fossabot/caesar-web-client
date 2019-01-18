import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar';

const Wrapper = styled.div`
  display: flex;
`;

const StyledAvatar = styled(Avatar)`
  margin-right: -10px;

  &:last-child {
    margin-right: 0;
  }
`;

const DEFAULT_VISIBLE_AVATARS_COUNT = 3;

const AvatarsList = ({
  avatars = [],
  isSmall,
  visibleCount = DEFAULT_VISIBLE_AVATARS_COUNT,
  ...props
}) => {
  const visibleAvatars = avatars.slice(0, visibleCount);
  const invisibleCount = avatars.length - visibleAvatars.length;
  const shouldShowLast = invisibleCount > 0;

  const renderedAvatars = visibleAvatars
    .map(({ name, avatar }, index) => (
      <StyledAvatar isSmall={isSmall} key={index} name={name} avatar={avatar} />
    ))
    .concat(
      shouldShowLast ? (
        <Avatar isSmall={isSmall} key={visibleAvatars.length}>
          +{invisibleCount}
        </Avatar>
      ) : null,
    );

  return <Wrapper {...props}>{renderedAvatars}</Wrapper>;
};

export default AvatarsList;