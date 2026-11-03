export type Directive =
  | 'none'
  | 'client:load'
  | 'client:idle'
  | 'client:visible'
  | 'client:media'
  | 'client:only';

export interface DirectiveInfo {
  directive: Directive;
  trigger: string;
  useFor: string;
}

export const directives: readonly DirectiveInfo[] = [
  { directive: 'none', trigger: 'Never: HTML only', useFor: 'Text, cards, navigation without menus' },
  { directive: 'client:load', trigger: 'As soon as the page script runs', useFor: 'Controls the user needs in the first second' },
  { directive: 'client:idle', trigger: 'requestIdleCallback, or after load', useFor: 'Secondary widgets such as a search box' },
  { directive: 'client:visible', trigger: 'IntersectionObserver reports the element', useFor: 'Below-the-fold widgets' },
  { directive: 'client:media', trigger: 'A CSS media query matches', useFor: 'Widgets that only exist on some screen sizes' },
  { directive: 'client:only', trigger: 'On load, with no server render', useFor: 'Components that cannot run on the server' },
];

export interface IslandNeeds {
  /** Does the component do anything after the HTML arrives? */
  interactive: boolean;
  /** Does it read window, localStorage or other browser-only APIs while rendering? */
  browserOnly?: boolean;
  /** Is it visible in the first viewport? */
  aboveFold?: boolean;
  /** Must it respond the moment the page appears (menu toggle, cart button)? */
  critical?: boolean;
  /** Only needed when this media query matches, e.g. "(max-width: 50em)". */
  media?: string;
}

/**
 * Encodes the rule of thumb from Stage 3: the later JavaScript loads, the less
 * it competes with the content. Pick the latest trigger that still feels instant.
 */
export function chooseDirective(needs: IslandNeeds): Directive {
  if (!needs.interactive) return 'none';
  if (needs.browserOnly) return 'client:only';
  if (needs.media) return 'client:media';
  if (needs.aboveFold && needs.critical) return 'client:load';
  if (needs.aboveFold) return 'client:idle';
  return 'client:visible';
}
