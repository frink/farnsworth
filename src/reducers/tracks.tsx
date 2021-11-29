import { createReducer } from 'retreon';
import initialState from './initial-state';
import * as actions from '../actions';

export default createReducer(initialState, (handleAction) => [
  handleAction(actions.devices.requestMediaDevices, (state, newTracks) => {
    newTracks.forEach((track) => {
      state.tracks[track.trackId] = {
        kind: track.kind,
        enabled: track.enabled,
        local: true,
      };
    });
  }),

  handleAction(actions.tracks.add, (state, { track }) => {
    state.tracks[track.id] = {
      kind: track.kind,
      enabled: track.enabled,
      local: false,
    };
  }),

  handleAction(actions.tracks.pause, (state, trackId) => {
    state.tracks[trackId].enabled = false;
  }),

  handleAction(actions.tracks.resume, (state, trackId) => {
    state.tracks[trackId].enabled = true;
  }),

  handleAction(actions.tracks.toggle, (state, trackId) => {
    state.tracks[trackId].enabled = !state.tracks[trackId].enabled;
  }),

  handleAction(actions.tracks.markPaused, (state, kind) => {
    for (const track of Object.values(state.tracks)) {
      if (track.kind === kind && !track.local) {
        track.enabled = false;
      }
    }
  }),

  handleAction(actions.tracks.markResumed, (state, kind) => {
    for (const track of Object.values(state.tracks)) {
      if (track.kind === kind && !track.local) {
        track.enabled = true;
      }
    }
  }),
]);
