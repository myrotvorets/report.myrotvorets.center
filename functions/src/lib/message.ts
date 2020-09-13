import type { Request } from 'express';
import type { AddUpdateRequestBody } from '../types';

export function buildMessage(req: Request<Record<string, string>, unknown, AddUpdateRequestBody>): string {
    const msg: string[] = [];
    const ips = req.ips;
    if (!ips.length) {
        ips.push(req.ip);
    }

    if (req.criminal) {
        msg.push(`Обновление информации о записи ${req.criminal.link} (${req.criminal.name})\n`);
    }

    if (req.body.name) {
        msg.push(`ФИО: ${req.body.name}`);
    }

    if (req.body.country) {
        msg.push(`Страна: ${req.body.country}`);
    }

    if (req.body.dob) {
        msg.push(`Дата рождения: ${req.body.dob.toISOString().split('T')[0].split('-').reverse().join('.')}`);
    }

    if (req.body.address) {
        msg.push(`Адрес: ${req.body.address}`);
    }

    if (req.body.phone) {
        msg.push(`Телефон: ${req.body.phone}`);
    }

    msg.push(`\nОписание:\n${req.body.description}\n`);

    if (req.body.note) {
        msg.push(`Примечание: ${req.body.note}`);
    }

    if (req.storageLink && req.archivePassword) {
        msg.push(`Дополнительные материалы (ссылка действительна 45 дней): ${req.storageLink}`);
        msg.push(`Пароль на архив: ${req.archivePassword}`);
    }

    const email = req.user?.email as string;
    msg.push('');
    msg.push(`Email отправителя: ${email}`);
    msg.push(`IP отправителя: ${ips.join(', ')}`);
    msg.push(`User-Agent: ${req.headers['user-agent'] || ''}`);

    return msg.join('\n');
}
