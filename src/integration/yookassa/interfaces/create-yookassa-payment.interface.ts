export interface ICreateYookassaPayment {
    orderId: string;
    price: string;
    redirect_link: string;
    description: string;
}

export interface ICreateYookassaPaymentReturn {
    url: string | undefined;
    id: string;
}
