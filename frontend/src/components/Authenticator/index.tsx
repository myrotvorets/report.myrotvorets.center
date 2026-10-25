import { h } from 'preact';
import { useEffect } from 'preact/hooks';
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
    } catch {
        return false;
    }
}

export default function Authenticator(): h.JSX.Element | null {
    const link = typeof window !== 'undefined' ? window.location.href : '';
    const isSignIn = isSignInWithEmailLink(link);
    let redirectHref: string | undefined;

    if (isSignIn) {
        const { searchParams } = new URL(link);
        if (searchParams.has('continueUrl')) {
            // #12: Failed to construct 'URL': Invalid URL if someone tampers with the URL
            try {
                const url = new URL(searchParams.get('continueUrl')!);
                if (
                    url.hostname !== window.location.hostname &&
                    /^(report\.myrotvorets\.(center|dev)|localhost)$/iu.test(url.hostname)
                ) {
                    const redirectUrl = new URL(link);
                    redirectUrl.host = url.host;
                    redirectHref = redirectUrl.href;
                }
            } catch {
                // Do nothing
            }
        }
    }

    useEffect(() => {
        if (redirectHref) {
            window.location.assign(redirectHref);
        } else if (!isSignIn) {
            route('/');
        }
    }, [redirectHref, isSignIn]);

    if (isSignIn && !redirectHref) {
        const email = lsGet('email');
        return <CodeVerifier link={link} email={email} />;
    }

    return null;
}
