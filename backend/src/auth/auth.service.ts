import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErpDataService } from '../erp-data.service';

@Injectable()
export class AuthService {
  constructor(private readonly data: ErpDataService) {}

  login(email: string) {
    const user = this.data.users.find((item) => item.email === email);
    if (!user) {
      throw new UnauthorizedException('Usuario nao encontrado no mandante LERP.');
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
      { role: 'ADMIN', description: 'Acesso total aos modulos ERP' },
      { role: 'BUYER', description: 'Compras, produtos e reposicao' },
      { role: 'WAREHOUSE', description: 'Movimentacoes de estoque e separacao' },
      { role: 'SALES', description: 'Pedidos, clientes e faturamento' },
    ];
  }
}
