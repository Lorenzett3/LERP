import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErpDataService } from '../erp-data.service';

@Injectable()
export class AuthService {
  constructor(private readonly data: ErpDataService) {}

  login(email: string) {
    const user = this.data.users.find((item) => item.email === email);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado no mandante LERP.');
    }

    return {
      accessToken: `demo-token-${user.id}`,
      client: '800',
      language: 'PT',
      user,
      authorizations: ['MM_DISPLAY', 'SD_PROCESS', 'FI_DASHBOARD'],
    };
  }

  roles() {
    return [
      { role: 'ADMIN', description: 'Acesso total aos módulos ERP' },
      { role: 'BUYER', description: 'Compras, produtos e reposição' },
      { role: 'WAREHOUSE', description: 'Movimentações de estoque e separação' },
      { role: 'SALES', description: 'Pedidos, clientes e faturamento' },
    ];
  }
}
