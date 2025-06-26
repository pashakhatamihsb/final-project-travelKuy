import {getMyTransactions} from "@/lib/data";
import {Card, CardContent} from "@/components/ui/card";
import Link from "next/link";
import {ArrowRight, ShoppingBag} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import PageHeader from "@/components/ui/PageHeader";

// Helper untuk format mata uang dan tanggal
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 0}).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});

export default async function TransactionsPage() {
    const transactions = await getMyTransactions();

    return (
        <>
            <PageHeader title="Riwayat Transaksi Saya" description="Lihat semua aktivitas pembayaran dan pemesanan Anda."/>
            <div className="container mx-auto py-8">
                <div className="space-y-4">
                    {transactions.length > 0 ? (
                        transactions.map((trx) => (
                            <Link href={`/transactions/${trx.id}`} key={trx.id} className="block group">
                                <Card className="hover:border-primary transition-colors">
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-primary group-hover:underline">INV/{trx.id.split('-')[0].toUpperCase()}</p>
                                            <p className="text-sm text-muted-foreground">{formatDate(trx.createdAt)}</p>
                                            <Badge variant={trx.status === 'paid' ? 'success' : 'secondary'} className="mt-2 capitalize">{trx.status}</Badge>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <p className="font-bold text-xl">{formatCurrency(trx.total)}</p>
                                            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1"/>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center border-2 border-dashed rounded-lg p-12">
                            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground"/>
                            <h2 className="mt-4 text-xl font-semibold">Belum Ada Transaksi</h2>
                            <p className="text-muted-foreground">Anda belum melakukan transaksi apapun.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}