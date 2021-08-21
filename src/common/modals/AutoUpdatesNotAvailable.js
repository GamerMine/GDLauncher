import React, { memo } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import { translate } from '../../../public/i18n';

const AutoUpdatesNotAvailable = () => {
  return (
    <Modal
      css={`
        height: 200px;
        width: 400px;
      `}
      title={translate('autoUpdateNotAvailable:auto_update_not_available')}
    >
      <Container>
        <div>{translate('autoUpdateNotAvailable:not_available_on_this_platform')}</div>
        <div
          css={`
            margin-top: 20px;
          `}
        >
          {translate(
            'autoUpdateNotAvailable:auto_update_not_available_description'
          )}{' '}
          <a href="https://gdevs.io">here</a>
        </div>
      </Container>
    </Modal>
  );
};

export default memo(AutoUpdatesNotAvailable);

const Container = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  color: ${props => props.theme.palette.text.primary};
`;
