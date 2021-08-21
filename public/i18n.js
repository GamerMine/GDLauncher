import i18next from 'i18next';

import enUSLogin from './locales/en_US/Login.json';
import enUSSystemNavbar from './locales/en_US/SystemNavbar.json';
import enUSInstance from './locales/en_US/Instance.json';
import enUSGeneral from './locales/en_US/General.json';
import enUSJava from './locales/en_US/Java.json';
import enUSModsBrowser from './locales/en_US/ModsBrowser.json';
import enUSInstanceManager from './locales/en_US/InstanceManager.json';
import enUSAccountsManager from './locales/en_US/AccountsManager.json';
import enUSAddAccount from './locales/en_US/AddAccount.json';
import enUSAddInstance from './locales/en_US/AddInstance.json';
import enUSInstanceExport from './locales/en_US/InstanceExport.json';
import enUSAutoUpdateNotAvailable from './locales/en_US/AutoUpdateNotAvailable.json';
import enUSBisectHosting from './locales/en_US/BisectHosting.json';
import enUSInstanceCrashed from './locales/en_US/InstanceCrashed.json';
import enUSInstancesMigration from './locales/en_US/InstancesMigration.json';
import enUSModsUpdater from './locales/en_US/ModsUpdater.json';
import enUSScreenshot from './locales/en_US/Screenshot.json';

import frFRLogin from './locales/fr_FR/Login.json';
import frFRSystemNavbar from './locales/fr_FR/SystemNavbar.json';
import frFRInstance from './locales/fr_FR/Instance.json';
import frFRGeneral from './locales/fr_FR/General.json';
import frFRJava from './locales/fr_FR/Java.json';
import frFRModsBrowser from './locales/fr_FR/ModsBrowser.json';
import frFRInstanceManager from './locales/fr_FR/InstanceManager.json';
import frFRAccountsManager from './locales/fr_FR/AccountsManager.json';
import frFRAddAccount from './locales/fr_FR/AddAccount.json';
import frFRAddInstance from './locales/fr_FR/AddInstance.json';
import frFRInstanceExport from './locales/fr_FR/InstanceExport.json';
import frFRAutoUpdateNotAvailable from './locales/fr_FR/AutoUpdateNotAvailable.json';
import frFRBisectHosting from './locales/fr_FR/BisectHosting.json';
import frFRInstanceCrashed from './locales/fr_FR/InstanceCrashed.json';
import frFRInstancesMigration from './locales/fr_FR/InstancesMigration.json';
import frFRModsUpdater from './locales/fr_FR/ModsUpdater.json';
import frFRScreenshot from './locales/fr_FR/Screenshot.json';

const resources = {
  en_US: {
    login: enUSLogin,
    systemNavbar: enUSSystemNavbar,
    instance: enUSInstance,
    general: enUSGeneral,
    java: enUSJava,
    modsBrowser: enUSModsBrowser,
    instanceManager: enUSInstanceManager,
    accountsManager: enUSAccountsManager,
    addAccount: enUSAddAccount,
    addInstance: enUSAddInstance,
    instanceExport: enUSInstanceExport,
    autoUpdateNotAvailable: enUSAutoUpdateNotAvailable,
    bisectHosting: enUSBisectHosting,
    instanceCrashed: enUSInstanceCrashed,
    instancesMigration: enUSInstancesMigration,
    modsUpdater: enUSModsUpdater,
    screenshot: enUSScreenshot
  },
  fr_FR: {
    login: frFRLogin,
    systemNavbar: frFRSystemNavbar,
    instance: frFRInstance,
    general: frFRGeneral,
    java: frFRJava,
    modsBrowser: frFRModsBrowser,
    instanceManager: frFRInstanceManager,
    accountsManager: frFRAccountsManager,
    addAccount: frFRAddAccount,
    addInstance: frFRAddInstance,
    instanceExport: frFRInstanceExport,
    autoUpdateNotAvailable: frFRAutoUpdateNotAvailable,
    bisectHosting: frFRBisectHosting,
    instanceCrashed: frFRInstanceCrashed,
    instancesMigration: frFRInstancesMigration,
    modsUpdater: frFRModsUpdater,
    screenshot: frFRScreenshot
  }
};

i18next.init({
  resources,
  fallbackLng: 'en_US',
  interpolation: {
    escapeValue: false
  }
});

export function translate(word) {
  return i18next.t(word);
}
