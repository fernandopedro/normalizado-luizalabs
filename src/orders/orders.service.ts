import { Injectable } from '@nestjs/common';
import { OrdersFilterDto } from './dto/filters.dto';

export interface RawOrderLine {
    userId: number;
    userName: string;
    orderId: number;
    productId: number;
    value: number;
    date: string;
}

export interface NormalizedUser {
    user_id: number;
    name: string;
    orders: NormalizedOrder[];
}

interface NormalizedOrder {
    order_id: number;
    total: string;
    date: string;
    products: {
        product_id: number;
        value: string;
    }[];
}

@Injectable()
export class OrdersService {
    private dados: NormalizedUser[] = [];

    parseFile(conteudo: string) {
        const dadosCrus = this.parseLinhas(conteudo);
        this.dados = this.normalize(dadosCrus);
        return this.dados;
    }

    private parseLinhas(conteudo: string): RawOrderLine[] {
        const linhas = conteudo.split(/\r?\n/).filter((l) => l.trim().length > 0);

        return linhas.map((linha) => {
            const userId = parseInt(linha.substring(0, 10));
            const userName = linha.substring(10,55).trim();
            const orderId = parseInt(linha.substring(55, 65));
            const productId = parseInt(linha.substring(65, 75));
            const value = parseFloat(linha.substring(75, 87));

            const dateRaw = linha.substring(87, 95);
            const date = `${dateRaw.substring(0, 4)}-${dateRaw.substring(4, 6)}-${dateRaw.substring(6, 8)}`;

            return {
                userId,
                userName,
                orderId,
                productId,
                value,
                date
            };
        });
    }

    private normalize(dados: RawOrderLine[]): NormalizedUser[] {
        const usersMap = new Map<number, NormalizedUser>();

        for (const item of dados) {
            if (!usersMap.has(item.userId)) {
                usersMap.set(item.userId, {
                    user_id: item.userId,
                    name: item.userName,
                    orders: [],
                });
            }

            const user = usersMap.get(item.userId)!;
            let order = user.orders.find((o) => o.order_id === item.orderId);

            if (!order) {
                order = {
                    order_id: item.orderId,
                    date: item.date,
                    total: '0',
                    products: [],
                };
                user.orders.push(order);
            }

            order.products.push({
                product_id: item.productId,
                value: item.value.toFixed(2),
            });

            // Recalculando o  total
            const valorTotalPedido = order.products.reduce((acc, p) => acc + parseFloat(p.value), 0);
            order.total = valorTotalPedido.toFixed(2);
        }
        return Array.from(usersMap.values());
    }

    getOrders(filters?: OrdersFilterDto): NormalizedUser[] {
        if (!this.dados.length) {
            throw new Error('Faça o upload primeiro');
        }

        const { orderId, dataInicio, dataFim } = filters || {};

        // Retorna tudo caso não seja informado filtros
        if (!orderId && !dataInicio && !dataFim) {
            return this.dados;
        }

        const resultado = this.dados.map((user) => {
            const ordensFiltradas = user.orders.filter((order) => {
                let valido = true;

                if (orderId) {
                    valido = valido && order.order_id === Number(orderId);
                }

                if (dataInicio && dataFim) {
                    valido = 
                        valido && 
                        order.date >= dataInicio &&
                        order.date <= dataFim;
                }

                return valido;
            });

            return {...user, orders:ordensFiltradas };
        });

        // Remove usuários sem pedidos
        return resultado.filter((u) => u.orders.length > 0);
    }
}
