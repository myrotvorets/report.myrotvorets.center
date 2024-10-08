import { h } from 'preact';
import { Criminal } from '../../api/myrotvorets';

import './criminal.scss';

interface Props {
    criminal: Criminal;
}

function getThumbnailURL({ attachments }: Criminal): string | null {
    if (attachments) {
        for (const a of attachments) {
            if (a.type.startsWith('image')) {
                return a.url.replace(/\.([a-z]+)$/u, '-150x150.$1');
            }
        }
    }

    return null;
}

export default function CriminalRecord({ criminal }: Readonly<Props>): h.JSX.Element {
    const thumbnail = getThumbnailURL(criminal);

    return (
        <dl className="Criminal">
            {thumbnail && (
                <dt className="thumb">
                    <img src={thumbnail} alt={criminal.name} />
                </dt>
            )}
            <dt>ПІБ</dt>
            <dd>
                <a href={criminal.link} target="_blank" rel="noopener noreferrer">
                    {criminal.name}
                </a>
            </dd>

            <dt>Дата народження</dt>
            <dd>
                {criminal.dob !== '0000-00-00'
                    ? new Date(criminal.dob).toLocaleDateString('uk-UA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                      })
                    : 'Н/Д'}
            </dd>

            <dt>Країна</dt>
            <dd>
                {criminal.country === 'Россия' ? (
                    <span className="blood">
                        Россия
                        <span className="drop" />
                        <span className="drop" />
                        <span className="drop" />
                        <span className="drop" />
                        <span className="drop" />
                        <span className="drop" />
                        <span className="drop" />
                    </span>
                ) : // eslint-disable-next-line sonarjs/no-nested-conditional
                criminal.country ? (
                    criminal.country
                ) : (
                    'Н/Д'
                )}
            </dd>

            <dt>Адреса</dt>
            <dd>{criminal.address ? criminal.address : 'Н/Д'}</dd>
        </dl>
    );
}
