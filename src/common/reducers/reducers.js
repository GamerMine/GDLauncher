import omit from 'lodash/omit';
import * as ActionTypes from './actionTypes';
import PromiseQueue from '../../app/desktop/utils/PromiseQueue';

function news(state = [], action) {
  switch (action.type) {
    case ActionTypes.UPDATE_NEWS:
      return action.news;
    default:
      return state;
  }
}

function message(state = null, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_MESSAGE:
      return action.message;
    default:
      return state;
  }
}

function userData(state = null, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_USERDATA:
      return action.path;
    default:
      return state;
  }
}

function downloadQueue(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_DOWNLOAD_TO_QUEUE:
      return {
        ...state,
        [action.instanceName]: {
          loader: action.loader,
          manifest: action.manifest,
          filesToDownload: action.filesToDownload,
          steps: [],
          ...action.settings
        }
      };
    case ActionTypes.REMOVE_DOWNLOAD_FROM_QUEUE:
      return omit(state, action.instanceName);
    case ActionTypes.DOWNLOAD_NEXT_STEP:
      return {
        ...state,
        [action.instanceName]: {
          ...state[action.instanceName],
          steps: state[action.instanceName].steps.slice(1)
        }
      };
    default:
      return state;
  }
}

function currentDownload(state = null, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_CURRENT_DOWNLOAD:
      return action.instanceName;
    default:
      return state;
  }
}

function instances(state = { started: false, list: {} }, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_INSTANCES:
      // eslint-disable-next-line
      for (const instance1 in action.instances) {
        const instance = action.instances[instance1];
        // eslint-disable-next-line
        if (!instance) continue;
        if (!instance.name) {
          // eslint-disable-next-line
          instance.name = instance1;
        }
        if (state.list[instance.name]?.queue) {
          // eslint-disable-next-line
          instance.queue = state.list[instance.name].queue;
        } else {
          // eslint-disable-next-line
          instance.queue = new PromiseQueue();
        }
      }
      return { ...state, list: action.instances };
    case ActionTypes.UPDATE_INSTANCES_STARTED:
      return { ...state, started: action.started };
    default:
      return state;
  }
}

function servers(state = { started: false, list: {} }, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SERVERS:
      // eslint-disable-next-line
      for (const instance1 in action.servers) {
        const server = action.servers[instance1];
        // eslint-disable-next-line
        if (!server) continue;
        if (!server.name) {
          // eslint-disable-next-line
          server.name = instance1;
        }
        if (state.list[server.name]?.queue) {
          // eslint-disable-next-line
          server.queue = state.list[server.name].queue;
        } else {
          // eslint-disable-next-line
          server.queue = new PromiseQueue();
        }
      }
      return { ...state, list: action.server };
    case ActionTypes.UPDATE_SERVERS_STARTED:
      return { ...state, started: action.started };
    default:
      return state;
  }
}

function startedInstances(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_STARTED_INSTANCE:
      return {
        ...state,
        [action.instance.instanceName]: {
          pid: action.instance.pid,
          initialized: false,
          position: action.instance.position
        }
      };
    case ActionTypes.UPDATE_STARTED_INSTANCE:
      return {
        ...state,
        [action.instance.instanceName]: {
          ...state[action.instance.instanceName],
          initialized: true
        }
      };
    case ActionTypes.REMOVE_STARTED_INSTANCE:
      return omit(state, [action.instanceName]);
    default:
      return state;
  }
}

function startedServers(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_STARTED_SERVER:
      return {
        ...state,
        [action.server.serverName]: {
          pid: action.server.pid,
          initialized: false,
          position: action.server.position
        }
      };
    case ActionTypes.UPDATE_STARTED_SERVER:
      return {
        ...state,
        [action.server.serverName]: {
          ...state[action.server.serverName],
          initialized: true
        }
      };
    case ActionTypes.REMOVE_STARTED_SERVER:
      return omit(state, [action.serverName]);
    default:
      return state;
  }
}

function selectedInstance(state = null, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SELECTED_INSTANCE:
      return action.instanceName;
    default:
      return state;
  }
}

function selectedServer(state = null, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SELECTED_SERVER:
      return action.serverName;
    default:
      return state;
  }
}

function updateAvailable(state = false, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_UPDATE_AVAILABLE:
      return action.updateAvailable;
    default:
      return state;
  }
}

function latestModManifests(state = {}, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_MOD_MANIFESTS:
      return { ...state, ...action.manifests };
    case ActionTypes.CLEAR_MOD_MANIFESTS:
      return {};
    default:
      return state;
  }
}

export default {
  userData,
  news,
  message,
  downloadQueue,
  currentDownload,
  instances,
  servers,
  startedInstances,
  startedServers,
  selectedInstance,
  selectedServer,
  updateAvailable,
  latestModManifests
};
