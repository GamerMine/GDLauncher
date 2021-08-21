import React, { memo } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal';
import BisectHostingLogo from '../../ui/BisectHosting';
import { translate } from '../../../public/i18n';

const BisectHosting = () => {
  return (
    <Modal
      css={`
        height: 360px;
        width: 500px;
        font-size: 10px;
        line-height: 1.8;
      `}
      title={translate('bisectHosting:we_teamed_up')}
    >
      <Container>
        <BisectHostingLogo size={70} hover />
        <h2
          css={`
            margin-top: 20px;
          `}
        >
          {`${translate('bisectHosting:grab_a_server')} `}
          <span
            css={`
              font-weight: 800;
            `}
          >
            BisectHosting
          </span>{' '}
          <span>
            {translate(
              'bisectHosting:for_effortless_modded_server_installs_and_updates'
            )}
          </span>{' '}
          {`${translate('bisectHosting:customers_can_save')} `}
          <span
            css={`
              color: ${props => props.theme.palette.colors.green};
            `}
          >
            25%
          </span>{' '}
          {`${translate(
            'bisectHosting:off_their_first_month_using_the_promo_code'
          )} `}
          <span
            css={`
              color: ${props => props.theme.palette.colors.green};
            `}
          >
            GDL
          </span>{' '}
          {translate('bisectHosting:at_checkout')}
        </h2>
        <a href="https://bisecthosting.com/gdl">
          <Button
            type="primary"
            css={`
              margin-top: 25px;
            `}
          >
            {translate('bisectHosting:go_to')} BisectHosting.com &nbsp;
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </Button>
        </a>
      </Container>
    </Modal>
  );
};

export default memo(BisectHosting);

const Container = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  color: ${props => props.theme.palette.text.primary};
`;
