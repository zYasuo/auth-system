export function getPasswordResetEmailTemplate(resetUrl: string, userName?: string) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redefinir Senha</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background-color: #007bff;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover {
          background-color: #0056b3;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Redefinir Senha</h1>
        </div>
        
        <p>Olá${userName ? ` ${userName}` : ""},</p>
        
        <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova senha:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Redefinir Senha</a>
        </div>
        
        <div class="warning">
          <strong>⚠️ Importante:</strong>
          <ul>
            <li>Este link expira em 1 hora</li>
            <li>Só pode ser usado uma vez</li>
            <li>Se você não solicitou esta redefinição, ignore este email</li>
          </ul>
        </div>
        
        <p>Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
        <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
          ${resetUrl}
        </p>
        
        <div class="footer">
          <p>Este é um email automático, não responda.</p>
          <p>Se você não solicitou esta redefinição de senha, pode ignorar este email com segurança.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
