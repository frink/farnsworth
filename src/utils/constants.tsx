// Never displayed to the user. Mainly used for logs.
export const APP_NAME = 'farnsworth';

export const MY_PARTICIPANT_ID = 'self';

// This decides the libp2p relay server. Make sure it exists in your `.env`
// file.
export const SERVER_ADDRESS = process.env.RELAY_SERVER_ADDRESS;

// A semicolon delimited list of STUN servers to use during signaling.
export const STUN_SERVERS = (process.env.STUN_SERVERS ?? '')
  .split(';')
  .filter(Boolean);

export enum TrackKind {
  Audio = 'audio',
  Video = 'video',
}

export enum TrackSource {
  /** A webcam or physical microphone. */
  Device = 'device',

  /** A shared screen or browser tab. */
  Display = 'display',
}

export enum RtcDescriptionType {
  Offer = 'offer',
  // ... incomplete ...
}

export enum RtcSignalingState {
  Stable = 'stable',
  HaveLocalOffer = 'have-local-offer',
  // ... incomplete ...
}

export enum ConnectionState {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Failed = 'failed',
}

export enum Routes {
  /** Alone, no active call. */
  Home = '/',

  /** Actively calling another user. */
  Call = '/call/:peerId',
}

export enum EventType {
  /** Pause a media track. */
  Pause = 'pause',

  /** Resume a media track. */
  Resume = 'resume',

  /** Send a chat message. */
  ChatMessage = 'chat-message',
}
