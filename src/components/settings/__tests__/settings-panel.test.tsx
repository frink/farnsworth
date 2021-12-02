import { DeviceInfo, DeviceKind } from 'media-devices';
import renderer from '../../../testing/renderer';
import { SettingsPanel, mapStateToProps } from '../settings-panel';
import initialState from '../../../reducers/initial-state';

describe('SettingsPanel', () => {
  function createSource(override?: Partial<DeviceInfo>): DeviceInfo {
    return {
      kind: DeviceKind.AudioInput,
      label: 'Device Label',
      groupId: 'group-id',
      deviceId: 'device-id',
      ...override,
    };
  }

  const setup = renderer(SettingsPanel, {
    getDefaultProps: () => ({
      changeDevice: jest.fn(),
      audioSources: [createSource({ kind: DeviceKind.AudioInput })],
      videoSources: [
        createSource({ kind: DeviceKind.VideoInput }),
        createSource({ kind: DeviceKind.VideoInput }),
      ],
    }),
  });

  it('renders an option for every device', () => {
    const { findByTestId, props } = setup();

    expect(findByTestId('audio-source-option').length).toBe(
      props.audioSources.length,
    );

    expect(findByTestId('video-source-option').length).toBe(
      props.videoSources.length,
    );
  });

  it('disables the inputs if there are no options', () => {
    const { findByTestId } = setup({ audioSources: [], videoSources: [] });

    expect(findByTestId('choose-audio-source').prop('disabled')).toBe(true);
    expect(findByTestId('choose-video-source').prop('disabled')).toBe(true);
  });

  it('gets the new device when you request it', () => {
    const { findByTestId, props } = setup({
      videoSources: [createSource()],
    });

    const [video] = props.videoSources;
    findByTestId('choose-video-source').simulate('change', {
      currentTarget: { value: video.deviceId },
    });

    expect(props.changeDevice).toHaveBeenCalledWith({
      video: {
        deviceId: { exact: video.deviceId },
      },
    });
  });

  describe('mapStateToProps', () => {
    it('returns the expected props', () => {
      const props = mapStateToProps(initialState);

      expect(props).toMatchInlineSnapshot(`
        Object {
          "audioSources": Array [],
          "videoSources": Array [],
        }
      `);
    });
  });
});
