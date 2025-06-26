import {getTransactionById} from "@/lib/data";
import {notFound} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";

// Helper
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 0}).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});

export default async function TransactionDetailPage({params}) {
    const transaction = await getTransactionById(params.id);

    if (!transaction) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Detail Transaksi</CardTitle>
                            <p className="text-sm text-muted-foreground pt-1">INV/{transaction.id.split('-')[0].toUpperCase()}</p>
                        </div>
                        <Badge variant={transaction.status === 'paid' ? 'success' : 'secondary'} className="capitalize">{transaction.status}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Ringkasan</h3>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Tanggal:</span> <span
                                className="font-medium">{formatDate(transaction.createdAt)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Metode Pembayaran:</span> <span
                                className="font-medium">{transaction.paymentMethod?.name || 'N/A'}</span></div>
                        </div>
                    </div>
                    <Separator/>
                    <div>
                        <h3 className="font-semibold mb-2">Rincian Item</h3>
                        <div className="space-y-2 text-sm">
                            {transaction.items.map(item => (
                                <div key={item.id} className="flex justify-between">
                                    <p className="flex-1 pr-4">{item.activity.title}</p>
                                    <p className="font-medium text-right">{formatCurrency(item.price)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-4">
                    <div className="w-full flex justify-between font-bold text-lg">
                        <span>Total Pembayaran</span>
                        <span>{formatCurrency(transaction.total)}</span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}