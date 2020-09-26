import { h } from 'preact';
import { Criminal } from '../../api/myrotvorets';

import './criminal.scss';

interface Props {
    criminal: Criminal;
}

function getThumbnailURL({ attachments }: Criminal): string | null {
    if (attachments) {
        for (let i = 0; i < attachments.length; ++i) {
            const a = attachments[i];
            if (a.type.slice(0, 5) === 'image') {
                return a.url.replace(/\.([a-z]+)$/, '-150x150.$1');
            }
        }
    }

    return null;
}

export default function CriminalRecord({ criminal }: Props): h.JSX.Element {
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
                ) : criminal.country ? (
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
