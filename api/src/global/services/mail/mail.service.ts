import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { MailConfig } from 'src/services/app-config/configuration';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';

type MailOptions = Mail.Options;

@Injectable()
export class MailService {
  private readonly fromValue: string;
  private transport: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly configService: ConfigService) {
    const {
      from,
      transportOptions: {
        host,
        port,
        auth: { user, pass },
      },
    } = configService.get<MailConfig>('mail') as MailConfig;

    this.fromValue = from;
    this.transport = createTransport({
      host,
      port,
      auth: {
        user,
        pass,
      },
    });
  }

  public async send(options: MailOptions): Promise<string> {
    const result = await this.transport.sendMail(options);

    return result.response;
  }

  public from(): string {
    return this.fromValue;
  }
}
