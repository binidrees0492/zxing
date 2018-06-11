import { TextEncoder as TextEncoderLegacy, TextDecoder as TextDecoderLegacy } from 'text-encoding';
import CharacterSetECI from './../common/CharacterSetECI';
import UnsupportedOperationException from '../UnsupportedOperationException';

/**
 * Responsible for en/decoding strings.
 */
export default class StringEncoding {

    /**
     * Decodes some Uint8Array to a string format.
     */
    public static decode(bytes: Uint8Array, encoding: string | CharacterSetECI): string {

        const encodingName = this.encodingName(encoding);

        // Node.js environment fallback.
        if (!StringEncoding.isBrowser()) {
            return new TextDecoderLegacy(encodingName).decode(bytes);
        }

        return new TextDecoder(encodingName).decode(bytes);
    }

    /**
     * Encodes some string into a Uint8Array.
     *
      * @todo natively support other string formats than UTF-8.
     */
    public static encode(s: string, encoding: string | CharacterSetECI): Uint8Array {

        const encodingName = this.encodingName(encoding);

        if (!StringEncoding.isBrowser()) {
            return new TextEncoderLegacy(encodingName, { NONSTANDARD_allowLegacyEncoding: true }).encode(s);
        }

        // TextEncoder only encodes to UTF8 by default as specified by encoding.spec.whatwg.org
        return new TextEncoder().encode(s);
    }

    private static isBrowser(): boolean {
        return typeof window !== 'undefined' && ({}).toString.call(window) === '[object Window]';
    }

    /**
     * Returns the string value from some encoding character set.
     */
    public static encodingName(encoding: string | CharacterSetECI): string {
        return typeof encoding === 'string'
            ? encoding
            : encoding.getName();
    }

    private static decodeFallBack(bytes: Uint8Array, encoding: string): string {

        const ec = CharacterSetECI.getCharacterSetECIByName(encoding);

        if (ec.equals(CharacterSetECI.UTF8) ||
            ec.equals(CharacterSetECI.ISO8859_1) ||
            ec.equals(CharacterSetECI.ASCII)) {

            let s = '';

            for (let i = 0, length = bytes.length; i < length; i++) {
                let h = bytes[i].toString(16);
                if (h.length < 2) {
                    h = '0' + h;
                }
                s += '%' + h;
            }

            return decodeURIComponent(s);
        }

        if (ec.equals(CharacterSetECI.UnicodeBigUnmarked)) {
            return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
        }

        throw new UnsupportedOperationException(`Encoding ${encoding} not supported by fallback.`);
    }
}
