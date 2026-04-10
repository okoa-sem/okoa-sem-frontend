import { PaymentProvider } from '@/app/providers/payments-provider/PaymentsProvider';

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PaymentProvider>
      {children}
    </PaymentProvider>
  )
}