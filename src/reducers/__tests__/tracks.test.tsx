import createStore from '../../utils/create-store';
import * as actions from '../../actions';
import * as deviceEffects from '../../effects/devices';
import { TrackKind, MY_PARTICIPANT_ID } from '../../utils/constants';

jest.mock('../../effects/devices');

const mockedEffects: jest.Mocked<typeof deviceEffects> = deviceEffects as any;

describe('Tracks reducer', () => {
  function setup() {
    const store = createStore();

    return {
      store,
    };
  }

  beforeEach(() => {
    mockedEffects.requestMediaDevices.mockResolvedValue([
      {
        kind: TrackKind.Audio,
        trackId: 'first',
        deviceId: 'mic',
        enabled: true,
      },
      {
        kind: TrackKind.Video,
        trackId: 'second',
        deviceId: 'cam',
        enabled: true,
      },
    ]);
  });

  describe('devices.requestMediaDevices()', () => {
    it('adds the new tracks', async () => {
      const { store } = setup();
      await store.dispatch(actions.devices.requestMediaDevices());

      expect(store.getState().tracks).toMatchInlineSnapshot(`
        Object {
          "first": Object {
            "enabled": true,
            "kind": "audio",
            "local": true,
          },
          "second": Object {
            "enabled": true,
            "kind": "video",
            "local": true,
          },
        }
      `);
    });
  });

  describe('tracks.add()', () => {
    it('indexes the track with the others', () => {
      const { store } = setup();

      const track = new MediaStreamTrack();
      store.dispatch(
        actions.tracks.add({
          track,
          peerId: MY_PARTICIPANT_ID,
        }),
      );

      expect(store.getState().tracks).toMatchObject({
        [track.id]: { kind: track.kind, enabled: track.enabled, local: false },
      });
    });
  });

  describe('tracks.pause()', () => {
    it('marks the track disabled', () => {
      const { store } = setup();

      const track = new MediaStreamTrack();
      track.enabled = true;

      store.dispatch(
        actions.tracks.add({
          track,
          peerId: MY_PARTICIPANT_ID,
        }),
      );

      store.dispatch(
        actions.tracks.pause({
          trackId: track.id,
          kind: track.kind as TrackKind,
        }),
      );

      expect(store.getState().tracks).toMatchObject({
        [track.id]: { enabled: false },
      });
    });
  });

  describe('tracks.resume()', () => {
    it('marks the track disabled', () => {
      const { store } = setup();

      const track = new MediaStreamTrack();
      track.enabled = false;

      store.dispatch(
        actions.tracks.add({
          track,
          peerId: MY_PARTICIPANT_ID,
        }),
      );

      store.dispatch(
        actions.tracks.resume({
          trackId: track.id,
          kind: track.kind as TrackKind,
        }),
      );

      expect(store.getState().tracks).toMatchObject({
        [track.id]: { enabled: true },
      });
    });
  });

  describe('tracks.toggle()', () => {
    it('marks the track disabled', () => {
      const { store } = setup();

      const track = new MediaStreamTrack();
      track.enabled = true;

      store.dispatch(
        actions.tracks.add({
          track,
          peerId: MY_PARTICIPANT_ID,
        }),
      );

      store.dispatch(
        actions.tracks.toggle({
          trackId: track.id,
          kind: track.kind as TrackKind,
        }),
      );

      expect(store.getState().tracks).toMatchObject({
        [track.id]: { enabled: false },
      });
    });
  });

  describe('markPaused', () => {
    it('marks all remote streams of the same kind as paused', () => {
      const { store } = setup();

      const track = new MediaStreamTrack();
      track.enabled = true;

      store.dispatch(
        actions.tracks.add({
          track,
          peerId: MY_PARTICIPANT_ID,
        }),
      );

      store.dispatch(actions.tracks.markPaused(track.kind as TrackKind));

      expect(store.getState().tracks).toMatchObject({
        [track.id]: { enabled: false },
      });
    });
  });

  describe('markResumed', () => {
    it('marks all remote streams of the same kind as enabled', () => {
      const { store } = setup();

      const track = new MediaStreamTrack();
      track.enabled = false;

      store.dispatch(
        actions.tracks.add({
          track,
          peerId: MY_PARTICIPANT_ID,
        }),
      );

      store.dispatch(actions.tracks.markResumed(track.kind as TrackKind));

      expect(store.getState().tracks).toMatchObject({
        [track.id]: { enabled: true },
      });
    });
  });
});
