export type Smiley = readonly [string, string]

export const SMILEYS: ReadonlyArray<Smiley> = [
    [ ":)", "smiley-smile" ],
    [ ";)", "smiley-wink" ],
    [ ":D", "smiley-biggrin" ],
    [ ":P", "smiley-tongue" ],
    [ ":O", "smiley-surprised" ],
    [ ":(", "smiley-frown" ],
    [ ";(", "smiley-cry" ],
    [ ":|", "smiley-speechless" ],
    [ ":arrow:", "smiley-arrow" ],
    [ ":up:", "smiley-up" ],
    [ ":down:", "smiley-down" ],
    [ ":confused:", "smiley-confused" ],
    [ ":mad:", "smiley-mad" ],
    [ ":lol:", "smiley-lol" ],
    [ ":joyful:", "smiley-joyful" ],
    [ ":cool:", "smiley-cool" ],
    [ ":ninja:", "smiley-ninja" ],
    [ ":innocent:", "smiley-innocent" ],
    [ ":rolleyes:", "smiley-rolleyes" ],
];

export function codeFor(smiley: Smiley): string {
    return smiley[0];
}

export function classFor(smiley: Smiley): string {
    return smiley[1];
}
