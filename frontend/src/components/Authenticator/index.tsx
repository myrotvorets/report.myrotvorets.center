import { h } from 'preact';
import { route } from 'preact-router';
import CodeVerifier from '../CodeVerifier';
import { lsGet } from '../../utils/localstorage';

function isSignInWithEmailLink(link: string): boolean {
    try {
        const { searchParams } = new URL(link);
        return (
            searchParams.has('apiKey') &&
            searchParams.has('oobCode') &&
            searchParams.has('mode') &&
            searchParams.get('mode') === 'signIn'
        );
    } catch (e) {
        return false;
    }
}

export default function Authenticator(): h.JSX.Element | null {
    if (typeof window !== 'undefined') {
        const link = window.location.href;

        if (isSignInWithEmailLink(link)) {
            const { searchParams } = new URL(link);
            if (searchParams.has('continueUrl')) {
                // #12: Failed to construct 'URL': Invalid URL if someone tampers with the URL
                try {
                    const url = new URL(searchParams.get('continueUrl') as string);
                    if (
                        url.hostname !== window.location.hostname &&
                        /^(report\.myrotvorets\.(center|dev)|localhost)$/i.test(url.hostname)
                    ) {
                        window.location.host = url.host;
                        return null;
                    }
                } catch (e) {
                    // Do nothing
                }
            }

            const email = lsGet('email');
            return <CodeVerifier link={link} email={email} />;
        }
    }

    route('/');
    return null;
}
