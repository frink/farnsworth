import { State } from '../reducers/initial-state';
import context from '../conferencing/global-context';
import Logger from '../utils/logger';

const logger = new Logger('gc');

/**
 * The global `context` object only serves to store values redux can't store
 * itself (non-serializable). When redux no longer uses those objects, they
 * should be destroyed.
 *
 * Although the garbage collection could be done manually in action effects,
 * that leaves a tiny race condition where redux holds null pointers, and opens
 * a larger concern about forgetting to delete resources.
 *
 * This serves as an automatic mechanism. If a reducer drops a reference to
 * a resource, it is automatically deallocated. No space to forget, no null
 * pointers.
 */
export function run(state: State) {
  discardUnusedTracks(state);
}

/** Terminate tracks no longer referenced by `state.tracks`. */
export function discardUnusedTracks(state: State) {
  Array.from(context.tracks.values())
    .filter(function isOrphanTrack(track) {
      return !state.tracks.hasOwnProperty(track.id);
    })
    .forEach(function discardTrack(track) {
      logger.debug('Deleting dereferenced track:', track.id);
      context.tracks.delete(track.id);
      track.stop();
    });
}
