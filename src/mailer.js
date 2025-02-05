const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const { mailUser, mailPass, mailFrom, smtpSecure } = require('./config');

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: smtpSecure || false,
    auth: { user: mailUser, pass: mailPass },
});

// Função para validar transporte antes de enviar emails
async function verifyTransporter() {
    try {
        await transporter.verify();
        logger.info('SMTP Transporter is ready to send emails.');
    } catch (error) {
        logger.error('SMTP Transporter verification failed:', error);
        process.exit(1);
    }
}


async function loadTemplate(templateName) {
    try {
        const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
        await fs.access(templatePath);
        return await fs.readFile(templatePath, 'utf8');
    } catch (error) {
        logger.error(`Erro ao carregar template "${templateName}": ${error.message}`);
        return null;
    }
}

function replacePlaceholders(templateContent, properties) {
    return templateContent.replace(/{{\s*(\w+)\s*}}/g, (match, key) => properties[key] || '[Não informado - MAIL SERVER]');
}

async function sendMail({ email, properties, subject, template }) {
    if (!email || !subject || !template) {
        logger.error('Parâmetros obrigatórios ausentes: email, subject ou template');
        return;
    }

    const templateContent = await loadTemplate(template);
    if (!templateContent) return;

    const htmlContent = replacePlaceholders(templateContent, properties);

    const mailOptions = {
        from: mailFrom,
        to: email,
        subject: subject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email enviado para ${email}: ${info.response}`);
        return info;
    } catch (error) {
        logger.error(`Falha ao enviar email: ${error.message}`);
        throw error;
    }
}

module.exports = { sendMail, verifyTransporter };
