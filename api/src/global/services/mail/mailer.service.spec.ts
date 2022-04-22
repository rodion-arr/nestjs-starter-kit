import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

jest.mock('nodemailer');

describe('MailerService', () => {
  let service: MailService;
  const connectMock = jest.mocked(createTransport);
  const sendMock = jest.fn().mockResolvedValue({ response: 'mock-response' });

  beforeEach(async () => {
    connectMock.mockReturnValueOnce({
      sendMail: sendMock,
    } as unknown as Transporter<SMTPTransport.SentMessageInfo>);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              from: 'from-mail',
              transportOptions: {
                host: 'smtp-host',
                port: 123,
                auth: {
                  user: 'smtp-user',
                  pass: 'smtp-pass',
                },
              },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to SMTP', () => {
    const connectMock = jest.mocked(createTransport);

    expect(connectMock).toHaveBeenCalledWith({
      host: 'smtp-host',
      port: 123,
      auth: {
        user: 'smtp-user',
        pass: 'smtp-pass',
      },
    });
  });

  it('should send mail according to options', async () => {
    const sendOptions = {
      to: 'to-mail@example.com',
      from: service.from(),
      subject: 'User registered',
    };
    const mailResult = await service.send(sendOptions);

    expect(mailResult).toBe('mock-response');
    expect(sendMock).toHaveBeenCalledWith(sendOptions);
  });

  it('should return from mail', () => {
    expect(service.from()).toBe('from-mail');
  });
});
