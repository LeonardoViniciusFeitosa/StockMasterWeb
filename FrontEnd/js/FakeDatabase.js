const today = new Date();

export const products = [
    {
        id: 1,
        name: "Teclado",
        category: "Eletrônico",
        supplierId: 1,
        quantity: 35,
        costValue: 20,
        sellValue: 30,
        notes: null,
    },
    {
        id: 2,
        name: "Mouse",
        category: "Eletrônico",
        supplierId: 1,
        quantity: 75,
        costValue: 10,
        sellValue: 15,
        notes: null,
    },
    {
        id: 3,
        name: "Monitor",
        category: "Eletrônico",
        supplierId: 1,
        quantity: 12,
        costValue: 350,
        sellValue: 500,
        notes: null,
    }
];

export const sales = [
    {
        id: 1,
        customerId: 1,
        saleDate: today,

        items: [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 }
        ],

        get value() {
            return calculateValue(this);
        },

        get profit() {
            return calculateProfit(this);
        }
    },

    {
        id: 2,
        customerId: 1,
        saleDate: new Date(2026, 3, 12),

        items: [
            { productId: 2, quantity: 4 },
            { productId: 3, quantity: 1 }
        ],

        get value() {
            return calculateValue(this);
        },

        get profit() {
            return calculateProfit(this);
        }
    }
];

export const customers = [
    {
        id: 1,
        name: "Luís",
        document: "391.115.030-09",
        address: "Praça da Liberdade, 645 - Boa Viagem, Campinas - SP",
        number: "1431245483",
        email: "luiscampinas@hotmail.com.br",
        notes: ""
    },
    {
        id: 2,
        name: "Papelaria Osório",
        document: "37.257.615/0001-08",
        address: "Rua das Flores, 959 - Jardim Paulista, Campinas - SP",
        number: "1531435285",
        email: "JardimPaulista@paperosorio.com",
        notes: "Disponível para receber mercadoria em horário comercial (09:00 - 18:00)"
    }
]

export function getProductById(id) {
    return products.find(p => p.id === id);
}

function calculateValue(sale) {
    return sale.items.reduce((total, item) => {
        const product = getProductById(item.productId);
        return total + (product.sellValue * item.quantity);
    }, 0);
}

function calculateProfit(sale) {
    return sale.items.reduce((total, item) => {
        const product = getProductById(item.productId);
        return total + ((product.sellValue - product.costValue) * item.quantity);
    }, 0);
}

export function getCustomerById(id){
    return customers.find(c => c.id == id);
}