import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import { ipcRenderer, clipboard } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import path from 'path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fsa from 'fs-extra';
import { promises as fs } from 'fs';
import {
  faCopy,
  faDownload,
  faTachometerAlt,
  faTrash,
  faPlay,
  faToilet,
  faNewspaper,
  faFolder,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import { Select, Tooltip, Button, Switch, Input, Checkbox } from 'antd';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import {
  _getCurrentAccount,
  _getDataStorePath,
  _getInstancesPath,
  _getTempPath
} from '../../../utils/selectors';
import {
  updateDiscordRPC,
  updateHideWindowOnGameLaunch,
  updatePotatoPcMode,
  updateShowNews,
  updateCurseReleaseChannel,
  updateLanguage
} from '../../../reducers/settings/actions';
import HorizontalLogo from '../../../../ui/HorizontalLogo';
import { updateConcurrentDownloads } from '../../../reducers/actions';
import { openModal } from '../../../reducers/modals/actions';
import { extractFace } from '../../../../app/desktop/utils';
import { translate } from '../../../../../public/i18n';

const MyAccountPrf = styled.div`
  width: 100%;
  height: 100%;
`;

const PersonalData = styled.div`
  margin-top: 38px;
  width: 100%;
`;

const MainTitle = styled.h1`
  color: ${props => props.theme.palette.text.primary};
  margin: 0 500px 20px 0;
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.palette.text.primary};
  z-index: 1;
  text-align: left;
  -webkit-backface-visibility: hidden;
`;

const ProfileImage = styled.img`
  position: relative;
  top: 20px;
  left: 20px;
  background: #212b36;
  width: 50px;
  height: 50px;
`;

const ImagePlaceHolder = styled.div`
  position: relative;
  top: 20px;
  left: 20px;
  background: #212b36;
  width: 50px;
  height: 50px;
`;

const UsernameContainer = styled.div`
  text-align: left;
`;

const UuidContainer = styled.div`
  text-align: left;
`;

const Uuid = styled.div`
  font-size: smaller;
  font-weight: 200;
  color: ${props => props.theme.palette.grey[100]};
  display: flex;
`;

const Username = styled.div`
  font-size: smaller;
  font-weight: 200;
  color: ${props => props.theme.palette.grey[100]};
  display: flex;
`;

const PersonalDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background: ${props => props.theme.palette.grey[900]};
  border-radius: ${props => props.theme.shape.borderRadius};
`;

const Hr = styled.div`
  height: 25px;
`;

const ReleaseChannel = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  height: 90px;
  color: ${props => props.theme.palette.text.third};
  p {
    margin-bottom: 7px;
    color: ${props => props.theme.palette.text.secondary};
  }
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  select {
    margin-left: auto;
    self-align: end;
  }
`;

const Language = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  height: 90px;
  color: ${props => props.theme.palette.text.third};
  p {
    margin-bottom: 7px;
    color: ${props => props.theme.palette.text.secondary};
  }
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  select {
    margin-left: auto;
    self-align: end;
  }
`;

const ParallelDownload = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  p {
    text-align: left;
    color: ${props => props.theme.palette.text.third};
  }
`;

const DiscordRpc = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  p {
    text-align: left;
    color: ${props => props.theme.palette.text.third};
  }
`;

const LauncherVersion = styled.div`
  margin: 30px 0;
  p {
    text-align: left;
    color: ${props => props.theme.palette.text.third};
    margin: 0 0 0 6px;
  }

  h1 {
    color: ${props => props.theme.palette.text.primary};
  }
`;
const CustomDataPathContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 140px;
  border-radius: ${props => props.theme.shape.borderRadius};

  h1 {
    width: 100%;
    font-size: 15px;
    font-weight: 700;
    color: ${props => props.theme.palette.text.primary};
    z-index: 1;
    text-align: left;
  }
`;

function copy(setCopied, copyText) {
  setCopied(true);
  clipboard.writeText(copyText);
  setTimeout(() => {
    setCopied(false);
  }, 500);
}

function dashUuid(UUID) {
  // UUID is segmented into: 8 - 4 - 4 - 4 - 12
  // Then dashes are added between.

  // eslint-disable-next-line
  return `${UUID.substring(0, 8)}-${UUID.substring(8, 12)}-${UUID.substring(
    12,
    16
  )}-${UUID.substring(16, 20)}-${UUID.substring(20, 32)}`;
}

const General = () => {
  const [version, setVersion] = useState(null);
  const [releaseChannel, setReleaseChannel] = useState(null);
  const currentAccount = useSelector(_getCurrentAccount);
  const hideWindowOnGameLaunch = useSelector(
    state => state.settings.hideWindowOnGameLaunch
  );
  const DiscordRPC = useSelector(state => state.settings.discordRPC);
  const potatoPcMode = useSelector(state => state.settings.potatoPcMode);
  const concurrentDownloads = useSelector(
    state => state.settings.concurrentDownloads
  );
  const language = useSelector(state => state.settings.language);
  const lastLanguage = useSelector(state => state.settings.language);
  const updateAvailable = useSelector(state => state.updateAvailable);
  const dataStorePath = useSelector(_getDataStorePath);
  const instancesPath = useSelector(_getInstancesPath);
  const isPlaying = useSelector(state => state.startedInstances);
  const queuedInstances = useSelector(state => state.downloadQueue);
  const tempPath = useSelector(_getTempPath);
  const [copiedUuid, setCopiedUuid] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [deletingInstances, setDeletingInstances] = useState(false);
  const userData = useSelector(state => state.userData);
  const [dataPath, setDataPath] = useState(userData);
  const [moveUserData, setMoveUserData] = useState(false);
  const showNews = useSelector(state => state.settings.showNews);
  const [loadingMoveUserData, setLoadingMoveUserData] = useState(false);
  const curseReleaseChannel = useSelector(
    state => state.settings.curseReleaseChannel
  );

  const dispatch = useDispatch();

  const disableInstancesActions =
    Object.keys(queuedInstances).length > 0 ||
    Object.keys(isPlaying).length > 0;

  useEffect(() => {
    ipcRenderer.invoke('getAppVersion').then(setVersion).catch(console.error);
    extractFace(currentAccount.skin).then(setProfileImage).catch(console.error);
    ipcRenderer
      .invoke('getAppdataPath')
      .then(appData =>
        fsa
          .readFile(path.join(appData, 'gdlauncher_next', 'rChannel'))
          .then(v => setReleaseChannel(parseInt(v.toString(), 10)))
          .catch(() => setReleaseChannel(0))
      )
      .catch(console.error);
  }, []);

  const clearSharedData = async () => {
    setDeletingInstances(true);
    try {
      await fsa.emptyDir(dataStorePath);
      await fsa.emptyDir(instancesPath);
      await fsa.emptyDir(tempPath);
    } catch (e) {
      console.error(e);
    }
    setDeletingInstances(false);
  };

  const changeDataPath = async () => {
    setLoadingMoveUserData(true);
    const appData = await ipcRenderer.invoke('getAppdataPath');
    const appDataPath = path.join(appData, 'gdlauncher_next');

    const notCopiedFiles = [
      'Cache',
      'Code Cache',
      'Dictionaries',
      'GPUCache',
      'Cookies',
      'Cookies-journal'
    ];
    await fsa.writeFile(path.join(appDataPath, 'override.data'), dataPath);

    if (moveUserData) {
      try {
        const files = await fs.readdir(userData);
        await Promise.all(
          files.map(async name => {
            if (!notCopiedFiles.includes(name)) {
              await fsa.copy(
                path.join(userData, name),
                path.join(dataPath, name),
                {
                  overwrite: true
                }
              );
            }
          })
        );
      } catch (e) {
        console.error(e);
      }
    }
    setLoadingMoveUserData(false);
    ipcRenderer.invoke('appRestart');
  };

  const openFolder = async () => {
    const { filePaths, canceled } = await ipcRenderer.invoke(
      'openFolderDialog',
      userData
    );
    if (!filePaths[0] || canceled) return;
    setDataPath(filePaths[0]);
  };

  const changeLanguageAndRestartApp = () => {
    ipcRenderer.invoke('appRestart');
  };

  const cancelLanguageChange = () => {
    dispatch(updateLanguage(lastLanguage));
  };

  return (
    <MyAccountPrf>
      <PersonalData>
        <MainTitle>{translate('general:general')}</MainTitle>
        <PersonalDataContainer>
          {profileImage ? (
            <ProfileImage src={`data:image/jpeg;base64,${profileImage}`} />
          ) : (
            <ImagePlaceHolder />
          )}
          <div
            css={`
              margin: 20px 20px 20px 40px;
              width: 330px;
            `}
          >
            <UsernameContainer>
              {translate('general:username')} <br />
              <Username>{currentAccount.selectedProfile.name}</Username>
            </UsernameContainer>
            <UuidContainer>
              UUID
              <br />
              <Uuid>
                {dashUuid(currentAccount.selectedProfile.id)}
                <Tooltip
                  title={
                    copiedUuid
                      ? translate('general:copied')
                      : translate('general:copy')
                  }
                  placement="top"
                >
                  <div
                    css={`
                      width: 13px;
                      height: 14px;
                      margin: 0;
                      margin-left: 10px;
                    `}
                  >
                    <FontAwesomeIcon
                      icon={faCopy}
                      onClick={() =>
                        copy(
                          setCopiedUuid,
                          dashUuid(currentAccount.selectedProfile.id)
                        )
                      }
                    />
                  </div>
                </Tooltip>
              </Uuid>
            </UuidContainer>
          </div>
        </PersonalDataContainer>
      </PersonalData>
      <Hr />
      <Language>
        <Title>{translate('general:language')}</Title>
        <div>
          <div
            css={`
              width: 400px;
            `}
          >
            {translate('general:language_description')}
          </div>
          <Select
            css={`
              width: 100px;
            `}
            onChange={v => {
              dispatch(
                openModal('ActionConfirmation', {
                  message: translate('general:confirm_language_change'),
                  confirmCallback: changeLanguageAndRestartApp,
                  abortCallback: cancelLanguageChange,
                  title: translate('general:confirm')
                })
              );
              dispatch(updateLanguage(v));
            }}
            value={language}
            virtual={false}
          >
            <Select.Option value="en_US">
              {translate('general:english')}
            </Select.Option>
            <Select.Option value="fr_FR">
              {translate('general:french')}
            </Select.Option>
          </Select>
        </div>
      </Language>
      <ReleaseChannel>
        <Title>{translate('general:release_channel')}</Title>
        <div>
          <div
            css={`
              width: 400px;
            `}
          >
            {translate('general:release_channel_description')}
          </div>
          <Select
            css={`
              width: 100px;
            `}
            onChange={async e => {
              const appData = await ipcRenderer.invoke('getAppdataPath');
              setReleaseChannel(e);
              await fsa.writeFile(
                path.join(appData, 'gdlauncher_next', 'rChannel'),
                e.toString()
              );
            }}
            value={releaseChannel}
            virtual={false}
          >
            <Select.Option value={0}>
              {translate('general:stable')}
            </Select.Option>
            <Select.Option value={1}>{translate('general:beta')}</Select.Option>
          </Select>
        </div>
      </ReleaseChannel>
      <Hr />
      <Title>
        {translate('general:concurrent_downloads')} &nbsp;{' '}
        <FontAwesomeIcon icon={faTachometerAlt} />
      </Title>
      <ParallelDownload>
        <p
          css={`
            margin: 0;
            width: 400px;
          `}
        >
          {translate('general:concurrent_downloads_description')}
        </p>

        <Select
          onChange={v => dispatch(updateConcurrentDownloads(v))}
          value={concurrentDownloads}
          css={`
            width: 100px;
            text-align: start;
          `}
          virtual={false}
        >
          {[...Array(20).keys()]
            .map(x => x + 1)
            .map(x => (
              <Select.Option key={x} value={x}>
                {x}
              </Select.Option>
            ))}
        </Select>
      </ParallelDownload>
      <Hr />
      <Title>
        {translate('general:preferred_curse_release_channel')} &nbsp;{' '}
        <FontAwesomeIcon icon={faFire} />
      </Title>
      <ParallelDownload>
        <p
          css={`
            margin: 0;
            width: 400px;
          `}
        >
          {translate('general:preferred_curse_release_channel_description')}
        </p>
        <Select
          css={`
            width: 100px;
            text-align: start;
          `}
          onChange={e => dispatch(updateCurseReleaseChannel(e))}
          value={curseReleaseChannel}
          virtual={false}
        >
          <Select.Option value={1}>{translate('general:stable')}</Select.Option>
          <Select.Option value={2}>{translate('general:beta')}</Select.Option>
          <Select.Option value={3}>{translate('general:alpha')}</Select.Option>
        </Select>
      </ParallelDownload>
      <Hr />
      <Title
        css={`
          margin-top: 0px;
        `}
      >
        {translate('general:discord_integration')} &nbsp;{' '}
        <FontAwesomeIcon icon={faDiscord} />
      </Title>
      <DiscordRpc>
        <p
          css={`
            width: 350px;
          `}
        >
          {translate('general:discord_integration_description')}
        </p>
        <Switch
          onChange={e => {
            dispatch(updateDiscordRPC(e));
            if (e) {
              ipcRenderer.invoke('init-discord-rpc');
            } else {
              ipcRenderer.invoke('shutdown-discord-rpc');
            }
          }}
          checked={DiscordRPC}
        />
      </DiscordRpc>
      <Hr />
      <Title
        css={`
          margin-top: 0px;
        `}
      >
        {translate('general:minecraft_news')} &nbsp;{' '}
        <FontAwesomeIcon icon={faNewspaper} />
      </Title>
      <DiscordRpc>
        <p
          css={`
            width: 350px;
          `}
        >
          {translate('general:minecraft_news_description')}
        </p>
        <Switch
          onChange={e => {
            dispatch(updateShowNews(e));
          }}
          checked={showNews}
        />
      </DiscordRpc>
      <Hr />
      <Title
        css={`
          margin-top: 0px;
        `}
      >
        {translate('general:hide_launcher_while_playing')} &nbsp;{' '}
        <FontAwesomeIcon icon={faPlay} />
      </Title>
      <DiscordRpc
        css={`
          margin-bottom: 30px;
        `}
      >
        <p
          css={`
            width: 500px;
          `}
        >
          {translate('general:hide_launcher_while_playing_description')}
        </p>
        <Switch
          onChange={e => {
            dispatch(updateHideWindowOnGameLaunch(e));
          }}
          checked={hideWindowOnGameLaunch}
        />
      </DiscordRpc>
      <Hr />
      <Title
        css={`
          margin-top: 0px;
        `}
      >
        {translate('general:potato_pc_mode')} &nbsp;{' '}
        <FontAwesomeIcon icon={faToilet} />
      </Title>
      <DiscordRpc
        css={`
          margin-bottom: 30px;
        `}
      >
        <p
          css={`
            width: 500px;
          `}
        >
          {translate('general:potato_pc_mode_description')}
        </p>
        <Switch
          onChange={e => {
            dispatch(updatePotatoPcMode(e));
          }}
          checked={potatoPcMode}
        />
      </DiscordRpc>
      <Hr />
      <Title
        css={`
          width: 300px;
          float: left;
        `}
      >
        {translate('general:clear_shared_data')}&nbsp;{' '}
        <FontAwesomeIcon icon={faTrash} />
      </Title>
      <div
        css={`
          display: flex;
          justify-content: space-between;
          text-align: left;
          width: 100%;
          margin-bottom: 30px;
          p {
            text-align: left;
            color: ${props => props.theme.palette.text.third};
          }
        `}
      >
        <p
          css={`
            margin: 0;
            width: 500px;
          `}
        >
          {translate('general:clear_shared_data_description')}
        </p>
        <Button
          onClick={() => {
            dispatch(
              openModal('ActionConfirmation', {
                message: translate('general:confirm_data_deletion'),
                confirmCallback: clearSharedData,
                title: translate('general:confirm')
              })
            );
          }}
          disabled={disableInstancesActions}
          loading={deletingInstances}
        >
          {translate('general:clear')}
        </Button>
      </div>
      <Hr />
      {/* {process.env.REACT_APP_RELEASE_TYPE === 'setup' && ( */}
      <CustomDataPathContainer>
        <Title
          css={`
            width: 400px;
            float: left;
          `}
        >
          {translate('general:user_data_path')}&nbsp;{' '}
          <FontAwesomeIcon icon={faFolder} />
          <a
            css={`
              margin-left: 0px;
            `}
            onClick={async () => {
              const appData = await ipcRenderer.invoke('getAppdataPath');
              const appDataPath = path.join(appData, 'gdlauncher_next');
              setDataPath(appDataPath);
            }}
          >
            {translate('general:reset_path')}
          </a>
        </Title>
        <div
          css={`
            display: flex;
            justify-content: space-between;
            text-align: left;
            width: 100%;
            height: 30px;
            margin: 20px 0 10px 0;
            p {
              text-align: left;
              color: ${props => props.theme.palette.text.third};
            }
          `}
        >
          <Input
            value={dataPath}
            onChange={e => setDataPath(e.target.value)}
            disabled={
              loadingMoveUserData ||
              deletingInstances ||
              disableInstancesActions
            }
          />
          <Button
            css={`
              margin-left: 20px;
            `}
            onClick={openFolder}
            disabled={loadingMoveUserData || deletingInstances}
          >
            <FontAwesomeIcon icon={faFolder} />
          </Button>
          <Button
            css={`
              margin-left: 20px;
            `}
            onClick={changeDataPath}
            disabled={
              disableInstancesActions ||
              userData === dataPath ||
              !dataPath ||
              dataPath.length === 0 ||
              deletingInstances
            }
            loading={loadingMoveUserData}
          >
            {translate('general:apply_and_restart')}
          </Button>
        </div>
        <div
          css={`
            display: flex;
            justify-content: flex-start;
            width: 100%;
          `}
        >
          <Checkbox
            onChange={e => {
              setMoveUserData(e.target.checked);
            }}
          >
            {translate('general:copy_current_data_to_new_directory')}
          </Checkbox>
        </div>
      </CustomDataPathContainer>
      {/* )} */}
      <Hr />
      <LauncherVersion>
        <div
          css={`
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 10px 0;
          `}
        >
          <HorizontalLogo
            size={200}
            onClick={() => dispatch(openModal('ChangeLogs'))}
          />{' '}
          <div
            css={`
              margin-left: 10px;
            `}
          >
            v {version}
          </div>
        </div>
        <p>
          {updateAvailable
            ? translate('general:update_available')
            : translate('general:latest_update')}
        </p>
        <div
          css={`
            margin-top: 20px;
            height: 36px;
            display: flex;
            flex-direction: row;
          `}
        >
          {updateAvailable ? (
            <Button
              onClick={() =>
                ipcRenderer.invoke('installUpdateAndQuitOrRestart')
              }
              css={`
                margin-right: 10px;
              `}
              type="primary"
            >
              {translate('general:update')} &nbsp;
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          ) : (
            <div
              css={`
                width: 96px;
                height: 36px;
                padding: 6px 8px;
              `}
            >
              {translate('general:up_to_date')}
            </div>
          )}
        </div>
      </LauncherVersion>
    </MyAccountPrf>
  );
};

export default memo(General);
