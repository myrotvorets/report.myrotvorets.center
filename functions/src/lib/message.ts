import type { ReportEntry } from '../types';

export function buildMessageFromReportEntry(entry: ReportEntry, storageLink: string, archivePassword: string): string {
    const msg: string[] = [];
    if (entry.clink) {
        msg.push(`Обновление информации о записи ${entry.clink} (${entry.cname})\n`);
    }

    if (entry.name) {
        msg.push(`ФИО: ${entry.name}`);
    }

    if (entry.country) {
        msg.push(`Страна: ${entry.country}`);
    }

    if (entry.dob) {
        msg.push(`Дата рождения: ${entry.dob.split('-').reverse().join('.')}`);
    }

    if (entry.address) {
        msg.push(`Адрес: ${entry.address}`);
    }

    if (entry.phone) {
        msg.push(`Телефон: ${entry.phone}`);
    }

    msg.push(`\nОписание:\n${entry.description}\n`);

    if (entry.note) {
        msg.push(`Примечание: ${entry.note}`);
    }

    if (storageLink) {
        msg.push(`Дополнительные материалы (ссылка действительна 45 дней): ${storageLink}`);
    }

    const email = entry.email;
    msg.push('');
    msg.push(`Email отправителя: ${email}`);
    msg.push(`IP отправителя: ${entry.ips}`);
    msg.push(`User-Agent: ${entry.ua}`);

    return msg.join('\n');
}
