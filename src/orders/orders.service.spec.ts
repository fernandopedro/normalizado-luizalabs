import { OrdersService } from './orders.service'

describe('OrdersService', () => {
    let service: OrdersService;

    beforeEach(() => {
        service = new OrdersService();
    });

    const mockFileContent = `
0000000070                              Palmer Prosacco00000007530000000003     1836.7420210308
0000000075                                  Bobbie Batz00000007980000000002     1578.5720211116
0000000049                               Ken Wintheiser00000005230000000003      586.7420210903
0000000014                                 Clelia Hills00000001460000000001      673.4920211125
0000000057                          Elidia Gulgowski IV00000006200000000000     1417.2520210919
0000000080                                 Tabitha Kuhn00000008770000000003      817.1320210612
0000000023                                  Logan Lynch00000002530000000002      322.1220210523
0000000015                                   Bonny Koss00000001530000000004        80.820210701
0000000017                              Ethan Langworth00000001690000000000      865.1820210409
0000000077                         Mrs. Stephen Trantow00000008440000000005     1288.7720211127
    `.trim();

    it('fazendo o parse das inhas', () => {
        const resultado = (service as any).parseLinhas(mockFileContent);
        
        expect(resultado.length).toBe(10);
        expect(resultado[0]).toEqual({
            userId: 70,
            userName: 'Palmer Prosacco',
            orderId: 753,
            productId: 3,
            value: 1836.74,
            date: '2021-03-08'
        });
    });

    it('filtro por intervalo de datas', () => {
        service.parseFile(mockFileContent);

        const resultado = service.getOrders({
            dataInicio: '2021-03-08',
            dataFim: '2021-03-08'
        });

        // Só Palmer Prosacco tem data de 2021
        expect(resultado.length).toBe(1);
        expect(resultado[0].name).toBe('Palmer Prosacco');
    })

    it('filtro por orderId', () => {
        service.parseFile(mockFileContent);

        const resultado = service.getOrders({ orderId: '753'});
        expect(resultado.length).toBe(1);
        expect(resultado[0].user_id).toBe(70);
    })
})